"use client";

import { TrendingUp, Users, Target, MousePointer2, BadgeInfo } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Button } from "@/components/ui/button";

const adData = [
  { name: "Mon", reach: 4000, clicks: 240, cost: 40 },
  { name: "Tue", reach: 3000, clicks: 139, cost: 22 },
  { name: "Wed", reach: 2000, clicks: 980, cost: 65 },
  { name: "Thu", reach: 2780, clicks: 390, cost: 30 },
  { name: "Fri", reach: 1890, clicks: 480, cost: 48 },
  { name: "Sat", reach: 2390, clicks: 380, cost: 38 },
  { name: "Sun", reach: 3490, clicks: 430, cost: 43 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div>
        <h1 className="text-3xl font-black text-navy-900 tracking-tight">Marketing Analytics</h1>
        <p className="text-navy-400 font-medium">Real-time performance tracking for your Meta/Facebook Ad campaigns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard icon={<Target className="text-blue-600" />} label="Avg. ROAS" value="4.2x" trend="+0.5" />
         <StatCard icon={<TrendingUp className="text-green-600" />} label="Ad Spend" value="₹12,450" trend="-₹200" />
         <StatCard icon={<MousePointer2 className="text-purple-600" />} label="Avg. CPC" value="₹2.8" trend="+₹0.1" />
         <StatCard icon={<Users className="text-saffron" />} label="Total Reach" value="1.2M" trend="+15%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm">
            <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest mb-6">Reach & Conversion</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={adData}>
                     <defs>
                        <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#FBBC05" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#FBBC05" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                     <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#0F172A', color: 'white' }}
                        itemStyle={{ color: '#FBBC05', fontWeight: 'bold' }}
                     />
                     <Area type="monotone" dataKey="reach" stroke="#FBBC05" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm">
            <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest mb-6">Click Performance</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                     <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', background: '#0F172A', color: 'white' }}
                     />
                     <Bar dataKey="clicks" fill="#0F172A" radius={[8, 8, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="bg-navy-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
         <div className="shrink-0">
            <div className="w-20 h-20 bg-saffron rounded-3xl flex items-center justify-center text-navy-900 shadow-2xl shadow-saffron/40">
               <BadgeInfo size={40} />
            </div>
         </div>
         <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-black tracking-tight">AI Campaign Insights</h3>
            <p className="text-navy-300 font-medium">Your ROAS on Wednesday was significantly higher due to the <span className="text-saffron font-bold">Traditional Wear</span> campaign. We recommend increasing your budget by ₹2,000 for upcoming weekends.</p>
         </div>
         <Button className="bg-white text-navy-900 px-8 h-14 rounded-2xl font-black hover:scale-105 transition-all">
            Optimize Now
         </Button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-1">
       <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
             {icon}
          </div>
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
            trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>{trend}</span>
       </div>
       <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">{label}</p>
       <p className="text-2xl font-black text-navy-900">{value}</p>
    </div>
  );
}
