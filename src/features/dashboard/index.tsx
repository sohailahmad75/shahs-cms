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

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Dashboard</h1>

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
          <div className="card" key={index}>
            <div className="card-header">
              <div className="w-fit rounded-lg bg-primary-color-100/10 p-2 text-primary-color-100 transition-colors dark:bg-primary-color-100/20 dark:text-primary-color-100">
                <Icon size={26} />
              </div>
              <p className="card-title">{label}</p>
            </div>
            <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
              <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                {value}
              </p>
              <span className="flex w-fit items-center gap-x-2 rounded-full border border-primary-color-100 px-2 py-1 font-medium text-primary-color-100 dark:border-primary-color-100 dark:text-primary-color-100">
                <TrendingUp size={18} />
                {change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="card col-span-1 md:col-span-2 lg:col-span-4">
          <div className="card-header">
            <p className="card-title">Overview</p>
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
                <Tooltip cursor={false} formatter={(value) => `$${value}`} />
                <XAxis
                  dataKey="name"
                  strokeWidth={0}
                  stroke="#475569"
                  tickMargin={6}
                />
                <YAxis
                  dataKey="total"
                  strokeWidth={0}
                  stroke="#475569"
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

        <div className="card col-span-1 md:col-span-2 lg:col-span-3">
          <div className="card-header">
            <p className="card-title">Recent Sales</p>
          </div>
          <div className="card-body h-[300px] overflow-auto p-0">
            {recentSalesData.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between gap-x-4 py-2 pr-2"
              >
                <div className="flex items-center gap-x-4">
                  <img
                    src={sale.image}
                    alt={sale.name}
                    className="size-10 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-y-2">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {sale.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {sale.email}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  ${sale.total}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <p className="card-title">Top Orders</p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">#</th>
                  <th className="table-head">Product</th>
                  <th className="table-head">Price</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Rating</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {topProducts.map((product) => (
                  <tr key={product.number} className="table-row">
                    <td className="table-cell">{product.number}</td>
                    <td className="table-cell">
                      <div className="flex w-max gap-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-14 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                          <p>{product.name}</p>
                          <p className="font-normal text-slate-600 dark:text-slate-400">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">${product.price}</td>
                    <td className="table-cell">{product.status}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-2">
                        <Star
                          size={18}
                          className="fill-yellow-600 stroke-yellow-600"
                        />
                        {product.rating}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-4">
                        <button className="text-primary-color-100 dark:text-primary-color-100">
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
