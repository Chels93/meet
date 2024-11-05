import React, { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define colors for pie chart slices
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF5858"];
const genres = ["React", "JavaScript", "Node", "jQuery", "Angular"];

// EventGenresChart component
const EventGenresChart = ({ events }) => {
  const [data, setData] = useState([]);

  // Function to calculate data for each genre
  const getData = useCallback(() => {
    if (!events) return []; // Return empty array if events is undefined

    return genres.map((genre) => {
      const filteredEvents = events.filter((event) =>
        event.summary.includes(genre)
      );
      return {
        name: genre,
        value: filteredEvents.length,
      };
    });
  }, [events]);

  // Process events to set the data for the chart
  useEffect(() => {
    const chartData = getData(); // Calculate chart data
    setData(chartData); // Set the data for the chart
  }, [events, getData]); // Include events and getData as dependencies

  // If data is empty, return null or a loading indicator
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="99%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false} // Disable label lines for cleaner look
          label={renderCustomizedLabel} // Use custom labels for outer rim
          outerRadius={130} // Decrease outer radius for smaller chart
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Custom label function to render labels on the outer rim of the pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, name, value, index }) => {
  const RADIAN = Math.PI / 180;
  const spacing = 50; // Increase this value for more spacing
  const x = cx + (outerRadius + spacing) * Math.cos(-midAngle * RADIAN); // Adjust position for outer rim with spacing
  const y = cy + (outerRadius + spacing) * Math.sin(-midAngle * RADIAN); // Adjust position for outer rim with spacing

  // Get the color for the current slice based on index
  const fill = COLORS[index % COLORS.length]; // Match the label color with the pie slice color

  return (
    <text x={x} y={y} fill={fill} textAnchor="middle" dominantBaseline="middle">
      {`${name} (${value})`}
    </text>
  );
};

export default EventGenresChart;
