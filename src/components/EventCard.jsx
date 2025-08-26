import { GiAsteroid, GiHazardSign } from 'react-icons/gi';
// FaExternalLinkAlt is no longer needed as the button is removed
// import { FaExternalLinkAlt } from 'react-icons/fa'; 

export default function EventCard({ neo, onSelect, isSelected /* onShowDetails is removed */ }) {
  const approachData = neo.close_approach_data[0] || {};
  const isHazardous = neo.is_potentially_hazardous_asteroid;
  
  // Conditional styling based on hazardous status
  const borderColor = isHazardous ? 'border-red-400' : 'border-green-400';
  const bgColor = isHazardous ? 'bg-red-50' : 'bg-green-50';
  
  return (
    <div 
      className={`relative p-4 rounded-lg shadow-md border-l-4 ${borderColor} ${bgColor} transition transform hover:shadow-lg`}
    >
      {/* Selection Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(neo.neo_reference_id)}
        // Tailwind styling for the checkbox
        className="absolute top-3 right-3 w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
      />

      <div className="flex items-start mb-3">
        <GiAsteroid className="text-xl mr-2 mt-1 text-gray-700 flex-shrink-0" />
        <h3 className="text-lg font-semibold text-gray-800 pr-8">{neo.name}</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-medium text-gray-700">Approach:</span> {approachData.close_approach_date_full || 'N/A'}
      </p>

      <div className="flex justify-between items-end text-sm">
        <p>
          <span className="font-medium text-gray-700">Avg. Diameter:</span> <span className="font-bold text-blue-700">{neo.avg_diameter_km} km</span>
        </p>
        
        {/* Removed the 'View Details' button entirely */}
        {/*
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Stops the click from bubbling up
            onShowDetails(neo);
            console.log("Details button clicked for:", neo.name);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center transition font-medium"
        >
          View Details <FaExternalLinkAlt className="ml-1 text-xs" />
        </button>
        */}
      </div>

      {isHazardous && (
        <div className="mt-2 flex items-center text-red-600 font-bold text-xs">
          <GiHazardSign className="mr-1 text-lg" /> POTENTIALLY HAZARDOUS
        </div>
      )}
    </div>
  );
}
