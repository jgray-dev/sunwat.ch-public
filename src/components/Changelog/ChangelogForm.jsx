import {useState} from "react";
import Unauthorized from "../Global Components/Unauthorized.jsx";

export default function ChangelogForm({theme, authed}) {
  const [formState, setFormState] = useState({})

  function updateForm(e) {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault()
    const time = parseInt(Date.now())
    const newChange = {
      id: time,
      date: formState.date,
      version: formState.version,
      changes: {
        general: formState.general ? formState.general : "",
        issues: formState.issues ? formState.issues : "",
        ratings: formState.rating ? formState.rating : "",
        other: formState.other ? formState.other : ""
      }
    }
    fetch('https://mynameisnt.kim/sunwatch/data/changelog.php', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newChange)
    })
      .then(r => r.json())
      .then(response => {
        if (response.message === "Data added successfully") {
          alert("Submitted successfully")
          setFormState({})
        } else {
          console.error(response)
          alert("Error submitting changelog")
        }
      })
  }

  return ((authed) ?
      <>
        <div className={`${theme.bg} ${theme.text} w-full h-svh text-sm text-left pt-2`}>
          <div className="flex justify-center">
            <div className="w-1/2">
              <p className="w-full text-left">
                Use // to add a new line!
              </p>
              <div>
                <p className="text-xl">General</p>
                Date
                <input
                  autoComplete="off"
                  onChange={(e) => updateForm(e)}
                  type="text"
                  name="date"
                  className={`block w-full rounded-md border-0 mb-3 my-0.5 text-gray-900 shadow-sm ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${theme.accentfocus} sm:text-sm sm:leading-6`}
                  placeholder="Date"
                />
                Version number
                <input
                  autoComplete="off"
                  onChange={(e) => updateForm(e)}
                  type="text"
                  name="version"
                  className={`block w-full rounded-md border-0 mb-3 my-0.5 text-gray-900 shadow-sm ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${theme.accentfocus} sm:text-sm sm:leading-6`}
                  placeholder="Version number"
                />
                <p className="text-xl mt-8">Updates</p>
                General changes
                <input
                  autoComplete="off"
                  onChange={(e) => updateForm(e)}
                  type="text"
                  name="general"
                  className={`block w-full rounded-md border-0 mb-3 my-0.5 text-gray-900 shadow-sm ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${theme.accentfocus} sm:text-sm sm:leading-6`}
                  placeholder="General changes"
                />
                Issue fixes
                <input
                  autoComplete="off"
                  onChange={(e) => updateForm(e)}
                  type="text"
                  name="issues"
                  className={`block w-full rounded-md border-0 mb-3 my-0.5 text-gray-900 shadow-sm ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${theme.accentfocus} sm:text-sm sm:leading-6`}
                  placeholder="Issue fixes"
                />
                Rating changes
                <input
                  autoComplete="off"
                  onChange={(e) => updateForm(e)}
                  type="text"
                  name="rating"
                  className={`block w-full rounded-md border-0 mb-3 my-0.5 text-gray-900 shadow-sm ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${theme.accentfocus} sm:text-sm sm:leading-6`}
                  placeholder="Rating changes"
                />
                Misc changes
                <input
                  autoComplete="off"
                  onChange={(e) => updateForm(e)}
                  type="text"
                  name="other"
                  size="large"
                  className={`block w-full rounded-md border-0 mb-3 my-0.5 text-gray-900 shadow-sm ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${theme.accentfocus} sm:text-sm sm:leading-6`}
                  placeholder="Misc changes"
                />
                <button
                  className={`rounded ${theme.accent} px-2 py-1 mb-3 text-xs m-2 font-semibold text-white shadow-sm ${theme.accenthover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  onClick={(e) => handleSubmit(e)}
                >
                  Submit changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
      : <Unauthorized theme={theme}/>
  )
}
