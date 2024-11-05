import { useState, useEffect, useCallback } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// CityEventsChart component to display events by city
const CityEventsChart = ({ allLocations, events }) => {
  const [data, setData] = useState([]);

  // Memoized function to get data
  const getData = useCallback(() => {
    return allLocations.map((location) => {
      const count = events.filter((event) => event.location === location).length;
      const city = location.split(/, | - /)[0]; // Extract city name
      return { city, count }; // Return city name and event count
    });
  }, [allLocations, events]); // Include dependencies

  useEffect(() => {
    setData(getData()); // Set data on component mount or when dependencies change
  }, [getData]);

  return (
    <ResponsiveContainer width="99%" height={450}> {/* Set width to 99% */}
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 120, // Further increased bottom margin for more space
          left: 30, // Adjusted left margin to provide space for city names
        }}
      >
        <CartesianGrid />
        <XAxis
          type="category"
          dataKey="city" // Key for x-axis data
          name="City"
          angle={60} // Adjusted angle for better visibility
          interval={0}
          tick={{ dx: 10, dy: 30, fontSize: 14 }} // Adjusted offsets for tick labels to move them further away
          padding={{ left: 20, right: 20 }} // Added padding to prevent cutting off
          height={150} // Increased height to provide even more space for labels
        />
        <YAxis
          type="number"
          dataKey="count" // Key for y-axis data
          name="Number of events"
          allowDecimals={false}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Events by City" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart; 
