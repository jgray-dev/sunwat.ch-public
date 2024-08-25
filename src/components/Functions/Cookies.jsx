//Return our cookies as an object
export function readCookie() {
  let cookies = document.cookie.split("; ");
  let cookieObject = {};
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split("=");
    cookieObject[cookie[0]] = cookie[1];
  }
  if (cookieObject.brief) {
    cookieObject.brief = decodeURIComponent(cookieObject.brief); // decode the brief
  }
  return cookieObject;
}


//Debug to print all our cookies
export function printAllCookies() {
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    if (name !== "undefined") {
      console.log(cookie)
    }
  }
}

//Deletes all saved cookies
export function deleteAllCookies() {
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    if (name !== "undefined") {
      document.cookie =
        name + "=; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
}

//Sets our cookie
export function updateCookie(tempState) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1); // Cookie will expire in 1 year
  document.cookie = `key=${tempState.key}; SameSite=Strict; Expires=${date.toUTCString()}`;
  document.cookie = `lat=${tempState.lat}; SameSite=Strict; Expires=${date.toUTCString()}`;
  document.cookie = `lon=${tempState.lon}; SameSite=Strict; Expires=${date.toUTCString()}`;
  document.cookie = `city=${tempState.city}; SameSite=Strict; Expires=${date.toUTCString()}`;
  document.cookie = `timezone=${tempState.timezone}; SameSite=Strict; Expires=${date.toUTCString()}`;
  document.cookie = `theme=${tempState.theme}; SameSite=Strict; Expires=${date.toUTCString()}`;
}
