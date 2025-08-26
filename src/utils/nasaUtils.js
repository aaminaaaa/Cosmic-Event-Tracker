/**
 * Calculates the average diameter of an NEO in kilometers.
 * @param {object} estimated_diameter - The diameter object from the API response.
 * @returns {string} The average diameter, formatted to 3 decimal places.
 */
export const calculateAvgDiameter = (estimated_diameter) => {
  if (!estimated_diameter?.kilometers) return 'N/A';
  const min = estimated_diameter.kilometers.estimated_diameter_min;
  const max = estimated_diameter.kilometers.estimated_diameter_max;
  return ((min + max) / 2).toFixed(3);
};

/**
 * Transforms the nested NASA API response into a flat array of NEO objects.
 * @param {object} data - The raw API response data.
 * @returns {Array} A flat array of NEO objects.
 */
export const transformNeoData = (data) => {
  if (!data || !data.near_earth_objects) return [];

  const neoArray = [];
  const neoByDate = data.near_earth_objects;

  // Loop through each date key (YYYY-MM-DD)
  for (const date in neoByDate) {
    neoByDate[date].forEach(neo => {
      neoArray.push({
        ...neo,
        // Add calculated diameter and the processing date for grouping/sorting
        avg_diameter_km: calculateAvgDiameter(neo.estimated_diameter),
        close_approach_date_group: date, 
      });
    });
  }
  
  return neoArray;
};

/**
 * Helper to get date string in YYYY-MM-DD format for the API request
 * @param {Date} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};