"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { useTheme } from "../../context/themeContext";

const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"];


function DashboardHeader() {
  const [currency, setCurrency] = useState("USD");
  const [range, setRange] = useState("all");

  return (
    <div className="flex justify-between items-center px-4 py-2  bg-gray-50">
      <div className="flex items-center space-x-2">
        <h1 className="font-bold text-2xl text-gray-800">Dashboard</h1>
        <span className="text-gray-500">- Company 3_1</span>
      </div>

      <div className="flex items-center space-x-6 text-sm font-medium text-gray-600">
        <div className="flex space-x-2">
          {["USD", "BTC"].map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`${
                currency === c ? "underline text-gray-900" : "text-gray-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>


        <div className="flex space-x-2">
          {[
            { label: "All time", value: "all" },
            { label: "1 Y", value: "1y" },
            { label: "1 M", value: "1m" },
            { label: "1 W", value: "1w" },
            { label: "1 D", value: "1d" },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`${
                range === r.value ? "underline text-gray-900" : "text-gray-500"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button className="text-gray-500 hover:text-gray-700">Go to...</button>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { isDarkMode } = useTheme();

  // Mock Data (Replace with API data)
  const globalProgress = [
    { name: "Nov'18", value: -100 },
    { name: "Dec'18", value: -50 },
    { name: "Jan'19", value: 200 },
    { name: "Feb'19", value: 400 },
    { name: "Mar'19", value: 350 },
    { name: "Apr'19", value: 500 },
    { name: "May'19", value: 600 },
    { name: "Jun'19", value: 550 },
    { name: "Jul'19", value: 700 },
    { name: "Aug'19", value: 950 },
  ];

  const allocationByCurrency = [
    { name: "BTC", value: 400 },
    { name: "ETH", value: 300 },
    { name: "SAVR", value: 300 },
    { name: "FVD", value: 200 },
  ];

  const allocationByAlgo = [
    { name: "Nick 1.2", value: 300 },
    { name: "Night_trade v1", value: 200 },
    { name: "Zub1", value: 150 },
    { name: "Doug_trade v2", value: 100 },
  ];

  const profitByBot = [
    { name: "Bot 1", profit: 2000 },
    { name: "Bot 2", profit: 1200 },
    { name: "Bot 3", profit: -500 },
    { name: "Bot 4", profit: 1700 },
  ];

  const profitByAlgo = [
    { name: "Algo 1", profit: 10 },
    { name: "Algo 2", profit: 17 },
    { name: "Algo 3", profit: -3 },
    { name: "Algo 4", profit: 12 },
  ];

  return (
    <div className="flex flex-col gap-y-6">
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-4 lg:col-span-1">
          {[
            { label: "Total Value", value: "$123,456.56" },
            { label: "Daily Profit", value: "$123.56 (13.23%)" },
            { label: "Bots Working", value: "56 (total 123)" },
            { label: "Algos Total", value: "6" },
          ].map(({ label, value }, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-gray-200 text-black"
              }`}
            >
              <p className="text-sm font-medium text-orange-600">{label}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div
          className={`border rounded-lg lg:col-span-3 ${
            isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="p-4">
            <p
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Global Progress
            </p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={globalProgress}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
              <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: isDarkMode ? "#020617" : "#ffffff",
                  borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
                  borderRadius: "0.5rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#colorProgress)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Allocation Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`border rounded-lg ${
            isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="p-4">
            <p
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Allocation by Currency
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationByCurrency}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#f97316"
                label
              >
                {allocationByCurrency.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation by Algo */}
        <div
          className={`border rounded-lg ${
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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationByAlgo}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                fill="#f97316"
                label
              >
                {allocationByAlgo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profit by Bot */}
        <div
          className={`border rounded-lg ${
            isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="p-4">
            <p
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Profit by Bot
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitByBot}>
              <XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
              <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
              <Tooltip />
              <Bar dataKey="profit" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit by Algo */}
        <div
          className={`border rounded-lg ${
            isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="p-4">
            <p
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Profit by Algo
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitByAlgo}>
              <XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
              <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
              <Tooltip />
              <Bar dataKey="profit" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
