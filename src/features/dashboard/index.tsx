import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CreditCard,
  DollarSign,
  Package,
  PencilLine,
  Star,
  Trash,
  TrendingUp,
  Users,
} from "lucide-react";

import { overviewData, recentSalesData, topProducts } from "../../constants";
import { useTheme } from "../../context/themeContext";

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className={`title ${isDarkMode ? "text-white" : "text-black"}`}>Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[
          {
            icon: Package,
            label: "Total Products",
            value: "25,154",
            change: "25%",
          },
          {
            icon: DollarSign,
            label: "Total Paid Orders",
            value: "$16,000",
            change: "12%",
          },
          {
            icon: Users,
            label: "Total Customers",
            value: "15,400k",
            change: "15%",
          },
          { icon: CreditCard, label: "Sales", value: "12,340", change: "19%" },
        ].map(({ icon: Icon, label, value, change }, index) => (
          <div 
            className={`card ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"} border rounded-lg`} 
            key={index}
          >
            <div className="card-header">
              <div className={`w-fit rounded-lg bg-primary-color-100/10 p-2 text-primary-color-100 transition-colors ${isDarkMode ? "dark:bg-primary-color-100/20 dark:text-primary-color-100" : ""}`}>
                <Icon size={26} />
              </div>
              <p className={`card-title ${isDarkMode ? "text-white" : "text-black"}`}>{label}</p>
            </div>
            <div className={`card-body ${isDarkMode ? "bg-slate-950 border-t border-slate-700" : "bg-slate-100 border-t border-gray-200"} transition-colors rounded-b-lg`}>
              <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"} transition-colors`}>
                {value}
              </p>
              <span className={`flex w-fit items-center gap-x-2 rounded-full border border-primary-color-100 px-2 py-1 font-medium text-primary-color-100 ${isDarkMode ? "dark:border-primary-color-100 dark:text-primary-color-100" : ""}`}>
                <TrendingUp size={18} />
                {change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className={`card ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"} col-span-1 md:col-span-2 lg:col-span-4 border rounded-lg`}>
          <div className="card-header">
            <p className={`card-title ${isDarkMode ? "text-white" : "text-black"}`}>Overview</p>
          </div>
          <div className="card-body p-0">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={overviewData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eb0029" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#eb0029" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip 
                  cursor={false} 
                  formatter={(value) => `$${value}`}
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#020617" : "#ffffff",
                    borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
                    borderRadius: "0.5rem",
                  }}
                />
                <XAxis
                  dataKey="name"
                  strokeWidth={0}
                  tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b" }}
                  tickMargin={6}
                />
                <YAxis
                  dataKey="total"
                  strokeWidth={0}
                  tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b" }}
                  tickFormatter={(value) => `$${value}`}
                  tickMargin={6}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#eb0029"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`card ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"} col-span-1 md:col-span-2 lg:col-span-3 border rounded-lg`}>
          <div className="card-header">
            <p className={`card-title ${isDarkMode ? "text-white" : "text-black"}`}>Recent Sales</p>
          </div>
          <div className="card-body h-[300px] overflow-auto p-0">
            {recentSalesData.map((sale, index) => (
              <div
                key={sale.id}
                className={`flex items-center justify-between gap-x-4 py-2 pr-2 ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-50"} ${
                  index !== recentSalesData.length - 1 ? (isDarkMode ? "border-b border-slate-700" : "border-b border-gray-200") : ""
                }`}
              >
                <div className="flex items-center gap-x-4">
                  <img
                    src={sale.image}
                    alt={sale.name}
                    className="size-10 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-y-2">
                    <p className={`font-medium ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {sale.name}
                    </p>
                    <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {sale.email}
                    </p>
                  </div>
                </div>
                <p className={`font-medium ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  ${sale.total}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`card ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"} border rounded-lg`}>
        <div className="card-header">
          <p className={`card-title ${isDarkMode ? "text-white" : "text-black"}`}>Top Orders</p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table w-full">
              <thead className={`table-header ${isDarkMode ? "bg-slate-800 border-b border-slate-700" : "bg-gray-100 border-b border-gray-200"}`}>
                <tr className="table-row">
                  <th className={`table-head ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>#</th>
                  <th className={`table-head ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Product</th>
                  <th className={`table-head ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Price</th>
                  <th className={`table-head ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Status</th>
                  <th className={`table-head ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Rating</th>
                  <th className={`table-head ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {topProducts.map((product, index) => (
                  <tr 
                    key={product.number} 
                    className={`table-row ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-50"} ${
                      index !== topProducts.length - 1 ? (isDarkMode ? "border-b border-slate-700" : "border-b border-gray-200") : ""
                    }`}
                  >
                    <td className={`table-cell ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{product.number}</td>
                    <td className="table-cell">
                      <div className="flex w-max gap-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-14 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                          <p className={isDarkMode ? "text-white" : "text-black"}>{product.name}</p>
                          <p className={`font-normal ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`table-cell ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>${product.price}</td>
                    <td className={`table-cell ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{product.status}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-2">
                        <Star
                          size={18}
                          className="fill-yellow-600 stroke-yellow-600"
                        />
                        <span className={isDarkMode ? "text-slate-300" : "text-slate-700"}>{product.rating}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-4">
                        <button className={`${isDarkMode ? "text-primary-color-100" : "text-primary-color-100"}`}>
                          <PencilLine size={20} />
                        </button>
                        <button className="text-red-500">
                          <Trash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;