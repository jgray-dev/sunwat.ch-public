import {useEffect, useState} from 'react';
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid';
import {Combobox} from '@headlessui/react';
import getAppState, {APIKEY} from "../Functions/Main.jsx";
import {deleteAllCookies, readCookie, updateCookie} from "../Functions/Cookies.jsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Searchbox({appState, setAppState, theme}) {
  const [currentSearch, setCurrentSearch] = useState(appState.city || '');
  const [locationsList, setLocationsList] = useState([]);

  //useEffect waits for city to update - and sets the value of the search box to reflect it
  useEffect(() => {
    setCurrentSearch(appState.city);
  }, [appState.city]);

  // Autocomplete search search "combobox" using accuweather autocomplete or search API (for more specific searches)
  async function autoComplete(search) {
    setCurrentSearch(search);
    let apiUrl;
    if (search !== "" && search !== undefined) {
      if (search.length > 10) {
        apiUrl = `https://dataservice.accuweather.com/locations/v1/search?apikey=${APIKEY}&q=${encodeURIComponent(search)}`;
      } else {
        apiUrl = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${APIKEY}&q=${encodeURIComponent(search)}`;
      }
      await fetch(`https://mynameisnt.kim/sunwatch/proxy.php?url=${encodeURIComponent(apiUrl)}`)
        .then(r => r.json())
        .then(data => {
          if (data.length > 0) {
            const locAuto = data.map((location, rank) => ({
              id: rank,
              name: `${location["LocalizedName"]}, ${location["AdministrativeArea"]["LocalizedName"]}`,
            }));
            setLocationsList(locAuto);
          }
        });
    }
  }

  //City search with current input - end is a variable used to re-run the function with the first autocomplete option in case your search fails
  async function handleSubmit(search, end = false) {
    const replace = search.replace(/,/g, '');
    const loc = replace.toLowerCase()
    setAppState({displayCity: {loc}});
    const apiUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${APIKEY}&q=${loc}`;
    await fetch(`https://mynameisnt.kim/sunwatch/proxy.php?url=${encodeURIComponent(apiUrl)}`)
      .then((response) => response.json())
      .then((r) => {
        if (r.length !== 0) {
          const city = `${r[0]["LocalizedName"]}, ${r[0]["AdministrativeArea"]["LocalizedName"]}`;
          const lat = r[0]["GeoPosition"]["Latitude"];
          const lon = r[0]["GeoPosition"]["Longitude"];
          const timezone = r[0]["TimeZone"]["Name"];
          const key = r[0]["Key"];
          setAppState({hasData: false});
          const cookies = readCookie()
          deleteAllCookies()
          updateCookie({
            key: key,
            lat: lat,
            lon: lon,
            city: city,
            timezone: timezone,
            theme: cookies.theme,
          });
          const obj = {hasData: false};
          getAppState({obj, setAppState});
        } else if (!end) {
          if (locationsList[0].name) {
            handleSubmit(locationsList[0].name, true)
          } else {
            alert("No locations found")
          }
        } else {
          alert("No locations found")
        }
      });
  }

  return (
    <div className={`flex justify-center items-center ${theme.bg}`}>
      <Combobox as="div" className={`${theme.bg} w-5/6 sm:w-2/3 md:w-1/3 px-6`}>
        <Combobox.Label
          className={`content-center font-medium leading-6 ${theme.bg} ${theme.accenttext} text-sm text-center mb-2`}>
          Enter new city
        </Combobox.Label>

        <div className="relative">
          <Combobox.Input
            value={currentSearch ? currentSearch : ""}
            placeholder={currentSearch ? currentSearch : 'Search for a city'}
            autoComplete="off"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSubmit(currentSearch);
              }
            }}
            className={`w-full rounded-md border-0 bg-zinc-200 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset ${theme.accentfocus} sm:text-sm sm:leading-6`}
            onChange={(event) => autoComplete(event.target.value)}
            autoFocus
            onClick={(event) => event.target.setSelectionRange(0, event.target.value.length)}
          />

          <Combobox.Button
            className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
          </Combobox.Button>

          {locationsList.length > 0 && (
            <Combobox.Options
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-200 text-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {locationsList.map((location) => (
                <Combobox.Option
                  key={location.id}
                  value={location}
                  className={({active}) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? `${theme.accent} text-white` : 'text-gray-900'
                    )
                  }
                  onClick={() => {
                    handleSubmit(location.name);
                    setCurrentSearch(location.name);
                  }}
                >
                  {({active, selected}) => (
                    <>
                      <span className={classNames('block truncate', selected && 'font-semibold')}>{location.name}</span>

                      {selected && (
                        <span
                          className={classNames(
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : `${theme.accenttext}`
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
}
