import {useEffect, useState} from "react";
import DOMPurify from 'dompurify';
import {useNavigate} from "react-router-dom";


export default function GalleryUpload({appState, theme, setAppState}) {
  const [formComments, setFormComments] = useState("")
  const [formImage, setFormimage] = useState("")
  const [uploadStatus, setUploadStatus] = useState(<p className="text-zinc-400 w-full text-center">Waiting for
    submit</p>)
  const navigate = useNavigate()

  const Uploading = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const intervalId = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots === '...') {
            return '';
          } else {
            return prevDots + '.';
          }
        });
      }, 300);

      return () => {
        clearInterval(intervalId);
      };
    }, []);

    return (
      <p className="text-orange-400 w-full text-center">
        Uploading{dots}
      </p>
    );
  };


  //Handle submit posts both image and form data when called
  async function handleSubmit(e) {
    e.preventDefault();
    if (formComments !== appState.hasUploaded) {
      if (formComments !== "" && formImage !== "") {
        const id = parseInt(Date.now());
        let url = ""
        const originalFileName = formImage.name;
        const fileExtension = originalFileName.split('.').pop();
        const allowedExtensions = ["jpg", "jpeg", "png", "webp", "heif", "heic", "gif"]; // Add or remove extensions as needed

        if (allowedExtensions.includes(fileExtension.toLowerCase())) {
          setUploadStatus(<Uploading/>)
          const imageData = new FormData();
          const newName = `${id}.${fileExtension}`; // Set the file name to the ID (unix time) + previous file extension
          const newFile = new File([formImage], newName, {type: formImage.type});
          imageData.append('image', newFile);
          await fetch('https://mynameisnt.kim/sunwatch/gallery/upload.php', {
            method: 'POST',
            body: imageData
          })
            .then(response => {
              if (response.ok) {
                return response.text();
              } else {
                setUploadStatus(<p className="text-red-400 w-full text-center">Error uploading image</p>)
                console.error(response);
              }
            })
            .catch(error => {
              setUploadStatus(<p className="text-red-400 w-full text-center">Error uploading image</p>)
              console.error(error)
              return 0
            })
            .then(r => {
              url = r
            }) // Set image URL to the response from posting image
        } else {
          setUploadStatus(<p className="text-red-400 w-full text-center">Invalid filetype!</p>)
          return 0
        }
        if (url !== "") {
          const sanitizedComments = DOMPurify.sanitize(formComments); // Sanitize comments field
          const newUpload = {
            id: id,
            city: appState.city,
            cover: appState.avgCover,
            ceiling: appState.avgCeiling,
            temperature: appState.avgTemp,
            visibility: appState.avgVis,
            comments: sanitizedComments,
            imageUrl: `https://mynameisnt.kim/sunwatch${url}`
          }
          await fetch('https://mynameisnt.kim/sunwatch/gallery/data.php', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUpload)
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(() => {
              setUploadStatus(<p className="text-green-400 w-full text-center">Successfully submitted. Redirecting...</p>)
              setAppState(appState)
              setTimeout(() => {
                navigate("/gallery")
              }, 1000)
            })
            .catch(error => {
              setUploadStatus(<p className="text-red-400 w-full text-center">Error uploading form data</p>)
              console.error(error);
            });
        } else {
          setUploadStatus(<p className="text-red-400 w-full text-center">Error uploading image</p>)
        }
      } else {
        setUploadStatus(<p className="text-red-400 w-full text-center">Please input both image and comments!</p>)
      }
    } else {
      setUploadStatus(<p className="text-red-400 w-full text-center">You've already submitted an image for this
        event!</p>)
    }
  }

  return (
    appState.hasData ?
      <>
        <div className={`flex justify-center ${theme.bg} min-h-screen`}>
          <div className={`${theme.bg} w-full md:w-1/2 sm:w-2/3 px-6`}>
            <div>
              <form>
                <p className="text-xl text-white font-bold pb-4">Submit new image</p>
                <p className="text-sm text-slate-400">City</p>
                <input
                  autoComplete="off"
                  disabled
                  type="text"
                  name="city"
                  size="large"
                  className={`cursor-not-allowed block bg-gray-300 text-gray-900 ring-inset ring-gray-300 shadow-sm
                w-full rounded-md border-0
                placeholder:text-gray-500
                focus:ring-2 focus:ring-inset ${theme.accentfocus}
                sm:text-sm sm:leading-6`}
                  placeholder={appState.city}
                />
                <p className="text-sm text-slate-400">Rating</p>
                <input
                  autoComplete="off"
                  disabled
                  type="text"
                  name="rating"
                  size="large"
                  className={`cursor-not-allowed block bg-gray-300 text-gray-900 ring-inset ring-gray-300 shadow-sm
                w-full rounded-md border-0
                placeholder:text-gray-500
                focus:ring-2 focus:ring-inset ${theme.accentfocus}
                sm:text-sm sm:leading-6`}
                  placeholder={appState.rating}
                />
                <p className="text-sm text-slate-400">Cloud cover</p>
                <input
                  autoComplete="off"
                  disabled
                  type="text"
                  name="cover"
                  size="large"
                  className={`cursor-not-allowed block bg-gray-300 text-gray-900 ring-inset ring-gray-300 shadow-sm
                w-full rounded-md border-0
                placeholder:text-gray-500
                focus:ring-2 focus:ring-inset ${theme.accentfocus}
                sm:text-sm sm:leading-6`}
                  placeholder={appState.avgCover}
                />
                <p className="text-sm text-slate-400">Cloud ceiling</p>
                <input
                  autoComplete="off"
                  disabled
                  type="text"
                  name="ceiling"
                  size="large"
                  className={`cursor-not-allowed block bg-gray-300 text-gray-900 ring-inset ring-gray-300 shadow-sm
                w-full rounded-md border-0
                placeholder:text-gray-500
                focus:ring-2 focus:ring-inset ${theme.accentfocus}
                sm:text-sm sm:leading-6`}
                  placeholder={appState.avgCeiling}
                />
                <p className="text-sm text-slate-400">Temperature</p>
                <input
                  autoComplete="off"
                  disabled
                  type="text"
                  name="temperature"
                  size="large"
                  className={`cursor-not-allowed block bg-gray-300 text-gray-900 ring-inset ring-gray-300 shadow-sm
                w-full rounded-md border-0
                placeholder:text-gray-500
                focus:ring-2 focus:ring-inset ${theme.accentfocus}
                sm:text-sm sm:leading-6`}
                  placeholder={appState.avgTemp}
                />
                <p className="text-sm text-slate-400">Visibility</p>
                <input
                  autoComplete="off"
                  disabled
                  type="text"
                  name="visibility"
                  size="large"
                  className={`cursor-not-allowed block bg-gray-300 text-gray-900 ring-inset ring-gray-300 shadow-sm
                w-full rounded-md border-0
                placeholder:text-gray-500
                focus:ring-2 focus:ring-inset ${theme.accentfocus}
                sm:text-sm sm:leading-6`}
                  placeholder={appState.avgVis}
                />
                <p className="text-sm text-slate-300">Comments</p>
                <textarea
                  autoComplete="off"
                  rows="5"
                  name="comments"
                  className={`cursor-text block text-black ring-1 ring-inset ring-gray-300 shadow-sm
                    w-full rounded-md border-0
                    placeholder:text-gray-400
                    focus:ring-2 focus:ring-inset ${theme.accentfocus}
                    sm:text-sm sm:leading-6`}
                  placeholder="Comments"
                  value={formComments}
                  onChange={(e) => setFormComments(e.target.value)}
                />
                <p className="text-sm text-slate-300">Upload image</p>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className={`cursor-text block text-gray-200 ring-1 ring-inset ring-gray-300 shadow-sm
                    w-full rounded-md border-0
                    placeholder:text-gray-400
                    focus:ring-2 focus:ring-inset ${theme.accentfocus}
                    sm:text-sm sm:leading-6`}
                  placeholder="Upload image"
                  onChange={(e) => setFormimage(e.target.files[0])}
                />


                {/* Submit button */}
                <button
                  className={`rounded ${theme.accent} px-2 py-1 text-xs p-2 mt-4 font-semibold text-white shadow-sm ${theme.accenthover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  onClick={(e) => handleSubmit(e)}>
                  Submit new post
                </button>
              </form>
              {uploadStatus}
            </div>
          </div>
        </div>
      </>
      :
      <>
        <div className={`${theme.bg} ${theme.text} h-svh text-sm pt-2 w-full text-center`}>
          Please go to the local tab and set a location first!
        </div>
      </>
  )
}
