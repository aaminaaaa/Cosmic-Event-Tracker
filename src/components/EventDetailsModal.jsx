import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

export default function EventDetailsModal({ neo, onClose }) {
  if (!neo) return null;

  const approachData = neo.close_approach_data[0] || {};
  const orbitalData = neo.orbital_data || {};

  return (
    // Fixed overlay background
    <div className="fixed inset-0 bg-gray-800 bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative transform transition-all duration-300 scale-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition p-2 rounded-full hover:bg-gray-100"
        >
          <FaTimes className="text-xl" />
        </button>

        <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-blue-700">{neo.name} Details</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
          
          {/* General Details */}
          <div>
            <h3 className="font-semibold text-lg mb-2 border-b border-gray-200 text-gray-800">General</h3>
            <p><span className="font-medium">JPL ID:</span> {neo.neo_reference_id}</p>
            <p><span className="font-medium">Avg. Diameter:</span> {neo.avg_diameter_km} km</p>
            <p>
              <span className={`font-medium ${neo.is_potentially_hazardous_asteroid ? 'text-red-600' : 'text-green-600'}`}>
                Hazardous:
              </span> {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
            </p>
            <a 
              href={neo.nasa_jpl_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:text-blue-600 hover:underline flex items-center mt-2 font-medium"
            >
              NASA JPL Link <FaExternalLinkAlt className="ml-1 text-xs" />
            </a>
          </div>

          {/* Approach Details */}
          <div>
            <h3 className="font-semibold text-lg mb-2 border-b border-gray-200 text-gray-800">Closest Approach</h3>
            <p><span className="font-medium">Date/Time:</span> {approachData.close_approach_date_full || 'N/A'}</p>
            <p><span className="font-medium">Miss Distance (km):</span> {(approachData.miss_distance?.kilometers || 'N/A')}</p>
            <p><span className="font-medium">Relative Velocity (km/s):</span> {(approachData.relative_velocity?.kilometers_per_second || 'N/A')}</p>
          </div>

          {/* Orbital Details */}
          <div className="sm:col-span-2 mt-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Orbital Data</h3>
            <p><span className="font-medium">Orbit ID:</span> {orbitalData.orbit_id || 'N/A'}</p>
            <p><span className="font-medium">Orbit Class:</span> {orbitalData.orbit_class?.orbit_class_description || 'N/A'}</p>
            <p><span className="font-medium">First Observation:</span> {orbitalData.first_observation_date || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}