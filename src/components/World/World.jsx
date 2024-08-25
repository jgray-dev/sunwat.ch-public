import {useEffect, useState} from "react";
import {AiOutlineColumnHeight} from "react-icons/ai";
import {CiCircleQuestion, CiCloudOn} from "react-icons/ci";
import {MdOutlineVisibility} from "react-icons/md";
import {FaThermometerHalf} from "react-icons/fa";
import main from "./Ratingfromname";
import {SparklesIcon} from "@heroicons/react/24/outline";

const baseUrl = `https://webcams.windy.com/webcams/public/embed/player?playerType=day&webcamId=`;

//Pass app level state into component so we don't re-fetch everytime thewe switch pages
export default function World({worldData, setWorldData, theme}) {
    useEffect(() => {
        fetch(`https://mynameisnt.kim/sunwatch/data/webcams.php`)
            .then(r => r.json())
            .then(data => {
                getWorldData(data);
            });
    }, []);

    //Get cards for each camera and update state when all are received
    async function getWorldData(cameras) {
        try {
            const promises = cameras.map(camera => getCard(camera));
            const cards = await Promise.all(promises);
            setWorldData(cards);
        } catch (error) {
            console.error(error);
        }
    }

    //Create card for each camera ID
    async function getCard(camera) {
        try {
            let apiUrl = `https://api.windy.com/webcams/api/v3/webcams/${camera.id}?lang=en&include=location`;
            const response = await fetch(`https://mynameisnt.kim/sunwatch/proxy.php?url=${encodeURIComponent(apiUrl)}`);
            const data = await response.json();
            let location = `${data.location.city}, ${data.location.region}//${data.location.country}`;
            if (location === "Providenciales, Providenciales//Turks and Caicos Islands") {
                location = "Providencia, Santiago Del Estero//Turks and Caicos";
            }
            if (location === "Stellenbosch Local Municipality, Western Cape//South Africa") {
                location = "Stellenbosch, Western Cape//South Africa";
            }
            return WebcamPlayer(`${baseUrl}${camera.id}`, location, data.lastUpdatedOn, theme);
        } catch (error) {
            console.error("Error fetching data:", error);
            return <div className="bg-slate-700 text-slate-300 h-screen">Loading...</div>;
        }
    }

    //Ternary to display Loading or thedata itself
    return (
        <div className={`${theme.bg} ${theme.text} min-h-screen text-sm text-center pt-12 pb-12`}>
            {worldData ? worldData : "Loading......."}
        </div>
    );
}

//Additional card element with iframe webcam
async function WebcamPlayer(url, location, lastUpdate, theme) {
    try {
        const data = await main(location.split("//")[0]);
        const date = new Date(lastUpdate);
        const options = {
            timeZone: data.timezone,
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        };
        const formattedUpdateTime = date.toLocaleString("en-US", options);
        if (data) {
            return (
                <div key={url}>
                    <div className="my-6 flex flex-col md:flex-row items-center justify-between">
                        <div className="w-full md:w-1/2 pb-4 md:pb-0 md:pr-8">
                            <p className={`px-4 md:px-12 pt-8 md:pt-12 text-2xl font-bold ${theme.text}`}>
                                {location.split("//")[0]} ({location.split("//")[1]})
                            </p>
                            <p className="text-sm px-4 md:px-12">Last updated {formattedUpdateTime}</p>
                            <div className="px-4 md:px-12 pt-8 md:pt-12">
                                {/* Rest of the code */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <CiCircleQuestion className="h-8 w-8 fill-emerald-400 mr-2"/>
                                        <div className="text-left">
                                            <p>{data.eventType}:</p>
                                            <p>Local time:</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>{data.eventTime}</p>
                                        <p>{data.localTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <SparklesIcon className="h-8 w-8 stroke-emerald-400 mr-2"/>
                                        <p>Rating:</p>
                                    </div>
                                    <p>{data.rating}/100</p>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <CiCloudOn className="h-8 w-8 fill-emerald-400 mr-2"/>
                                        <p>Cloud cover:</p>
                                    </div>
                                    <p>{data.cloudcover}%</p>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <AiOutlineColumnHeight className="h-8 w-8 fill-emerald-400 mr-2"/>
                                        <p>Cloud height:</p>
                                    </div>
                                    <p>{data.cloudceiling}ft</p>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <MdOutlineVisibility className="h-8 w-8 fill-emerald-400 mr-2"/>
                                        <p>Visibility:</p>
                                    </div>
                                    <p>{data.visibility}mi</p>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <FaThermometerHalf className="h-8 w-8 fill-emerald-400 mr-2"/>
                                        <p>Temperature:</p>
                                    </div>
                                    <p>{data.temperature}f</p>
                                </div>
                            </div>
                        </div>
                        <div className="mx-auto md:mx-0 w-full md:w-1/2 px-4 md:px-8">
                            <iframe
                                className="w-full max-w-full h-auto aspect-video"
                                src={url}
                                title={location}
                            />
                        </div>
                    </div>
                    <div className="relative w-full pb-6">
                        <div className="flex items-center justify-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                    </div>
                </div>
            );
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return <div>Loading...</div>;
    }
}
