import {APIKEY} from "./Main.jsx";
import {submitFeedback} from "../Feedback/Feedback.jsx";
import {readCookie} from "./Cookies.jsx";

//Get IP of user
export async function getIp() {
    let ip;
    await fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
            ip = data["ip"];
        })
        .catch((error) => {
            alert(`Error ${error}`)
            const cookies = readCookie()
            submitFeedback(`Error fetching IP from ipify, ${error}. Cookies: Key: ${cookies.key} Lat: ${cookies.lat} Lon: ${cookies.lon} City: ${cookies.city} TZ: ${cookies.timezone} Theme: ${cookies.theme}`)
        })
    return ip;
}

export function formatData(oldData) {
    const newData = {...oldData}
    newData["Ceiling"]["Value"] = oldData["Ceiling"]["Imperial"]["Value"]
    newData["Temperature"]["Value"] = oldData["Temperature"]["Imperial"]["Value"]
    newData["Visibility"]["Value"] = oldData["Visibility"]["Imperial"]["Value"]
    if (newData["Visibility"]["Value"] === 1) {
        newData["Visibility"]["Value"] = newData["Visibility"]["Value"] * 10
    }
    return newData
}

//Accuweather get a key from IP addres (if cookies arent saved)
export async function getKeyFromIp(ip) {
    let city, lat, lon, key, timezone
    const apiUrl = `https://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=${APIKEY}&q=${ip}`;
    await fetch(`https://mynameisnt.kim/sunwatch/proxy.php?url=${encodeURIComponent(apiUrl)}`)
        .then((r) => r.json())
        .then((r) => {
            city = r["LocalizedName"];
            lat = r["GeoPosition"]["Latitude"];
            lon = r["GeoPosition"]["Longitude"];
            key = r["Key"];
            timezone = r["TimeZone"]["Name"];
        })
        .catch((error) => {
            alert(`Error ${error}`)
            const cookies = readCookie()
            submitFeedback(`Error fetching key from IP ${ip}, ${error}. Cookies: Key: ${cookies.key} Lat: ${cookies.lat} Lon: ${cookies.lon} City: ${cookies.city} TZ: ${cookies.timezone} Theme: ${cookies.theme}`)
        })
    return {
        city: city,
        lat: lat,
        lon: lon,
        key: key,
        timezone: timezone
    };
}

//Get accuweather data based on the city key (either saved city key or from IP)
export async function getData(key) {
    if (key === undefined || key === "" || key === "undefined") {
        alert("Key undefined")
    } else {
        let data;
        let apiUrl = `https://dataservice.accuweather.com//currentconditions/v1/${key}/historical?apikey=${APIKEY}&details=true`;
        await fetch(`https://mynameisnt.kim/sunwatch/proxy.php?url=${encodeURIComponent(apiUrl)}`)
            .then((r) => r.json())
            .then((r) => {
                data = r.reverse();
            })
            .catch((error) => {
                alert(`Error ${error}`)
                const cookies = readCookie()
                submitFeedback(`Error fetching forecast data from key ${key}, ${error}. Cookies: Key: ${cookies.key} Lat: ${cookies.lat} Lon: ${cookies.lon} City: ${cookies.city} TZ: ${cookies.timezone} Theme: ${cookies.theme}`)
            })
        apiUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}?apikey=${APIKEY}&details=true`;
        await fetch(`https://mynameisnt.kim/sunwatch/proxy.php?url=${encodeURIComponent(apiUrl)}`)
            .then((r) => r.json())
            .then((r) => {
                r.forEach((hour) => {
                    data = [...data, hour];
                })
            })
            .catch((error) => {
                alert(`Error ${error}`)
                const cookies = readCookie()
                submitFeedback(`Error fetching past data from key ${key}, ${error}. Cookies: Key: ${cookies.key} Lat: ${cookies.lat} Lon: ${cookies.lon} City: ${cookies.city} TZ: ${cookies.timezone} Theme: ${cookies.theme}`)
            })
        data.splice(0, 4)
        return data;
    }
}


//Return which accuweather data contain a "switch" of the isDaylight variable
export function findDaylightSwitches(tempState) {
    let daylightSwitch, type, x;
    (tempState.data[0].EpochTime) ? x = "IsDayTime" : x = "IsDaylight"
    let previousLight = tempState.data[0][x];

    (tempState.data[0][x]) ? type = "sunset" : type = "sunrise"
    for (let i = 1; i < tempState.data.length; i++) {
        (tempState.data[i].EpochTime) ? x = "IsDayTime" : x = "IsDaylight"
        if (tempState.data[i][x] !== previousLight) {
            daylightSwitch = i - 1
            break
        }
    }
    tempState.daylightSwitches = daylightSwitch
    tempState.eventType = type
    return tempState;
}

//lol
export function avg(v1, v2, ratio) {
    if (ratio > 1 || ratio < 0) {
        ratio = 0.5
        console.error("Error getting interp ratio (Data:115)")
    }
    return Math.round(v1 * (1 - ratio) + (v2 * ratio))
}
