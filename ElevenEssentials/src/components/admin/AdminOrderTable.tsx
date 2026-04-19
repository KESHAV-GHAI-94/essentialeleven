"use client";

import { useEffect, useState } from "react";
import { OrderService } from "@/services/order.service";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Clock,
  Truck,
  Download
} from "lucide-react";
import Link from "next/link";

export function AdminOrderTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    OrderService.getAllOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "DELIVERED": return "bg-green-100 text-green-700";
      case "PROCESSING": return "bg-blue-100 text-blue-700";
      case "SHIPPED": return "bg-purple-100 text-purple-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-navy-100 text-navy-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "DELIVERED": return <CheckCircle2 size={14} />;
      case "CANCELLED": return <XCircle size={14} />;
      case "SHIPPED": return <Truck size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (loading) return <div>Loading Orders...</div>;

  return (
    <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden">
      {/* Table Header / Toolbar */}
      <div className="p-6 border-b border-navy-50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID or Email"
              className="w-full bg-navy-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:ring-1 focus:ring-saffron outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-navy-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-navy-600 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-navy-100 rounded-xl text-sm font-bold text-navy-700 hover:bg-navy-50 transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-50/50">
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest pl-8">Order ID</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Customer</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Date</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Total</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-black text-navy-400 uppercase tracking-widest text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-navy-50/30 transition-colors group">
                <td className="p-4 pl-8">
                  <Link href={`/admin/orders/${order.id}`} className="hover:underline font-bold text-navy-900 text-sm">
                    #{order.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm font-bold text-navy-900">{order.user?.name || "Guest"}</p>
                    <p className="text-xs text-navy-400 font-medium">{order.user?.email || "No Email"}</p>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium text-navy-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm font-black text-navy-900">₹{order.totalAmount.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right pr-8">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/orders/${order.id}`} className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-900 transition-all">
                      <Eye size={18} />
                    </Link>
                    <button className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-900 transition-all">
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="p-6 border-t border-navy-50 flex items-center justify-between">
        <p className="text-sm text-navy-400 font-medium">Showing <span className="text-navy-900 font-bold">{filteredOrders.length}</span> results</p>
        <div className="flex gap-2">
           <button disabled className="px-4 py-2 border border-navy-100 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">Previous</button>
           <button disabled className="px-4 py-2 border border-navy-100 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">Next</button>
        </div>
      </div>
    </div>
  );
}
