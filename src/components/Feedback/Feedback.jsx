import {useState} from "react";
import DOMPurify from "dompurify";


export function submitFeedback(feedback) {
  if (feedback !== "") {
    fetch('https://mynameisnt.kim/sunwatch/feedback/index.php', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(DOMPurify.sanitize(feedback))
    })
      .then(r => r.json())
      .then(response => {
        if (response.message === "Data added successfully") {
          return 1
        } else {
          alert("Error submitting feedback")
          return 0
        }
      })
  } else {
    alert("Please add feedback before submitting!")
    return 0
  }
}

export default function Feedback({appState, setAppState, theme}) {
  const [feedback, setFeedback] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    if (submitFeedback(feedback)) {
      setFeedback("")
      alert("Feedback submitted successfully! Thank you!!")
    }
  }

  return (
    <div className={`${theme.bg} ${theme.text} w-full justify-center flex text-lg h-screen text-left`}>
      <div className="sm:w-2/3 lg:w-1/2 w-full px-4 text-center tetx-xl text-white">
        Submit feedback
        <textarea
          autoComplete="off"
          rows="5"
          name="comments"
          className={`cursor-text block text-gray-900 ring-1 ring-inset ring-gray-300 shadow-sm
                  w-full rounded-md border-0
                  placeholder:text-gray-400
                  focus:ring-2 focus:ring-inset ${theme.accentfocus}
                  sm:text-sm sm:leading-6`}
          placeholder="Comments"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          className={`rounded ${theme.accent} px-2 py-1 text-xs p-2 mt-4 font-semibold text-white shadow-sm ${theme.accenthover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          onClick={(e) => handleSubmit(e)}>
          Submit new post
        </button>
      </div>
    </div>
  )
}
