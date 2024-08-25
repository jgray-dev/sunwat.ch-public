import React, {useEffect, useState} from 'react';
import {deleteAllCookies, printAllCookies} from "../Functions/Cookies.jsx";
import Unauthorized from "../Global Components/Unauthorized.jsx";
import Divider from "../Global Components/Divider.jsx";

const buttonstyle =
  'rounded bg-orange-600 px-2 py-1 text-xs m-2 font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

export default function Details({appState, theme, authed}) {
  const [response, setResponse] = useState()
  const [feedback, setFeedback] = useState()
  const colorClasses = [
    'text-red-400',
    'text-orange-400',
    'text-yellow-400',
    'text-green-400',
    'text-blue-200',
    'text-blue-700',
  ];

  function renderValue(value, level = 0) {
    const colorClass = colorClasses[level] || colorClasses[colorClasses.length - 1];
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return (
          <div style={{marginLeft: `${level}rem`}} className={colorClass}>
            {value.map((item, index) => (
              <div key={index}>
                [{index}] {renderValue(item, level + 1)}
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div style={{marginLeft: `${level}rem`}} className={colorClass}>
            {Object.entries(value).map(([key, val]) => (
              <div key={key}>
                {key}: {renderValue(val, level + 1)}
              </div>
            ))}
          </div>
        );
      }
    }
    return <span className={colorClass}>{String(value)}</span>;
  }

  function printAppState() {
    console.log(appState);
  }


  useEffect(() => {
    fetchFeedback()
  }, [])

  function fetchFeedback() {
    fetch('https://mynameisnt.kim/sunwatch/feedback/index.php', {
      method: "GET"
    })
      .then(r => r.json())
      .then(data => {
        feedbackCards(data)
      })
  }

  function feedbackCards(data) {
    const cards = data.map((each) => (
      <div key={each} className="my-5 cursor-not-allowed" onClick={() => deleteFeedback(each)}>
        -{each}
      </div>
    ))
    setFeedback(cards)
  }

  function deleteFeedback(feedback) {
    fetch('https://mynameisnt.kim/sunwatch/feedback/index.php', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({string: feedback})
    })
      .then(() => fetchFeedback())
      .catch(error => alert(error));
  }

  function testButton() {
    setResponse("Clicked the button!")
  }

  return (
    (authed) ?
      <>
        <div className={`${theme.bg} ${theme.text} w-full justify-center flex-col text-center text-lg`}>
          <Divider/>
          <div className={`${theme.bg} ${theme.text} w-full justify-center flex-col text-center px-64 text-lg my-4`}>
            {response}
          </div>
          <Divider className="my-4"/>
          <div className="py-6">
            <button className={buttonstyle} onClick={() => deleteAllCookies()}>
              Delete all cookies
            </button>
            <button className={buttonstyle} onClick={() => printAllCookies()}>
              Print all cookies
            </button>
            <button className={buttonstyle} onClick={() => printAppState()}>
              Print appState
            </button>
            <button className={`${buttonstyle} bg-rose-500 hover:bg-rose-400`} onClick={() => testButton()}>
              test button
            </button>
          </div>
        </div>

        <div className={`${theme.bg} ${theme.text} w-full justify-center flex-col text-center text-lg`}>
          {(feedback) ?
            <>
              <p className="text-2xl text-emerald-400 pt-6">Feedback:</p>
              <p className="text-md text-zinc-400 pb-6">Click to delete</p>
              {feedback}
            </>
            : <div></div>
          }
        </div>
        <div className={`${theme.bg} ${theme.text} min-h-screen text-lg text-left pl-32`}>
          {Object.entries(appState).map(([key, value]) => (
            <div key={key}>
              {key}: {renderValue(value, 0)}
            </div>
          ))}
        </div>
      </>

      : <Unauthorized theme={theme}/>
  );
}
