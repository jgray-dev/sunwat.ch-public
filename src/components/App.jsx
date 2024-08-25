import '../index.css';
import Navbar from "./Global Components/Navbar.jsx";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Local from "./Local/Local.jsx";
import World from "./World/World.jsx";
import Gallery from "./Gallery/Gallery.jsx";
import Notfound from "./Global Components/Notfound.jsx";
import Changelog from "./Changelog/Changelog.jsx";
import Footer from "./Global Components/Footer.jsx";
import {useEffect, useState} from "react";
import Details from "./Details.jsx/Details.jsx";
import ChangelogForm from "./Changelog/ChangelogForm.jsx";
import GalleryUpload from "./Gallery/GalleryUpload.jsx";
import {readCookie, updateCookie} from "./Functions/Cookies.jsx";
import Feedback from "./Feedback/Feedback.jsx";


function App() {
  const cookies = readCookie()
  let cookieTheme
  if (cookies.theme === "" || cookies.theme === undefined) {
    cookieTheme = "atlantic"
  } else {
    cookieTheme = cookies.theme
  }
  const [theme, updateTheme] = useState(cookieTheme)
  const [authed, setAuthed] = useState(false)
  const [appState, setAppState] = useState({hasData: false, hasUploaded: false});
  const [worldData, setWorldData] = useState();

  useEffect(() => {
    setTheme(cookieTheme)
    fetch('https://mynameisnt.kim/sunwatch/authorize/index.php')
      .then(r => r.json())
      .then(status => {
        setAuthed(status)
      })
  }, []) // Set theme on page load

  function setTheme(newTheme) {
    updateTheme(getTheme(newTheme))
    const currentCookies = readCookie()
    currentCookies.theme = newTheme // Update cookie with our new theme choice
    updateCookie(currentCookies)
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar theme={theme} setTheme={setTheme} authed={authed} setAuthed={setAuthed}/>
        <div className={`min-h-20 ${theme.bg}`}></div>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/local"/>}/>
            <Route path="/local" element={<Local appState={appState} setAppState={setAppState} theme={theme}/>}/>
            <Route path="/world" element={<World worldData={worldData} setWorldData={setWorldData} theme={theme}/>}/>
            <Route path="/gallery" element={<Gallery appState={appState} theme={theme} authed={authed}/>}/>
            <Route path="/gallery/upload"
                   element={<GalleryUpload appState={appState} setAppState={setAppState} theme={theme}/>}/>

            <Route path="/changelog" element={<Changelog appState={appState} theme={theme}/>}/>
            <Route path="/changelog/form" element={<ChangelogForm theme={theme} authed={authed}/>}/>

            <Route path="/feedback" element={<Feedback appState={appState} setAppState={setAppState} theme={theme}/>}/>

            <Route path="/details" element={<Details appState={appState} theme={theme} authed={authed}/>}/>
            <Route path="*" element={<Notfound theme={theme}/>}/>
          </Routes>
        </main>
        <Footer theme={theme} authed={authed}/>
      </div>
    </BrowserRouter>
  );
}

export default App;


function getTheme(newTheme) {
  if (newTheme === "atlantic") {
    return {
      bg: "bg-slate-600",
      bgdark: "bg-slate-800",
      bghover: "hover:bg-slate-700",
      text: "text-slate-200",
      textdark: "text-slate-400",
      texthover: "hover:text-white",
      accent: "bg-slate-500",
      accenttext: "text-slate-200",
      accenthover: "hover:bg-slate-400",
      accentfocus: "focus:ring-slate-700",
    }
  }
  if (newTheme === "red") {
    return {
      bg: "bg-stone-700",
      bgdark: "bg-stone-800",
      bghover: "hover:bg-stone-600",
      text: "text-stone-200",
      textdark: "text-stone-400",
      texthover: "hover:text-white",
      accent: "bg-red-500",
      accenttext: "text-red-500",
      accenthover: "hover:bg-red-400",
      accentfocus: "focus:ring-red-400",
    }
  }
  if (newTheme === "orange") {
    return {
      bg: "bg-stone-700",
      bgdark: "bg-stone-800",
      bghover: "hover:bg-stone-600",
      text: "text-stone-200",
      textdark: "text-stone-400",
      texthover: "hover:text-white",
      accent: "bg-orange-500",
      accenttext: "text-orange-500",
      accenthover: "hover:bg-orange-400",
      accentfocus: "focus:ring-orange-400",
    }
  }
  if (newTheme === "green") {
    return {
      bg: "bg-stone-700",
      bgdark: "bg-stone-800",
      bghover: "hover:bg-stone-600",
      text: "text-stone-200",
      textdark: "text-stone-400",
      texthover: "hover:text-white",
      accent: "bg-emerald-500",
      accenttext: "text-emerald-500",
      accenthover: "hover:bg-emerald-400",
      accentfocus: "focus:ring-emerald-400",
    }
  }
  if (newTheme === "lightblue") {
    return {
      bg: "bg-stone-700",
      bgdark: "bg-stone-800",
      bghover: "hover:bg-stone-600",
      text: "text-stone-200",
      textdark: "text-stone-400",
      texthover: "hover:text-white",
      accent: "bg-sky-500",
      accenttext: "text-sky-500",
      accenthover: "hover:bg-sky-400",
      accentfocus: "focus:ring-sky-400",
    }
  }
  if (newTheme === "deepblue") {
    return {
      bg: "bg-stone-700",
      bgdark: "bg-stone-800",
      bghover: "hover:bg-stone-600",
      text: "text-stone-200",
      textdark: "text-stone-400",
      texthover: "hover:text-white",
      accent: "bg-indigo-500",
      accenttext: "text-indigo-500",
      accenthover: "hover:bg-indigo-400",
      accentfocus: "focus:ring-indigo-400",
    }
  }
  if (newTheme === "purple") {
    return {
      bg: "bg-stone-700",
      bgdark: "bg-stone-800",
      bghover: "hover:bg-stone-600",
      text: "text-stone-200",
      textdark: "text-stone-400",
      texthover: "hover:text-white",
      accent: "bg-purple-500",
      accenttext: "text-purple-500",
      accenthover: "hover:bg-purple-400",
      accentfocus: "focus:ring-purple-400",
    }
  }
  if (newTheme === "rose") {
    return {
      bg: "bg-stone-700",
      bgdark: "bg-stone-800",
      bghover: "hover:bg-stone-600",
      text: "text-stone-200",
      textdark: "text-stone-400",
      texthover: "hover:text-white",
      accent: "bg-pink-500",
      accenttext: "text-pink-500",
      accenthover: "hover:bg-pink-400",
      accentfocus: "focus:ring-pink-400",
    }
  }

  // Return default (atlantic) theme if we made it this far (aka the theme selected doesnt exist)

  return {
    bg: "bg-slate-600",
    bgdark: "bg-slate-800",
    bghover: "hover:bg-slate-700",
    text: "text-slate-200",
    textdark: "text-slate-400",
    texthover: "hover:text-white",
    accent: "bg-slate-500",
    accenttext: "text-slate-200",
    accenthover: "hover:bg-slate-400",
    accentfocus: "focus:bg-slate-400",
  }
}
