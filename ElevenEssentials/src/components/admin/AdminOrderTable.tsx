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
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-700";
      case "PROCESSING": return "bg-blue-100 text-blue-700";
      case "SHIPPED": return "bg-purple-100 text-purple-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-navy-100 text-navy-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED": return <CheckCircle2 size={14} />;
      case "CANCELLED": return <XCircle size={14} />;
      case "SHIPPED": return <Truck size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;

    // Define headers
    const headers = ["Order ID", "Order Date", "Customer Name", "Email", "Phone", "Status", "Items", "Total Amount"];

    // Map data to rows
    const rows = filteredOrders.map(order => [
      order.id,
      new Date(order.createdAt).toLocaleString(),
      order.user?.name || order.customerName || "Customer",
      order.user?.email || order.email || "N/A",
      order.phone || "N/A",
      order.status,
      order.items?.map((i: any) => `${i.variant?.product?.name} (x${i.quantity})`).join(", ") || "",
      order.totalAmount
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadInvoiceDoc = (order: any) => {
    const storeName = "ELEVEN ESSENTIALS";
    const storeEmail = "support@elevenessentials.com";
    const storeAddress = "123 Premium Lane, Fashion District, City";

    // Create HTML template for Word
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Invoice</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; }
        .invoice-box { padding: 30px; border: 1px solid #eee; font-size: 14px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 3px solid #1a1a1a; padding-bottom: 20px; }
        .store-info { flex: 1; }
        .invoice-title { flex: 1; text-align: right; }
        .invoice-title h1 { margin: 0; color: #1a1a1a; font-size: 32px; font-weight: 900; }
        .details { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .details td { padding: 10px; vertical-align: top; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        .items-table th { background: #f8f9fa; border-bottom: 2px solid #eee; padding: 12px; text-align: left; font-weight: 900; }
        .items-table td { padding: 12px; border-bottom: 1px solid #eee; }
        .total-section { margin-top: 30px; text-align: right; }
        .total-section h2 { margin: 0; font-size: 24px; font-weight: 900; }
        .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
      </head>
      <body>
        <div class="invoice-box">
          <table width="100%">
            <tr>
              <td class="store-info">
                <h2 style="margin:0; color:#1a1a1a;">${storeName}</h2>
                <p style="margin:2px 0;">${storeAddress}</p>
                <p style="margin:2px 0;">${storeEmail}</p>
              </td>
              <td align="right">
                <h1 style="margin:0; font-size:32px;">INVOICE</h1>
                <p style="margin:2px 0;">Order #${order.id.slice(-8).toUpperCase()}</p>
                <p style="margin:2px 0;">Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
              </td>
            </tr>
          </table>

          <table width="100%" style="margin-top:40px;">
            <tr>
              <td width="50%">
                <h3 style="margin-bottom:10px;">Billing Details</h3>
                <p><strong>Name:</strong> ${order.user?.name || order.customerName || 'N/A'}</p>
                <p><strong>Email:</strong> ${order.user?.email || order.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
              </td>
              <td width="50%">
                 <h3 style="margin-bottom:10px;">Status</h3>
                 <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
                 <p><strong>Tracking Status:</strong> ${order.status}</p>
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th>Product Item</th>
                <th width="100">Price</th>
                <th width="80">Qty</th>
                <th width="100" style="text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item: any) => `
                <tr>
                  <td>
                    <strong>${item.variant?.product?.name || 'Product'}</strong><br/>
                    <small>Variant ID: ${item.variantId}</small>
                  </td>
                  <td>₹${item.price}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align:right;">₹${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <p style="font-size:16px;"><strong>Grand Total:</strong></p>
            <h2>₹${order.totalAmount}</h2>
          </div>

          <div class="footer">
            <p>Thank you for shopping with Eleven Essentials!</p>
            <p>This is a computer generated invoice and does not require a signature.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Trigger Word Download
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_${order.id.slice(-8).toUpperCase()}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 border border-navy-100 rounded-xl text-sm font-bold text-navy-700 hover:bg-navy-50 transition-colors"
        >
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
                    <button
                      onClick={() => handleDownloadInvoiceDoc(order)}
                      className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-900 transition-all font-bold"
                      title="Download Word Invoice"
                    >
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
