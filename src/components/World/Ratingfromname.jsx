//HEAVILY stripped version of my original V1 javascript. Takes in a location name, and returns an object with basic values about that location.
// Used for quick rendering of data of locations around the world.

import {get24eventTime, getTimeOfData} from "../Functions/Time.jsx";
import {interpolateCloudCeilingRating, interpolateCloudCover} from "../Functions/Rating.jsx";

const APIKEY = "REPLACEWITHAPIKEY";

//Get world data from just a name - this function is only used for our world page, so we dont need ALL the data we need for local page
export default async function main(name) {
    let city, lat, lon, key, timezone;


    await setCityKey(name, (data) => {
        city = data.LocalizedName;
        lat = data.GeoPosition.Latitude;
        lon = data.GeoPosition.Longitude;
        key = data.Key;
        timezone = data.TimeZone.Name;
    });


    // Get local time in a timezone using DateTimeFormat
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
    });
    let localTime = formatter.format(new Date());
    const times = await getTimes(lat, lon);
    const type = getType(times, timezone);
    const eventTime = getTime(type, times);


    let data = await getData(key);

    //Returns true if we're currently in the same hour of the event
    function isEventNear() {
        const eventTime = get24eventTime(times[type]);
        const dataTime = getTimeOfData(data);
        if (Math.abs(dataTime - eventTime) < 100) {
            return true;
        }
    }

    //Switch data if isDaylight is believed to be faulty (if sunrise is at hour 5, and hour 5 has isDaylight false, set it to true)
    function checkData(data) {
        if (data[0]["IsDaylight"] !== (type === "sunset")) {
            data[0]["IsDaylight"] = (type === "sunset");
        }
        return data;
    }

    if (isEventNear()) {
        data = checkData(data)
    }

    const daylightSwitches = findDaylightSwitches(data);

    //Dont return anything that doesnt have an event, or where the event is too far away
    if (daylightSwitches.length === 0) {
        return false;
    }
    if (daylightSwitches[0][0] > 5) {
        return false;
    }
    const priorHour = data[daylightSwitches[0][0]];
    const hour = data[daylightSwitches[0][1]];
    const cloudcover = avg(priorHour.CloudCover, hour.CloudCover);
    const cloudceiling = avg(priorHour.Ceiling.Value, hour.Ceiling.Value);
    const visibility = avg(priorHour.Visibility.Value, hour.Visibility.Value);
    const temperature = avg(priorHour.Temperature.Value, hour.Temperature.Value);
    const rating = createRating(cloudcover, cloudceiling, temperature, visibility);


    const eventType = type.charAt(0).toUpperCase() + type.slice(1);
    return {
        rating: rating,
        eventTime: eventTime,
        eventType: eventType,
        cloudcover: cloudcover,
        cloudceiling: cloudceiling,
        visibility: visibility,
        temperature: temperature,
        localTime: localTime,
        timezone: timezone
    };
}

//Get type of event based on current time and timessunrise/sunset times
function getType(times, timezone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour12: false,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
    let localTime = formatter.format(new Date());
    const now = get24eventTime(localTime)
    const sunset = get24eventTime(times.sunset);
    const sunrise = get24eventTime(times.sunrise);
    if (now < sunrise) {
        return "sunrise";
    } else if (now >= sunrise && now < sunset) {
        return "sunset";
    } else {
        return "sunrise";
    }
}

//Get the specific time of the type of event
function getTime(type, times) {
    const raw = times[type];
    let parts = raw.split(":");
    return parts[0] + ":" + parts[1] + parts[2].slice(2);
}

//get all times based on lat/lon coordinates
async function getTimes(lat, lon) {
    const url = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

//Get accuweather key for the current city name
async function setCityKey(name, callback) {
    const apiUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${APIKEY}&q=${name}`;
    const response = await fetch(`https://mynameisnt.kim/sunwatch/proxy.php?url=${encodeURIComponent(apiUrl)}`);
    const data = await response.json();
    if (data.length !== 0) {
        callback(data[0]);
    } else {
        console.error(`No locations found. (${name})`);
    }
}

//Get accuweather data for the next 12 hours based on city key
async function getData(key) {
    const apiUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}?apikey=${APIKEY}&details=true`;
    const response = await fetch(`https://mynameisnt.kim/sunwatch/proxy.php?url=${encodeURIComponent(apiUrl)}`);
    return await response.json();
}

//Custom function to return which 2 data points contain a "switch" from isDaylight true-> false(sunset), or false->true(sunrise)
function findDaylightSwitches(data) {
    const switches = [];
    let previousIsDaylight = data[0].IsDaylight;
    for (let i = 1; i < data.length; i++) {
        if (data[i].IsDaylight !== previousIsDaylight) {
            switches.push([i - 1, i]);
            previousIsDaylight = data[i].IsDaylight;
        }
    }
    return switches;
}

//you'll be okay with documentation for this one lol
function avg(v1, v2) {
    return Math.floor((v1 + v2) / 2);
}

//Math to make a rating based on the data points - use the same math from /functions/Rating.jsx for consistency thru the app
function createRating(cloudcover, cloudceiling, temperature, visibility) {
    let cloudrating = interpolateCloudCover(cloudcover);
    if (cloudrating > 40) {
        cloudrating = 40;
    }
    const ceilingmult = cloudrating / 35;
    let ceilingrating = interpolateCloudCeilingRating(cloudceiling);
    ceilingrating = ceilingrating * ceilingmult;
    if (ceilingrating > 40) {
        ceilingrating = 40;
    }

    let temperaturerating = 0.13 * temperature;
    if (temperaturerating > 20) {
        temperaturerating = 20;
    } else if (temperaturerating < 0) {
        temperaturerating = 0;
    }

    return Math.floor(
        cloudrating + ceilingrating + temperaturerating + visibility
    );
}

