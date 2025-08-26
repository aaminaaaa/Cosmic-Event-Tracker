import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Ensure React is imported
import axios from 'axios';
import { transformNeoData, formatDate } from '../utils/nasaUtils';
import EventCard from '../components/EventCard';
// EventDetailsModal is no longer imported as it's not used
// import EventDetailsModal from '../components/EventDetailsModal'; 
import { GiAsteroid, GiCheckMark } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1/feed';
const INITIAL_DAYS = 7;
const LOAD_MORE_DAYS = 5;

export default function EventTracker({ setSelectedNeos }) {
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [dateRange, setDateRange] = useState({ 
    start: new Date(), 
    end: new Date(new Date().setDate(new Date().getDate() + INITIAL_DAYS - 1)) 
  });
  
  const [filterHazardous, setFilterHazardous] = useState(false);
  const [sortBy, setSortBy] = useState('approachDateAsc');
  const [selectedIds, setSelectedIds] = useState(new Set());
  // selectedNeoDetails state is no longer needed
  // const [selectedNeoDetails, setSelectedNeoDetails] = useState(null); 
  
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const fetchNeos = useCallback(async (start, end, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const startDateStr = formatDate(start);
      const endDateStr = formatDate(end);
      
      const response = await axios.get(BASE_URL, {
        params: {
          start_date: startDateStr,
          end_date: endDateStr,
          api_key: API_KEY,
        },
      });

      const transformedData = transformNeoData(response.data);
      
      setNeos(prevNeos => {
        const mergedNeosMap = new Map();
        
        // Add existing NEOs (if appending)
        if (append) {
            prevNeos.forEach(neo => mergedNeosMap.set(neo.neo_reference_id, neo));
        }

        // Add new NEOs (overwriting if a duplicate exists)
        transformedData.forEach(neo => mergedNeosMap.set(neo.neo_reference_id, neo));
        
        return Array.from(mergedNeosMap.values());
      });

      setDateRange({ start, end });

    } catch (err) {
      console.error('API Error:', err);
      const errorMsg = err.response?.data?.code === 403 || err.response?.data?.error?.message.includes("API_KEY") 
        ? "Failed to fetch data. Please verify your NASA API key in .env.local." 
        : "Failed to fetch data. Check network connection or API key.";
        
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []); 

  // Initial data load on mount
  useEffect(() => {
    // Only fetch if NEOs list is empty to prevent unnecessary re-fetches or if initial data fetch failed
    if (neos.length === 0 && !error) {
        fetchNeos(dateRange.start, dateRange.end);
    }
  }, [fetchNeos, neos.length, error]); // Added error to dependency array

  // Load More function: calculates the next date range and fetches data
  const handleLoadMore = () => {
    const newStart = new Date(dateRange.end);
    newStart.setDate(newStart.getDate() + 1); // Start day after current end date

    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + LOAD_MORE_DAYS - 1); // Add the new increment
    
    // Fetch and append data
    fetchNeos(dateRange.start, newEnd, true);
  };

  // --- Comparison Feature Handlers ---
  const handleSelectNeo = (id) => {
    setSelectedIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  const handleCompare = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one NEO to compare.");
      return;
    }
    // Filter the full NEO list to only include the selected ones and pass to App state
    const compareList = neos.filter(neo => selectedIds.has(neo.neo_reference_id));
    setSelectedNeos(compareList);
    
    navigate('/compare');
  };

  // --- Filtering, Sorting, and Grouping Memoization ---
  const filteredAndSortedNeos = useMemo(() => {
    let list = neos;

    // 1. Filtering by Hazardous
    if (filterHazardous) {
      list = list.filter(neo => neo.is_potentially_hazardous_asteroid);
    }

    // 2. Sorting by Approach Date
    list = [...list].sort((a, b) => {
      // Use the actual close approach date for accurate sorting
      const dateA = new Date(a.close_approach_data[0]?.close_approach_date_full || '9999-01-01');
      const dateB = new Date(b.close_approach_data[0]?.close_approach_date_full || '9999-01-01');
      
      if (sortBy === 'approachDateAsc') {
        return dateA - dateB;
      }
      if (sortBy === 'approachDateDesc') {
        return dateB - dateA;
      }
      return 0;
    });
    
    return list;
  }, [neos, filterHazardous, sortBy]);
  
  // 3. Group by Date for display
  const groupedNeos = useMemo(() => {
    const groups = new Map();
    filteredAndSortedNeos.forEach(neo => {
      // Use the pre-calculated date group from the utility function
      const date = neo.close_approach_date_group; 
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date).push(neo);
    });
    // Sort the map keys (dates) chronologically for display
    return Array.from(groups.entries()).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB));
  }, [filteredAndSortedNeos]);


  // --- RENDERING ---
  return (
    // Main wrapper: min-h-screen for full height, bg-transparent to show body background
    // Added inline style for background image
    <div 
      className="min-h-screen bg-transparent" 
      style={{ 
        backgroundImage: 'url("")', // Replace with your actual image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', 
      }}
    > 
      {/* Content wrapper with fixed horizontal padding and vertical padding */}
      <div className="py-8 px-24 max-w-7xl mx-auto"> {/* Added max-w-7xl mx-auto for better content containment */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700 bg-black bg-opacity-60 p-4 rounded-lg shadow-md">
          <h1 className="text-3xl font-extrabold text-white flex items-center">
            <GiAsteroid className="mr-2 text-blue-400" />
            Cosmic Event Tracker
          </h1>
          <div className="flex space-x-4">
              <button
                  onClick={handleCompare}
                  className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-purple-700 transition flex items-center disabled:opacity-50 text-sm"
                  disabled={selectedIds.size === 0}
              >
                  Compare ({selectedIds.size}) <GiCheckMark className='ml-2 text-lg' />
              </button>
              <button
                  onClick={signOut}
                  className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition text-sm"
              >
                  Logout
              </button>
          </div>
        </header>
        
        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-black bg-opacity-70 p-4 rounded-lg shadow items-center justify-between border border-gray-700">
          
          {/* Hazardous Filter */}
          <label className="flex items-center space-x-2 cursor-pointer text-white">
            <input
              type="checkbox"
              checked={filterHazardous}
              onChange={(e) => setFilterHazardous(e.target.checked)}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="font-medium">Show Only Potentially Hazardous</span>
          </label>
          
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-lg bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="approachDateAsc">Approach Date (Earliest)</option>
            <option value="approachDateDesc">Approach Date (Latest)</option>
          </select>
          
          <p className="text-sm text-gray-400 hidden sm:block">
            Fetched Range: {formatDate(dateRange.start)} to {formatDate(dateRange.end)}
          </p>
        </div>
        
        {/* Loading and Error States */}
        {loading && neos.length === 0 && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-blue-400 font-medium">Loading upcoming cosmic events...</p>
          </div>
        )}
        
        {error && <p className="text-red-400 p-4 border border-red-600 bg-red-900 bg-opacity-70 rounded text-center">{error}</p>}
        
        {/* Event List Grouped by Date */}
        <div className="space-y-10">
          {groupedNeos.length === 0 && !loading && !error && (
            <p className="text-center text-gray-400 py-10">No Near-Earth Objects found for the selected range and filters.</p>
          )}

          {groupedNeos.map(([date, neoList]) => (
            // Adjusted styling for the date group cards
            <div key={date} className="bg-black bg-opacity-70 p-4 sm:p-6 rounded-xl shadow-lg border-t-4 border-blue-600">
              <h2 className="text-2xl font-bold mb-5 text-blue-400">{date}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {neoList.map(neo => (
                  <EventCard 
                    key={neo.neo_reference_id} 
                    neo={neo} 
                    isSelected={selectedIds.has(neo.neo_reference_id)}
                    onSelect={handleSelectNeo}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-lg shadow-xl hover:from-blue-700 hover:to-cyan-600 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Fetching more...' : `Load More Days (+${LOAD_MORE_DAYS})`}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-4 border-t font-extrabold border-gray-700 font-extrabld text-center text-sm text-white">
          Developed by SYED AAMINA
        </footer>
      </div> {/* End of content wrapper */}
    </div>
  );
}
