import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import {FaRegTrashAlt} from "react-icons/fa";

import Divider from '../Global Components/Divider.jsx';

function ChangeCard({change, appState}) {
  const renderChanges = (label, IconComponent, color, changes) => {
    if (!changes) return null;

    const changeItems = changes.split('//').filter(Boolean).map((change, index) => (
      <p key={`${label}-${index}`} className="pl-10 pr-6">
        - {change}
      </p>
    ));

    return changeItems.length > 0 ? (
      <>
        <div className="flex justify-left items-center pt-3 italic text-lg">
          <IconComponent className={`h-6 w-6 ${color}`}/>
          &nbsp;{label}
        </div>
        {changeItems}
      </>
    ) : null;
  };

  return (
    <div key={change.id}>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 pb-8">
        <p className="text-xl text-center font-bold">{change.date}</p>
        <p className="text-center text-md italic">{change.version}</p>
        {renderChanges('General improvements', SparklesIcon, 'stroke-green-400', change.changes.general)}
        {renderChanges('Rating updates', TableCellsIcon, 'stroke-green-400', change.changes.ratings)}
        {renderChanges('Other changes', InformationCircleIcon, 'stroke-orange-300', change.changes.other)}
        {renderChanges('Issue fixes', ExclamationTriangleIcon, 'stroke-red-500', change.changes.issues)}
      </div>
      <Divider/>
    </div>
  );
}

export default ChangeCard;