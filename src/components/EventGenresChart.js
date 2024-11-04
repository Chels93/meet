import React, { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define colors for pie chart slices
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const genres = ["React", "JavaScript", "Node", "jQuery", "Angular"];

// Custom label renderer for pie chart segments to show percentage and genre
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  index,
}) => {
  const radius = outerRadius * 0.7; // Adjust the position of the label
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return percent ? (
    <text
      x={x}
      y={y}
      fill="#fff" // Change label color to white for better contrast
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${genres[index]} ${(percent * 100).toFixed(0)}%`}{" "}
      {/* Display genre and percentage */}
    </text>
  ) : null;
};

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
          labelLine={false}
          label={renderCustomizedLabel} // Use customized label function
          outerRadius={130}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenresChart; // Export component for use in other parts of the application
