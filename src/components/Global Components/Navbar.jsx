import {useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {Disclosure} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import {HiOutlineCodeBracket} from "react-icons/hi2";
import ThemeSelector from "./ThemeSelector.jsx";

export default function Navbar({theme, setTheme, authed, setAuthed}) {
  let pages
  if (authed) {
    pages = ["Local", "World", "Gallery", "Feedback", "Details"]
  } else {
    pages = ["Local", "World", "Gallery", "Feedback"] // Our pages
  }
  const navigate = useNavigate()
  const location = useLocation();
  const [currentPage, updateCurrentPage] = useState(`/${location.pathname.split("/")[1]}`)

  //Update navbar selection when the user moves page
  function handleNavigate(destination) {
    if (`${currentPage}` !== `/${destination}`) {
      navigate(`/${destination.toLowerCase()}`)
      updateCurrentPage(`/${destination}`)
    } else if (`${currentPage}` === `/changelog` && authed) {
      navigate(`/changelog/form`)
    }
  }

  return (
    <Disclosure as="nav" className={`z-50 ${theme.bgdark} w-full fixed select-none`}>
      {({open}) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/*Mobile hamburger menu*/}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button
                  className={`relative inline-flex items-center justify-center  rounded-md p-2 ${theme.text} hover:${theme.bg} hover:text-white`}>
                  <span className="absolute -inset-0.5"/>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {pages.map((page) => (
                      <a
                        key={page}
                        onClick={() => {
                          handleNavigate(page)
                        }}
                        className={(`${currentPage.split("/")[1].toLowerCase()}` === `${page.toLowerCase()}`) ? `decoration-solid underline underline-offset-2 ${theme.accent} ${theme.text} rounded-md px-3 py-2 text-sm font-medium cursor-pointer` : `text-gray-300 hover:text-white rounded-md px-3 py-2 text-sm font-medium hover:decoration-solid hover:underline hover:underline-offset-2 duration-75 cursor-pointer`}
                        aria-current={page ? 'page' : undefined}
                      >
                        {page}
                      </a>
                    ))}
                    {(authed) ? <p
                      className="text-emerald-600 rounded-md px-3 py-2 text-sm font-medium hover:text-red-600 hover:bg-red-200 duration-75"
                      onClick={() => setAuthed(false)}>Authorized</p> : ""}
                  </div>
                </div>
              </div>

              {/*Changelog button (far far right side)*/}
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <ThemeSelector theme={theme} setTheme={setTheme}/>
                <button
                  onClick={() => {
                    handleNavigate("changelog")
                  }}
                  type="button"
                  className={`relative rounded-full ${theme.bgdark} p-3 ${theme.textdark} hover:text-white hover:outline-none`}>

                  <span className="absolute -inset-1.5"/>
                  <HiOutlineCodeBracket className="h-6 w-6" aria-hidden="true"/>
                </button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {pages.map((page) => (
                <Disclosure.Button
                  key={page}
                  onClick={() => {
                    handleNavigate(page)
                  }}
                  className={(`${currentPage.split("/")[1].toLowerCase()}` === `${page.toLowerCase()}`) ? `${theme.accent} ${theme.text} block rounded-md px-3 py-2 text-base font-medium` : 'text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium'}

                  aria-current={page.current ? 'page' : undefined}
                >
                  {page}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
