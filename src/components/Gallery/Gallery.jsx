import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {SparklesIcon} from "@heroicons/react/24/outline";
import {CiCircleQuestion, CiCloudOn, CiTrash} from "react-icons/ci";
import {AiOutlineColumnHeight} from "react-icons/ai";
import {MdOutlineVisibility} from "react-icons/md";
import {FaRegClock, FaRegComment, FaThermometerHalf} from "react-icons/fa";
import Divider from "../Global Components/Divider.jsx";
import {createRating} from "../Functions/Rating.jsx";

function Gallery({appState, theme, authed}) {
  const [cards, updateCards] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    fetch("https://mynameisnt.kim/sunwatch/gallery/data.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const cards = getCards(data, theme, authed, fetchData);
        updateCards(cards);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className={`${theme.bg} text-slate-200 text-sm text-center items-center flex flex-col min-h-screen`}>
        {appState.hasData ? (
          <>
            <button
              className={`disabled rounded ${theme.accent} px-2 py-1 text-xs m-2 mt-8 font-semibold text-white shadow-sm ${theme.accenthover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              onClick={() => navigate("/gallery/upload")}
            >
              Upload new!
            </button>
          </>
        ) : (
          <>
            <button
              className={`cursor-not-allowed rounded ${theme.bgdark} px-2 py-1 mt-8 text-xs m-2 font-semibold text-white shadow-sm ${theme.bghover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              onClick={() => {
                alert("Please go to the local tab and set a location first!");
              }}
            >
              Upload new!
            </button>
          </>
        )}
        <div className="pt-6 flex-grow px-6">{cards}</div>
      </div>
    </>
  );
}

export default Gallery;

function handleDelete(obj, fetchData) {
  fetch('https://mynameisnt.kim/sunwatch/gallery/data.php', {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
  })
    .then(r => r.json())
    .then(r => {
      fetchData();
    })
    .catch(error => {
      console.error("Error deleting data:", error);
    });
}

function getCards(allData, theme, authed, fetchData) {
  let options = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const reversed = allData.reverse();
  return reversed.map((data) => {
    return (
      <div key={data.id} className={`py-4 ${theme.bg}}`}>
        <div className=" md:my-4 mb- flex flex-col md:flex-row justify-right">
          <div className="w-full md:w-1/2 pr-8 pb-6">
            {authed ? (
              <div className={`flex justify-center items-center px-12 text-2xl font-bold ${theme.text}`}>
                <span>{data.city}</span>
                <CiTrash
                  className="ml-2 text-white hover:text-red-400"
                  onClick={() => {
                    handleDelete(data, fetchData);
                  }}
                />
              </div>
            ) : (
              <p className={`px-12 pt-12 text-2xl font-bold ${theme.text}`}>{data.city}</p>
            )}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <SparklesIcon className="h-8 w-8 stroke-gray-200 mr-2"/>
                <p>Rating</p>
              </div>
              <p>{createRating(data.cover, data.ceiling, data.temperature, data.visibility)}/100</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <CiCloudOn className="h-8 w-8 fill-gray-200 mr-2"/>
                <p>Cloud cover:</p>
              </div>
              <p>{data.cover}%</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <AiOutlineColumnHeight className="h-8 w-8 fill-gray-200 mr-2"/>
                <p>Cloud height:</p>
              </div>
              <p>{data.ceiling}ft</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <MdOutlineVisibility className="h-8 w-8 fill-gray-200 mr-2"/>
                <p>Visibility</p>
              </div>
              <p>{data.visibility}mi</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FaThermometerHalf className="h-8 w-8 fill-gray-200 mr-2"/>
                <p>Temperature</p>
              </div>
              <p>{data.temperature}f</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FaRegComment className="h-8 w-8 fill-gray-200 mr-2"/>
                <p>User comments</p>
              </div>
              <p className="w-2/3 pl-8 text-right">{data.comments}</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FaRegClock className="h-8 w-8 fill-gray-200 mr-2"/>
                <p>Upload time</p>
              </div>
              <p className="w-2/3 pl-8 text-right">{new Date(data.id).toLocaleTimeString("en-US", options)}</p>
            </div>
          </div>
          <img alt="Event image" src={data.imageUrl} className="w-full h-full md:w-1/2 md:h-1/2 px-4 py-4"/>
        </div>
        <Divider/>
      </div>
    );
  });
}
