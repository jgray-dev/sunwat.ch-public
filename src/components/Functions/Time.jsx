//Function returns an array of all event times for the day - sunrise, sunset, dawn, dusk, golden hour, etc
export async function getTimes({tempState}) {
  let times;
  const url = `https://api.sunrisesunset.io/json?lat=${tempState.lat}&lng=${tempState.lon}`;
  await fetch(url)
    .then((r) => r.json())
    .then((r) => {
      times = r["results"];
    });
  return times;
}


//funky little format I use to see if time is before or after other times (3:42PM -> 1542, 3:45AM -> 0345, etc)
export function get24eventTime(time) {
  let offset = 0;
  if (time.split(" ")[1] === "PM") {
    offset = 12;
  }
  const final =
    parseInt(time.split(" ")[0].split(":")[0]) + offset + time.split(" ")[0].split(":")[1];
  return parseInt(final);
}

//Get specific time of the event
export function getEventTime({tempState}) {
  let visType
  (tempState.eventType === "sunrise") ? visType = "dawn" : visType = "sunset"
  let raw = tempState.allTimes[`${visType}`];
  let parts = raw.split(":");
  tempState.visTime = parts[0] + ":" + parts[1] + parts[2].slice(2)
  tempState.visType = visType

  raw = tempState.allTimes[`${tempState.eventType}`];
  parts = raw.split(":");
  return parts[0] + ":" + parts[1] + parts[2].slice(2);
}

//Get the time associated with the current array of data
export function getTimeOfData(data) {
  if (data[0]["DateTime"]) {
    let dataTime = data[0]["DateTime"].split("T")[1].split(":")[0];
    return parseInt(dataTime + data[0]["DateTime"].split("T")[1].split(":")[1]);
  } else {
    let dataTime = data[0]["LocalObservationDateTime"].split("T")[1].split(":")[0];
    return parseInt(dataTime + data[0]["LocalObservationDateTime"].split("T")[1].split(":")[1]);
  }
}