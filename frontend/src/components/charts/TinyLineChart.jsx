import React from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const TinyLineChart = ({
  data,
  color = "#00B4D8",
  width = "100%",
  height = 450,
}) => {
  const defaultData = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" />
        <XAxis 
          dataKey="name" 
          stroke="#8895A6"
          style={{ fontSize: '0.875rem', color : '#8895A6' }}
        />
        <YAxis 
          stroke="#8895A6"
          style={{ fontSize: '0.875rem', color : '#8895A6' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#FFFFFF',
            borderLeft: '1px solid red',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '0.875rem' }}
        />
        <Line 
          type="monotone" 
          dataKey="pv" 
          stroke="#ca7df9" 
          strokeWidth={3}
          dot={{ fill: '#ca7df9', r: 5 }}
          activeDot={{ r: 8, fill: '#9E65F9' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TinyLineChart;
