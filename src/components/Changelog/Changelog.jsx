import ChangeCard from "./ChangeCard.jsx";
import {useEffect, useState} from "react";
import Divider from '../Global Components/Divider.jsx';


function Changelog({appState, theme}) {
  const [changelogData, updateChangelogData] = useState({});
  const [isReversed, setReversed] = useState(false);

  useEffect(() => {
    fetch(`https://mynameisnt.kim/sunwatch/data/changelog.php`)
      .then(r => r.json())
      .then(data => {
        updateChangelogData(data);
      });
  }, []);

  let changeCards = <div>Loading data...</div>;
  if (changelogData) {
    if (changelogData.length > 0) {
      let reversed
      if (isReversed) {
        reversed = changelogData
      } else {
        reversed = changelogData.reverse()
        setReversed(true)
      }
      changeCards = reversed.map((change, index) => {
        return <ChangeCard key={`change-${index}`} change={change} appState={appState}/>;
      });
    }

  }

  return (
    <div
      className={`${theme.bg} ${theme.text} py-4 min-h-screen text-sm text-justify flex place-items-center flex-col w-full`}>
      <h1 className={`text-3xl font-bold py-2 ${theme.text}`}>Changelog</h1>

      <div className="w-full md:w-1/2">
        <Divider/>
      </div>
      {changeCards}
    </div>
  );
}

export default Changelog;
