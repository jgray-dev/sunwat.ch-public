import {deleteAllCookies, printAllCookies} from "../Functions/Cookies.jsx";
import {useEffect, useState} from "react";
import getAppState from "../Functions/Main.jsx";
import Searchbox from "./Searchbox.jsx";
import {CiCircleQuestion, CiCloudOn} from "react-icons/ci";
import {SparklesIcon} from "@heroicons/react/24/outline";
import {AiOutlineColumnHeight} from "react-icons/ai";
import {FaThermometerHalf} from "react-icons/fa";
import {MdOutlineVisibility} from "react-icons/md";


function Local({appState, setAppState, theme}) {
  const [colors, setColors] = useState({
    ratingColor: "text-slate-100",
    coverColor: "text-slate-100",
    ceilingColor: "text-slate-100",
    visColor: "text-slate-100",
    tempColor: "text-slate-100",
  });


  // Get data for appState - location, data, ratings, EVERYTHING
  useEffect(() => {
    getAppState({appState, setAppState});
  }, []);


  //Credit: Claude.ai -> takes in a rating and returns a tailwind color based on that rating
  const {ratingColor, coverColor, ceilingColor, visColor, tempColor} = colors;
  const calculateColor = (rating) => {
    if (rating <= 10) return "text-red-600"; // Dark red (bad)
    if (rating <= 20) return "text-red-400";
    if (rating <= 30) return "text-red-200";
    if (rating <= 40) return "text-red-100";
    if (rating <= 60) return "text-slate-200"; // Neutral
    if (rating <= 70) return "text-green-100";
    if (rating <= 80) return "text-green-200";
    if (rating <= 90) return "text-green-400";
    return "text-green-600"; // Dark green (good)
  };

  //Reset our colors whenever appState updates
  useEffect(() => {
    if (appState.hasData) {
      setColors({
        ratingColor: calculateColor(appState.rating),
        coverColor: calculateColor(appState.coverRating * 2.5),
        ceilingColor: calculateColor(appState.ceilingRating * 2.5),
        visColor: calculateColor(appState.visRating * 10),
        tempColor: calculateColor(appState.tempRating * 10),
      });
    }
  }, [appState]);


  return (
    <div>
      <Searchbox className="" appState={appState} setAppState={setAppState} theme={theme}/>
      <div className={`${theme.bg} ${theme.text} text-sm text-center flex flex-col min-h-screen`}>
        <div className={`${theme.bg} ${theme.text} min-h-full py-6 text-lg text-left flex-grow`}>
          {appState.rating ? (
            <>
              <div className="my-6 flex flex-col md:flex-row items-center justify-between">
                <div className="w-full md:w-1/2 pb-4 md:pb-0 md:pr-8">
                  <p className={`px-4 md:px-12 pt-8 md:pt-12 text-2xl font-bold ${theme.text}`}>
                    {appState.city} ({appState.localTime})
                  </p>
                  <div className="px-4 md:px-12 pt-8 md:pt-12">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CiCircleQuestion className="h-8 w-8 fill-slate-200 mr-2"/>
                        <div className="text-left">
                          <p>Event Type</p>
                          <p>Time of {appState.visType}</p>
                        </div>
                      </div>
                      <div className="text-right text-slate-100">
                        <p>
                          {appState.eventType.charAt(0).toUpperCase() +
                            appState.eventType.slice(1)}
                        </p>
                        <p>{appState.visTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <SparklesIcon className={`h-8 w-8 ${ratingColor} mr-2`}/>
                        <p>Rating</p>
                      </div>
                      <p className={ratingColor}>{appState.rating}/100</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CiCloudOn className={`h-8 w-8 ${coverColor} mr-2`}/>
                        <p>Cloud cover</p>
                      </div>
                      <p className={coverColor}>{appState.avgCover}%</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <AiOutlineColumnHeight className={`h-8 w-8 ${ceilingColor} mr-2`}/>
                        <p>Cloud height</p>
                      </div>
                      <p className={ceilingColor}>{appState.avgCeiling}ft</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <MdOutlineVisibility className={`h-8 w-8 ${visColor} mr-2`}/>
                        <p>Visibility</p>
                      </div>
                      <p className={visColor}>{appState.avgVis}mi</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FaThermometerHalf className={`h-8 w-8 ${tempColor} mr-2`}/>
                        <p>Temperature</p>
                      </div>
                      <p className={tempColor}>{appState.avgTemp}f</p>
                    </div>
                  </div>
                </div>
                <div className="mx-auto md:mx-0 w-full md:w-1/2 px-4 md:px-8">
                  <div className="text-center w-full pb-4">
                    <p className="text-2xl">Nearest webcam:</p>
                    <p>{appState.localWebcamName}</p>
                    <p
                      className="text-sm">{(appState.localWebcamUpdated !== "") ? `Last updated at ${appState.localWebcamUpdated}` : "Here's downtown Denver!"}</p>
                  </div>
                  <iframe
                    className="w-full max-w-full h-auto aspect-video"
                    src={appState.localWebcam}
                    title={appState.city}
                  />
                </div>
              </div>
            </>
          ) : (<div>
            <p className="text-red-400 text-center text-2xl w-full">Loading data</p>
            <p className="text-gray-500 text-center w-full text-sm">If you get stuck here, please submit feedback and
              try a new location!</p>
          </div>)}
        </div>
      </div>
    </div>
  );
}

export default Local