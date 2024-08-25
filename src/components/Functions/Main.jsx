import {deleteAllCookies, readCookie, updateCookie} from "./Cookies.jsx";
import {avg, findDaylightSwitches, formatData, getData, getIp, getKeyFromIp,} from "./Data.jsx";
import {getEventTime, getTimes} from "./Time.jsx";
import {createRating} from "./Rating.jsx";

export const APIKEY = "REPLACEWITHAPIKEY";


export default async function getAppState({appState, setAppState}) {
    let tempState = {...appState}
    if (!tempState.hasData) { // main() may be called when a person navigates between /local and /world for example, we dont want to re-fetch in this case - we can just use our saved states and render from that. This will be false when a person first loads the page or location change

        const ip = await getIp()
        tempState.clientIp = ip
        const cookieObj = readCookie()
        if (cookieObj["key"] !== "" && cookieObj["key"] !== "undefined") { // City key cookie is set, using stored location
            tempState.key = cookieObj["key"];
            tempState.lat = cookieObj["lat"];
            tempState.lon = cookieObj["lon"];
            tempState.city = cookieObj["city"];
            tempState.timezone = cookieObj["timezone"];
            tempState.theme = cookieObj["theme"];
        } else {
            if (ip) {
                let ipReturn = await getKeyFromIp(ip)
                tempState.city = ipReturn.city
                tempState.lat = ipReturn.lat
                tempState.lon = ipReturn.lon
                tempState.key = ipReturn.key
                tempState.timezone = ipReturn.timezone
                updateCookie(tempState)
            } else {
                console.error("Error getting IP")
                alert("Error getting IP")
            }
        }
        // Location info should now be loaded as our "local" vars (declared on line 7)
        tempState.data = await getData(tempState.key)
        tempState.allTimes = await getTimes({tempState})


        tempState = findDaylightSwitches(tempState)
        if (tempState.daylightSwitches.length === 0) { // no events exist - either use cookie data or tell them check again later
            alert(
                "No sunrise or sunset events were found in the next 12 hours. Try again later",
            );
            return 0;
        } else { // daylightswitches exist and we have data - continue onwards!
            tempState.eventTime = getEventTime({tempState})
            tempState.timeType = (tempState.eventType === "sunrise") ? "sunrise" : "sunset"
            const priornum = tempState.daylightSwitches
            const num = tempState.daylightSwitches + 1
            tempState.priorHour = tempState.data[priornum];
            tempState.hour = tempState.data[num];
            if (tempState.priorHour.EpochTime) {
                tempState.priorHour = formatData(tempState.priorHour)
            }
            if (tempState.hour.EpochTime) {
                tempState.hour = formatData(tempState.hour)
            }
            let ratio
            if (parseInt(tempState.eventTime.split(":")[1].split(" ")[0]) !== 0) {
                ratio = parseInt(tempState.eventTime.split(":")[1].split(" ")[0]) / 60
            } else {
                ratio = 0
            }
            //Get averages for data
            tempState.avgCover = avg(
                tempState.priorHour["CloudCover"],
                tempState.hour["CloudCover"],
                ratio);
            tempState.avgCeiling = avg(
                tempState.priorHour["Ceiling"]["Value"],
                tempState.hour["Ceiling"]["Value"],
                ratio
            );
            tempState.avgTemp = avg(
                tempState.priorHour["Temperature"]["Value"],
                tempState.hour["Temperature"]["Value"],
                ratio
            );
            tempState.avgVis = avg(
                tempState.priorHour["Visibility"]["Value"],
                tempState.hour["Visibility"]["Value"],
                ratio
            );

            //Get color coordinated classnames based on ratings
            function setColors(coverRating, ceilingRating, tempRating, visRating) {
                tempState.coverRating = coverRating
                tempState.ceilingRating = ceilingRating
                tempState.tempRating = tempRating
                tempState.visRating = visRating
            }

            tempState.rating = createRating(tempState.avgCover, tempState.avgCeiling, tempState.avgTemp, tempState.avgVis, setColors);

            tempState.dataType = "live"
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: tempState.timezone,
                hour12: true,
                hour: 'numeric',
                minute: '2-digit'
            });
            tempState.localTime = formatter.format(new Date());
            const webcamData = await getWebCam(tempState.lat, tempState.lon);
            if (webcamData.total > 0) {
                tempState.localWebcam = `https://webcams.windy.com/webcams/public/embed/player?playerType=day&webcamId=${webcamData.webcams[0].webcamId}`
                tempState.localWebcamName = webcamData.webcams[0].title
                tempState.localWebcamUpdated = formatter.format(new Date(webcamData.webcams[0].lastUpdatedOn))
            } else {
                tempState.localWebcam = `https://webcams.windy.com/webcams/public/embed/player?playerType=day&webcamId=1496940400`
                tempState.localWebcamName = "No local webcams found!"
                tempState.localWebcamUpdated = ""
            }

            updateApp({tempState, setAppState})
            deleteAllCookies()
            tempState.theme = cookieObj["theme"];
            updateCookie(tempState)
        }
    }
}

//Get webcams in 50km radius around location
async function getWebCam(lat, lon) {
    const apiUrl = `https://api.windy.com/webcams/api/v3/webcams?nearby=${lat},${lon},50`;
    try {
        const response = await fetch(`https://mynameisnt.kim/sunwatch/proxy.php?url=${encodeURIComponent(apiUrl)}`);
        return await response.json()
    } catch (error) {
        console.error('Error fetching webcam:', error);
        return null;
    }
}


export function updateApp({tempState, setAppState}) { // Set our has data to true before resetting our states
    tempState.hasData = true;
    setAppState({...tempState})
}
