"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/themeContext";

const LIGHT_COLORS = ["#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb", "#f3f4f6"];
const DARK_COLORS = ["#0f172a", "#1e293b", "#334155", "#475569", "#64748b"];

const AllocationByAlgoChart = ({ data }) => {
  const { isDarkMode } = useTheme();
  const COLORS = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-md px-3 py-2 text-sm shadow-md"
          style={{
            background: isDarkMode ? "#0f172a" : "white",
            border: `1px solid ${isDarkMode ? "#334155" : "#e5e7eb"}`,
            color: isDarkMode ? "#e2e8f0" : "#1e293b",
          }}
        >
          <p className="font-semibold">{payload[0].name}</p>
          <p>${payload[0].value.toLocaleString()}</p>
          <p>{((payload[0].value / total) * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`border rounded-lg h-full flex flex-col ${
        isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="p-4">
        <p
          className={`text-lg font-semibold ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Allocation by Algo
        </p>
      </div>
      
      <div className="flex-grow relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => 
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 -mt-10 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className={`text-2xl font-semibold ${isDarkMode ? "text-white" : "text-black"}`}>
              ${total.toLocaleString()}
            </p>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Total
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AllocationByAlgoChart;