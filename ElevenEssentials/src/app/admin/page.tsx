"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { DashboardService } from "@/services/dashboard.service";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, sales, orders] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getSalesData("6m"),
          DashboardService.getRecentOrders()
        ]);
        setStats(statsData);
        setSalesData(sales);
        setRecentOrders(orders);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  const statCards = [
    { name: "Total Revenue", value: `₹${stats?.revenue?.toLocaleString()}`, icon: TrendingUp, trend: stats?.trend?.revenue, color: "text-green-600", bg: "bg-green-50" },
    { name: "Total Orders", value: stats?.orders, icon: ShoppingBag, trend: stats?.trend?.orders, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Total Customers", value: stats?.users, icon: Users, trend: stats?.trend?.users, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Total Products", value: stats?.products, icon: Package, trend: "Stable", color: "text-saffron", bg: "bg-saffron/10" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                card.trend?.startsWith("+") ? "bg-green-50 text-green-600" : "bg-navy-50 text-navy-400"
              )}>
                {card.trend} {card.trend?.startsWith("+") ? <ArrowUpRight size={12} /> : null}
              </div>
            </div>
            <p className="text-sm font-bold text-navy-400 uppercase tracking-widest mb-1">{card.name}</p>
            <p className="text-3xl font-black text-navy-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-navy-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-navy-900">Revenue Over Time</h2>
            <select className="bg-navy-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-navy-600 outline-none">
              <option>Last 6 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: '#F59E0B', fontWeight: 800 }}
                  cursor={{ stroke: '#F1F5F9', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#F59E0B"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-xl font-black text-navy-900">Recent Activity</h2>
            <button className="text-navy-400 hover:text-navy-900 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="space-y-6">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center gap-4 hover:bg-navy-50 p-2 -mx-2 rounded-2xl transition-colors group"
              >
                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                  <Clock className="w-6 h-6 text-navy-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-navy-900 truncate">{order.user?.name || order.customerName || "Customer"}</p>
                  <p className="text-xs text-navy-400 font-medium tracking-tight">
                    Order #{order.id.slice(-6).toUpperCase()} • {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-navy-900">₹{order.totalAmount.toLocaleString()}</p>
                  <p className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-tighter ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-saffron/10 text-saffron'
                    }`}>
                    {order.status}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/admin/notifications"
            className="w-full mt-8 py-3 rounded-xl border border-navy-100 text-sm font-bold text-navy-600 hover:bg-navy-50 transition-all flex items-center justify-center"
          >
            View All Activity
          </Link>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
