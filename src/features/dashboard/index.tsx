"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,

  Cell,
  BarChart,
  Bar,

} from "recharts";

import { useTheme } from "../../context/themeContext";
import AllocationByAlgoChart from "./allocationChart";

const LIGHT_COLORS = ["#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb", "#f3f4f6"];

const DARK_COLORS = ["#0f172a", "#1e293b", "#334155", "#475569", "#64748b"];

function DashboardHeader() {
  const [range, setRange] = useState("all");
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`flex justify-between items-center px-4 py-2 ${isDarkMode ? "bg-slate-950" : "bg-gray-50"
        }`}
    >
      <div className="flex items-center space-x-2">
        <h1
          className={`font-bold text-2xl ${isDarkMode ? "text-white" : "text-gray-800"
            }`}
        >
          Dashboard
        </h1>
      </div>

      <div className="flex items-center space-x-6 text-sm font-medium text-gray-600">
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
              className={`${range === r.value
                  ? isDarkMode
                    ? "underline text-white"
                    : "underline text-black"
                  : isDarkMode
                    ? "text-gray-400"
                    : "text-gray-500"
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

  const data = [
    { name: "Salute", value: 580 },
    { name: "Tbarlike", value: 400 },
    { name: "Tod", value: 290 },
  ];

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
    { name: "SAV", value: 100 },
    { name: "SAV", value: 150 },
  ];

  const profitByBot = [
    { name: "Bot 1", profit: 2000 },
    { name: "Bot 2", profit: 1200 },
    { name: "Bot 3", profit: -500 },
    { name: "Bot 4", profit: 1700 },
  ];

  const COLORS = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  const areaChartColor = isDarkMode ? "#334155" : "#6b7280";

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
              className={`border rounded-lg p-4 ${isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-gray-200 text-black"
                }`}
            >
              <p
                className={`text-sm font-medium ${isDarkMode ? "text-slate-500" : "text-gray-600"
                  }`}
              >
                {label}
              </p>
              <p className="mt-2 text-xl font-medium ">{value}</p>
            </div>
          ))}
        </div>

        <div
          className={`border rounded-lg lg:col-span-3 ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
            }`}
        >
          <div className="p-4">
            <p
              className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-black"
                }`}
            >
              Global Progress
            </p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={globalProgress}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={areaChartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={areaChartColor} stopOpacity={0} />
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
                stroke={areaChartColor}
                fillOpacity={1}
                fill="url(#colorProgress)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AllocationByAlgoChart data={allocationByCurrency} />


        <div
          className={`rounded-xl p-4 shadow-md ${isDarkMode
              ? "bg-slate-900 border border-slate-700"
              : "bg-white border border-gray-200"
            }`}
        >
          <div className="mb-6">
            <p
              className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-black"
                }`}
            >
              Sales by Location
            </p>
            <p
              className={`text-sm mt-1 ${isDarkMode ? "text-slate-300" : "text-gray-500"
                }`}
            >
              Commrec Immersions
            </p>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={[0, 600]}
                ticks={[0, 200, 400, 600]}
                stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                  borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
                  borderRadius: "0.5rem",
                }}
                cursor={{ fill: isDarkMode ? "#1e293b" : "#f3f4f6" }}
              />
              <Bar dataKey="value" barSize={40} radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.name === "Salute"
                        ? isDarkMode
                          ? "#020617"
                          : "#6b7280"
                        : COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div
            className={`mt-6 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-500"
              }`}
          >
            <p className="font-medium">Revenue Breakdown</p>
            <p className="mt-1">Orinet Extraction Images</p>
            <p className="mt-1">360 x daily Commune</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`border rounded-lg ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
            }`}
        >
          <div className="p-4">
            <p
              className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-black"
                }`}
            >
              Profit by Bot
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitByBot}>
              <XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
              <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                  borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
                }}
              />
              <Bar dataKey="profit" fill={areaChartColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          className={`border rounded-lg shadow-md ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
            }`}
        >
          <div className="p-4">
            <p
              className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-black"
                }`}
            >
              Average Order Value
            </p>
            <p
              className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"
                }`}
            >
              Sales unit averages amongst long units
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={[
                { name: "Jan", value: 120 },
                { name: "Feb", value: 200 },
                { name: "Mar", value: 170 },
                { name: "Apr", value: 300 },
                { name: "May", value: 250 },
                { name: "Jun", value: 310 },
                { name: "Jul", value: 280 },
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGray" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={areaChartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={areaChartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
              <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                  borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
                  borderRadius: "0.5rem",
                }}
                cursor={{ stroke: areaChartColor, strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={areaChartColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorGray)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
