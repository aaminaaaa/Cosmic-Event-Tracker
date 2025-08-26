import { GiAsteroid, GiHazardSign } from 'react-icons/gi';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function CompareGraph({ selectedNeos }) {
  const navigate = useNavigate();


  if (!selectedNeos || selectedNeos.length === 0) {
    return (
      <div className="min-h-screen p-8 text-center bg-gray-50 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">No NEOs Selected</h1>
        <p className="text-xl text-red-500 mb-6">Please select NEOs using the checkboxes on the Tracker page before comparing.</p>
        <button 
          onClick={() => navigate('/')} 
          className="text-blue-600 hover:underline flex items-center justify-center mx-auto font-medium"
        >
          <FaArrowLeft className="mr-2" /> Go back to Tracker
        </button>
      </div>
    );
  }

  // --- Data Analysis for Scaling ---
  // 1. Find max values across the selected NEOs for chart scaling (100% bar)
  const maxDistance = Math.max(...selectedNeos.map(n => 
    
    parseFloat(n.close_approach_data[0]?.miss_distance?.kilometers || 0)
  ));
  const maxDiameter = Math.max(...selectedNeos.map(n => parseFloat(n.avg_diameter_km || 0)));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="flex items-center mb-8 border-b pb-4">
        <button 
          onClick={() => navigate('/')} 
          className="text-blue-600 hover:underline flex items-center mr-6 font-medium text-lg transition"
        >
          <FaArrowLeft className="mr-2" /> Back to Tracker
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <GiAsteroid className="mr-2 text-purple-600" />
          NEO Comparison Chart ({selectedNeos.length} Items)
        </h1>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        
        {/* === MISS DISTANCE COMPARISON CHART === */}
        <h2 className="text-2xl font-bold mb-6 text-purple-700 border-b pb-2">
          Miss Distance Comparison (Kilometers)
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          The chart scales relative to the largest miss distance among your selected NEOs (Max: {maxDistance.toLocaleString(undefined, { maximumFractionDigits: 0 })} km).
        </p>

        <div className="space-y-6">
          {selectedNeos.map((neo) => {
            const distance = parseFloat(neo.close_approach_data[0]?.miss_distance?.kilometers || 0);
            // Calculate percentage relative to the max distance
            const percentage = maxDistance > 0 ? (distance / maxDistance) * 100 : 0;
            const isHazardous = neo.is_potentially_hazardous_asteroid;
            
            return (
              <div key={neo.neo_reference_id} className="relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-gray-800">{neo.name}</span>
                  <span className="text-xs text-gray-600 font-mono">{distance.toLocaleString(undefined, { maximumFractionDigits: 0 })} km</span>
                </div>
                <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${percentage}%` }} 
                    className={`h-full transition-all duration-700 rounded-full ${isHazardous ? 'bg-red-400' : 'bg-green-400'}`}
                  ></div>
                </div>
                {isHazardous && <GiHazardSign className="absolute right-0 top-0 text-red-600 text-lg" title="Potentially Hazardous" />}
              </div>
            );
          })}
        </div>
        
        {/* === DIAMETER COMPARISON CHART === */}
        <h2 className="text-2xl font-bold mt-10 mb-6 border-t pt-6 text-purple-700">
          Average Diameter Comparison (Kilometers)
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          The chart scales relative to the largest diameter among your selected NEOs (Max: {maxDiameter.toFixed(3)} km).
        </p>

        <div className="space-y-6">
          {selectedNeos.map((neo) => {
            const diameter = parseFloat(neo.avg_diameter_km || 0);
            // Calculate percentage relative to the max diameter
            const percentage = maxDiameter > 0 ? (diameter / maxDiameter) * 100 : 0;
            const isHazardous = neo.is_potentially_hazardous_asteroid;
            
            return (
              <div key={neo.neo_reference_id} className="relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-gray-800">{neo.name}</span>
                  <span className="text-xs text-gray-600 font-mono">{diameter.toFixed(3)} km</span>
                </div>
                <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${percentage}%` }} 
                    className={`h-full transition-all duration-700 rounded-full ${isHazardous ? 'bg-red-400' : 'bg-blue-400'}`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}