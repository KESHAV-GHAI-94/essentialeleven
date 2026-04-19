"use client";

import { Save, Bell, Shield, Store, CreditCard, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 text-left">
      <div>
        <h1 className="text-3xl font-black text-navy-900 tracking-tight">Store Settings</h1>
        <p className="text-navy-400 font-medium">Configure your platform preferences and legal information.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
         {/* General Store Info */}
         <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest flex items-center gap-2">
               <Store size={16} /> Business Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy-900 uppercase">Store Name</label>
                  <input type="text" className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none" defaultValue="Eleven Essentials" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy-900 uppercase">Support Email</label>
                  <input type="email" className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none" defaultValue="support@elevenessentials.com" />
               </div>
               <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black text-navy-900 uppercase">Business Address</label>
                  <textarea className="w-full bg-navy-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none min-h-[80px]" defaultValue="Plot No. 44, Udyog Vihar Phase IV, Gurgaon, Haryana 122015" />
               </div>
            </div>
         </div>

         {/* Notification Settings */}
         <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest flex items-center gap-2">
               <Bell size={16} /> Notification Channels
            </h3>
            <div className="space-y-4">
               {[
                 { label: "Email Notifications", desc: "Send summary of daily sales and activity", enabled: true },
                 { label: "WhatsApp Alerts", desc: "Notify vendors of new orders via WhatsApp", enabled: false },
                 { label: "Slack Integration", desc: "Push store activity to your workspace", enabled: true }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-navy-50/50 rounded-2xl border border-navy-50">
                    <div>
                       <p className="text-sm font-black text-navy-900">{item.label}</p>
                       <p className="text-xs text-navy-400 font-medium">{item.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${item.enabled ? 'bg-saffron' : 'bg-navy-200'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? 'translate-x-6' : ''}`} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Security & Access */}
         <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-navy-400 uppercase tracking-widest flex items-center gap-2">
               <Shield size={16} /> Security & Roles
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-navy-50/50 rounded-2xl border border-navy-100/50">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-saffron font-black text-sm">A</div>
                     <div>
                        <p className="text-sm font-black text-navy-900">Admin Authentication</p>
                        <p className="text-xs text-navy-400 font-medium">Require 2FA for all administrator accounts</p>
                     </div>
                  </div>
                  <Button variant="outline" className="border-navy-100 text-[10px] font-black uppercase tracking-widest h-8">Enabled</Button>
               </div>
            </div>
         </div>

         {/* Save Action */}
         <div className="flex justify-end">
            <Button className="bg-navy-900 text-white rounded-xl px-12 h-14 font-black shadow-2xl shadow-navy-100 flex gap-2 hover:scale-[1.02] active:scale-95 transition-all">
               <Save size={20} /> Save Changes
            </Button>
         </div>
      </div>
    </div>
  );
}
