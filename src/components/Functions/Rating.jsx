//Literally does nothing - default callback to reuse a function that *sometimes* will have an argument passed
function doNothing() {

}

//Create our rating - setColors callback for local tab to set colors based on the rating
export function createRating(cloudcover, cloudceiling, temperature, visibility, setColors = doNothing) {
  let cloudrating, ceilingrating, temperaturerating;
  cloudrating = interpolateCloudCover(cloudcover);
  if (cloudrating > 40) {
    cloudrating = 40;
  }
  const ceilingmult = cloudrating / 35;
  ceilingrating = interpolateCloudCeilingRating(cloudceiling);
  ceilingrating = ceilingrating * ceilingmult;
  if (ceilingrating > 40) {
    ceilingrating = 40;
  }

  temperaturerating = 0.13 * temperature;
  if (temperaturerating > 10) {
    temperaturerating = 10;
  } else if (temperaturerating < 0) {
    temperaturerating = 0;
  }
  if (visibility > 10) {
    visibility = 10;
  } else if (visibility < 0) {
    visibility = 0;
  }

  const vismult = Math.min(visibility / 7, 1)

  setColors(cloudrating, ceilingrating, temperaturerating, visibility)
  // Set global vars to be used on hover of the rating
  return Math.floor((cloudrating + ceilingrating + temperaturerating + visibility) * vismult);
}

//Interpolate a rating based on the data - credit chatgpt/copilot/claude
export function interpolateCloudCover(cloudcover) {
  if (cloudcover < 0 || cloudcover > 100) {
    console.error(
      "Invalid cloud cover value. Please provide a value between 0 and 100.",
    );
    return null;
  }

  const points = [
    //I love magic numbers :3 Don't touch. This interpolates values to generate a rating (Credit: GitHub copilot//ChatGPT)
    {cloudcover: 0, value: 0},
    {cloudcover: 5, value: 10},
    {cloudcover: 10, value: 15},
    {cloudcover: 20, value: 30},
    {cloudcover: 30, value: 40},
    {cloudcover: 50, value: 40},
    {cloudcover: 70, value: 35},
    {cloudcover: 70, value: 32},
    {cloudcover: 80, value: 28},
    {cloudcover: 85, value: 20},
    {cloudcover: 100, value: 5},
  ];

  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];

    if (
      cloudcover >= currentPoint.cloudcover &&
      cloudcover <= nextPoint.cloudcover
    ) {
      const t =
        (cloudcover - currentPoint.cloudcover) /
        (nextPoint.cloudcover - currentPoint.cloudcover);
      return currentPoint.value + t * (nextPoint.value - currentPoint.value);
    }
  }
}

//Interpolate a rating based on the data - credit chatgpt/copilot/claude
export function interpolateCloudCeilingRating(ceiling) {
  if (ceiling < 0) {
    console.error(
      "Invalid cloud ceiling value. Please provide a non-negative value.",
    );
    return 20;
  }
  const points = [
    {ceiling: 0, rating: 0},
    {ceiling: 5000, rating: 10},
    {ceiling: 10000, rating: 17},
    {ceiling: 15000, rating: 25},
    {ceiling: 17500, rating: 35},
    {ceiling: 20000, rating: 37},
    {ceiling: 25000, rating: 40},
    {ceiling: 27500, rating: 40},
    {ceiling: 30000, rating: 37},
    {ceiling: 32500, rating: 35},
    {ceiling: 35000, rating: 32},
  ];

  // Handle values greater than 30000
  if (ceiling > 35000) {
    return 30;
  }

  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];

    if (ceiling >= currentPoint.ceiling && ceiling <= nextPoint.ceiling) {
      const t =
        (ceiling - currentPoint.ceiling) /
        (nextPoint.ceiling - currentPoint.ceiling);
      return currentPoint.rating + t * (nextPoint.rating - currentPoint.rating);
    }
  }
}
