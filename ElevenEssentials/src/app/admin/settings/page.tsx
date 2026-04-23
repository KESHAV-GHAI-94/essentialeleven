"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Mail, 
  Save, 
  Package, 
  Users, 
  ShieldCheck,
  Settings,
  ArrowLeft,
  Loader2,
  Globe,
  ShoppingCart,
  Share2,
  ExternalLink,
  Lock,
  LayoutDashboard,
  Megaphone,
  Link2,
  Plus,
  Trash2,
  Edit,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

const DEFAULT_NOTIFICATIONS = {
  browserNotifications: true,
  emailAlerts: true,
  whatsappAlerts: false,
  orderAlerts: true,
  inventoryAlerts: true,
  newCustomerAlerts: true,
  marketingEmails: false,
  securityAlerts: true
};

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Data States
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Eleven Essentials",
    storeEmail: "support@elevenessentials.com",
    currency: "INR",
    currencySymbol: "₹",
    maintenanceMode: false,
    lowStockThreshold: 5,
    showOutOfStock: true,
    socialLinks: { facebook: "", instagram: "", twitter: "" }
  });

  const [notifSettings, setNotifSettings] = useState(DEFAULT_NOTIFICATIONS);
  const [footerLinks, setFooterLinks] = useState<any[]>([]);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({ label: "", url: "#", group: "Collections", order: 0, isActive: true });
  const [editingLink, setEditingLink] = useState<any>(null);

  const fetchData = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      // Fetch Store Settings
      const sRes = await fetch("http://localhost:4000/api/settings/store");
      const sData = await sRes.json();
      if (sData) setStoreSettings(sData);

      // Fetch User Notification Settings
      const nRes = await fetch(`http://localhost:4000/api/users/settings/notifications/${session.user.id}`);
      const nData = await nRes.json();
      if (nData && Object.keys(nData).length > 0) setNotifSettings(nData);
      
      // Fetch Footer Links
      const fRes = await fetch("http://localhost:4000/api/settings/admin/footer");
      const fData = await fRes.json();
      if (fData) setFooterLinks(fData);
      
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) fetchData();
  }, [session?.user?.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save Store Settings
      await fetch("http://localhost:4000/api/settings/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeSettings)
      });

      // Save Notification Settings
      await fetch("http://localhost:4000/api/users/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, settings: notifSettings })
      });

      alert("Settings saved successfully! 🚀");
    } catch (error) {
      console.error("Save failure:", error);
      alert("Failed to save some settings.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || (loading && session?.user?.id)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-saffron animate-spin" />
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-12 bg-white rounded-[2.5rem] border border-navy-100 shadow-xl text-center">
          <Lock size={48} className="mx-auto text-navy-200 mb-6" />
          <h2 className="text-2xl font-black text-navy-900">Admin Authentication Required</h2>
          <p className="text-navy-400 font-medium mt-2 mb-8">Accessing global store settings requires verified administrative privileges.</p>
          <Link href="/api/auth/signin">
             <Button className="rounded-xl bg-navy-900 text-white font-bold px-8 h-12">Login to Continue</Button>
          </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Main Console Settings</h1>
          <p className="text-navy-400 font-medium mt-1">Configure global parameters, notifications, and store behavior</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-2xl border-navy-100 font-bold text-navy-600 h-14 px-8 hover:bg-navy-50"
            onClick={fetchData}
          >
            Reload Sync
          </Button>
          <Button 
            className="rounded-2xl bg-navy-900 text-white font-bold h-14 px-10 shadow-2xl hover:scale-[1.02] transition-transform flex gap-2"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? "Deploying..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 space-y-2">
           {[
             { id: 'general', label: 'Store General', icon: Globe },
             { id: 'navigation', label: 'Navigation', icon: Link2 },
             { id: 'inventory', label: 'Inventory Rules', icon: Package },
             { id: 'comms', label: 'Communications', icon: Megaphone },
             { id: 'social', label: 'Social & SEO', icon: Share2 },
             { id: 'security', label: 'Security & Auth', icon: ShieldCheck }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all duration-300 font-bold ${activeTab === tab.id ? 'bg-navy-900 text-saffron shadow-xl -translate-y-1' : 'bg-white border border-navy-50 text-navy-400 hover:border-navy-200'}`}
             >
               <tab.icon size={20} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
            {activeTab === 'navigation' && (
              <div className="bg-white rounded-[3rem] border border-navy-100 shadow-xl p-12 space-y-10 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between mb-8 border-l-8 border-saffron pl-6">
                  <h2 className="text-2xl font-black text-navy-900">Footer Nav Architecture</h2>
                  <Button 
                    onClick={() => {
                        setEditingLink(null);
                        setNewLink({ label: "", url: "#", group: "Collections", order: footerLinks.length, isActive: true });
                        setShowAddLink(true);
                    }}
                    className="rounded-xl bg-navy-900 text-white font-bold h-10 px-4 flex gap-2"
                  >
                    <Plus size={18} />
                    Deploy Link
                  </Button>
                </div>

                {showAddLink && (
                  <div className="bg-navy-50/50 p-8 rounded-[2.5rem] space-y-6 border-2 border-navy-900/10 animate-in zoom-in-95 duration-300">
                     <p className="text-sm font-black uppercase tracking-widest text-navy-400">{editingLink ? 'Modify Node' : 'Initialize New Node'}</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">Label</label>
                           <input 
                              className="w-full bg-white rounded-xl p-4 text-navy-900 font-bold border-2 border-transparent focus:border-navy-900 outline-none"
                              value={newLink.label}
                              onChange={e => setNewLink({...newLink, label: e.target.value})}
                              placeholder="e.g. Obsidian Store"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">Redirect URL</label>
                           <input 
                              className="w-full bg-white rounded-xl p-4 text-navy-900 font-bold border-2 border-transparent focus:border-navy-900 outline-none"
                              value={newLink.url}
                              onChange={e => setNewLink({...newLink, url: e.target.value})}
                              placeholder="/shop"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">Architectural Group</label>
                           <select 
                              className="w-full bg-white rounded-xl p-4 text-navy-900 font-bold border-2 border-transparent focus:border-navy-900 outline-none appearance-none"
                              value={newLink.group}
                              onChange={e => setNewLink({...newLink, group: e.target.value})}
                           >
                              <option value="Collections">Collections</option>
                              <option value="Experience">Experience</option>
                              <option value="Join the Circle">Join the Circle</option>
                              <option value="General">General</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">Sequence Order</label>
                           <input 
                              type="number"
                              className="w-full bg-white rounded-xl p-4 text-navy-900 font-bold border-2 border-transparent focus:border-navy-900 outline-none"
                              value={newLink.order}
                              onChange={e => setNewLink({...newLink, order: parseInt(e.target.value) || 0})}
                           />
                        </div>
                     </div>
                     <div className="flex gap-4 pt-4">
                        <Button 
                           className="bg-navy-900 text-saffron font-black rounded-xl px-8 h-12"
                           onClick={async () => {
                              try {
                                const method = editingLink ? "PATCH" : "POST";
                                const url = editingLink ? `http://localhost:4000/api/settings/footer/${editingLink.id}` : "http://localhost:4000/api/settings/footer";
                                await fetch(url, {
                                  method,
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify(newLink)
                                });
                                setShowAddLink(false);
                                fetchData();
                              } catch (err) {
                                alert("Sync failed.");
                              }
                           }}
                        >
                           Confirm Synchronization
                        </Button>
                        <Button variant="ghost" className="font-bold text-navy-400" onClick={() => setShowAddLink(false)}>Cancel</Button>
                     </div>
                  </div>
                )}

                <div className="space-y-4">
                   {['Collections', 'Experience', 'Join the Circle', 'General'].map(group => {
                     const linksInGroup = footerLinks.filter(l => l.group === group);
                     if (linksInGroup.length === 0) return null;
                     return (
                       <div key={group} className="space-y-3">
                         <h3 className="text-xs font-black uppercase tracking-widest text-navy-200 mt-6 mb-2 ml-1">{group}</h3>
                         {linksInGroup.map(link => (
                           <div key={link.id} className="flex items-center justify-between p-6 bg-navy-50/30 rounded-3xl group hover:bg-white hover:shadow-xl transition-all border-2 border-transparent hover:border-navy-900">
                             <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${link.isActive ? 'bg-saffron' : 'bg-navy-100'}`} />
                                <div className="space-y-1">
                                  <p className="font-black text-navy-900">{link.label}</p>
                                  <p className="text-[10px] font-bold text-navy-300 uppercase tracking-widest tracking-tighter">{link.url}</p>
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="rounded-xl hover:bg-navy-900 hover:text-white"
                                  onClick={() => {
                                    setEditingLink(link);
                                    setNewLink({ ...link });
                                    setShowAddLink(true);
                                  }}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="rounded-xl hover:bg-red-500 hover:text-white"
                                  onClick={async () => {
                                    if (!confirm("Delete link?")) return;
                                    await fetch(`http://localhost:4000/api/settings/footer/${link.id}`, { method: "DELETE" });
                                    fetchData();
                                  }}
                                >
                                  <Trash2 size={16} />
                                </Button>
                             </div>
                           </div>
                         ))}
                       </div>
                     );
                   })}
                </div>
              </div>
            )}

            {activeTab === 'general' && (
             <div className="bg-white rounded-[3rem] border border-navy-100 shadow-xl p-12 space-y-10 animate-in slide-in-from-right-4 duration-500">
                <section>
                   <h2 className="text-2xl font-black text-navy-900 mb-8 border-l-8 border-saffron pl-6">Core Identity</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-navy-300">Official Store Name</label>
                         <input 
                            className="w-full bg-navy-50/50 border-none rounded-2xl p-5 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none"
                            value={storeSettings.storeName}
                            onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-navy-300">Public Contact Email</label>
                         <input 
                            className="w-full bg-navy-50/50 border-none rounded-2xl p-5 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none"
                            value={storeSettings.storeEmail}
                            onChange={(e) => setStoreSettings({...storeSettings, storeEmail: e.target.value})}
                         />
                      </div>
                   </div>
                </section>

                <section>
                   <h2 className="text-2xl font-black text-navy-900 mb-8 border-l-8 border-navy-900 pl-6">Operations</h2>
                   <div className="bg-navy-50/30 rounded-[2rem] p-8 flex items-center justify-between">
                      <div>
                         <h4 className="text-lg font-black text-navy-900">Maintenance Mode</h4>
                         <p className="text-navy-400 text-sm font-medium">Temporarily disable storefront access for updates</p>
                      </div>
                      <button 
                         onClick={() => setStoreSettings({...storeSettings, maintenanceMode: !storeSettings.maintenanceMode})}
                         className={`relative w-16 h-8 rounded-full transition-all duration-300 ${storeSettings.maintenanceMode ? 'bg-red-500' : 'bg-navy-100'}`}
                      >
                         <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${storeSettings.maintenanceMode ? 'translate-x-8' : 'translate-x-0'}`} />
                      </button>
                   </div>
                </section>
             </div>
           )}

           {activeTab === 'inventory' && (
             <div className="bg-white rounded-[3rem] border border-navy-100 shadow-xl p-12 space-y-10 animate-in slide-in-from-right-4 duration-500">
                <section>
                   <h2 className="text-2xl font-black text-navy-900 mb-8 border-l-8 border-saffron pl-6">Stock Monitoring</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-navy-50/50 rounded-3xl space-y-4">
                         <div className="flex items-center gap-3 text-navy-900">
                            <Settings size={20} className="text-saffron" />
                            <span className="font-black">Low Stock Alert Threshold</span>
                         </div>
                         <input 
                            type="number"
                            className="w-full bg-white border-none rounded-2xl p-5 text-xl font-black text-navy-900 focus:ring-2 focus:ring-saffron outline-none"
                            value={storeSettings.lowStockThreshold}
                            onChange={(e) => setStoreSettings({...storeSettings, lowStockThreshold: parseInt(e.target.value) || 0})}
                         />
                         <p className="text-xs text-navy-400 font-bold">You will receive notifications when any variant falls below this number.</p>
                      </div>

                      <div className="p-8 bg-navy-50/50 rounded-3xl flex flex-col justify-between">
                         <div>
                            <span className="font-black text-navy-900">Visibility Rules</span>
                            <p className="text-sm text-navy-400 mt-2 font-medium">Keep showing out-of-stock items in the catalog?</p>
                         </div>
                         <button 
                            onClick={() => setStoreSettings({...storeSettings, showOutOfStock: !storeSettings.showOutOfStock})}
                            className={`w-full h-14 rounded-2xl font-black mt-6 transition-all ${storeSettings.showOutOfStock ? 'bg-navy-900 text-saffron shadow-lg' : 'bg-white border-2 border-navy-100 text-navy-200'}`}
                         >
                            {storeSettings.showOutOfStock ? 'Visible to Customers' : 'Hidden when Sold Out'}
                         </button>
                      </div>
                   </div>
                </section>
             </div>
           )}

           {activeTab === 'comms' && (
             <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">

               {/* Sender Identity */}
               <div className="bg-white rounded-[3rem] border border-navy-100 shadow-xl p-10 space-y-8">
                 <h2 className="text-2xl font-black text-navy-900 border-l-8 border-saffron pl-6">
                   Sender Identity
                 </h2>
                 <p className="text-sm text-navy-400 font-medium -mt-4 pl-1">
                   This appears as the "From" address in all outgoing emails and SMS.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">Sender Email Address</label>
                     <div className="relative">
                       <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" />
                       <input
                         type="email"
                         placeholder="noreply@elevenessentials.com"
                         className="w-full bg-navy-50/50 rounded-2xl p-4 pl-11 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none"
                         value={(storeSettings as any).senderEmail || ""}
                         onChange={(e) => setStoreSettings({ ...storeSettings, senderEmail: e.target.value } as any)}
                       />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">Sender Display Name</label>
                     <input
                       type="text"
                       placeholder="Eleven Essentials"
                       className="w-full bg-navy-50/50 rounded-2xl p-4 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none"
                       value={(storeSettings as any).senderName || ""}
                       onChange={(e) => setStoreSettings({ ...storeSettings, senderName: e.target.value } as any)}
                     />
                   </div>
                 </div>
               </div>

               {/* Phone & WhatsApp */}
               <div className="bg-white rounded-[3rem] border border-navy-100 shadow-xl p-10 space-y-8">
                 <h2 className="text-2xl font-black text-navy-900 border-l-8 border-navy-900 pl-6">
                   Phone & WhatsApp
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">Store Phone Number</label>
                     <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-navy-100 pr-2">
                         <span className="text-xs font-black text-navy-400">+91</span>
                       </div>
                       <input
                         type="tel"
                         maxLength={10}
                         placeholder="9876543210"
                         className="w-full bg-navy-50/50 rounded-2xl p-4 pl-16 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none"
                         value={(storeSettings as any).senderPhone || ""}
                         onChange={(e) => setStoreSettings({ ...storeSettings, senderPhone: e.target.value.replace(/\D/g, '') } as any)}
                       />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">WhatsApp Business Number</label>
                     <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-navy-100 pr-2">
                         <span className="text-xs font-black text-navy-400">+91</span>
                       </div>
                       <input
                         type="tel"
                         maxLength={10}
                         placeholder="9876543210"
                         className="w-full bg-navy-50/50 rounded-2xl p-4 pl-16 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none"
                         value={(storeSettings as any).whatsappNumber || ""}
                         onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value.replace(/\D/g, '') } as any)}
                       />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">Support Helpline</label>
                     <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-navy-100 pr-2">
                         <span className="text-xs font-black text-navy-400">+91</span>
                       </div>
                       <input
                         type="tel"
                         maxLength={10}
                         placeholder="1111100000"
                         className="w-full bg-navy-50/50 rounded-2xl p-4 pl-16 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none"
                         value={(storeSettings as any).supportPhone || ""}
                         onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value.replace(/\D/g, '') } as any)}
                       />
                     </div>
                   </div>
                 </div>
               </div>

               {/* SMTP Configuration */}
               <div className="bg-white rounded-[3rem] border border-navy-100 shadow-xl p-10 space-y-8">
                 <div>
                   <h2 className="text-2xl font-black text-navy-900 border-l-8 border-saffron pl-6">
                     SMTP / Email Server
                   </h2>
                   <p className="text-sm text-navy-400 font-medium mt-2 pl-1">
                     Configure outgoing email delivery. Used for order confirmations, OTPs, and alerts.
                   </p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2 md:col-span-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">SMTP Host</label>
                     <input
                       type="text"
                       placeholder="smtp.gmail.com"
                       className="w-full bg-navy-50/50 rounded-2xl p-4 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none font-mono"
                       value={(storeSettings as any).smtpHost || ""}
                       onChange={(e) => setStoreSettings({ ...storeSettings, smtpHost: e.target.value } as any)}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">Port</label>
                     <input
                       type="number"
                       placeholder="587"
                       className="w-full bg-navy-50/50 rounded-2xl p-4 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none font-mono"
                       value={(storeSettings as any).smtpPort || 587}
                       onChange={(e) => setStoreSettings({ ...storeSettings, smtpPort: parseInt(e.target.value) || 587 } as any)}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">SMTP Username</label>
                     <input
                       type="text"
                       placeholder="you@gmail.com"
                       className="w-full bg-navy-50/50 rounded-2xl p-4 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none"
                       value={(storeSettings as any).smtpUser || ""}
                       onChange={(e) => setStoreSettings({ ...storeSettings, smtpUser: e.target.value } as any)}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-1">SMTP Password / App Key</label>
                     <input
                       type="password"
                       placeholder="••••••••••••"
                       className="w-full bg-navy-50/50 rounded-2xl p-4 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none"
                       value={(storeSettings as any).smtpPass || ""}
                       onChange={(e) => setStoreSettings({ ...storeSettings, smtpPass: e.target.value } as any)}
                     />
                   </div>
                   <div className="flex items-end pb-1">
                     <div
                       onClick={() => setStoreSettings({ ...storeSettings, smtpSecure: !(storeSettings as any).smtpSecure } as any)}
                       className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 w-full transition-all ${(storeSettings as any).smtpSecure ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-100 bg-white text-navy-400'}`}
                     >
                       <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs font-black transition-all ${(storeSettings as any).smtpSecure ? 'bg-saffron border-saffron text-navy-900' : 'border-navy-200'}`}>
                         {(storeSettings as any).smtpSecure && '✓'}
                       </div>
                       <span className="font-bold text-sm">Use SSL/TLS (port 465)</span>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Notification Event Toggles */}
               <div className="bg-white rounded-[3rem] border border-navy-100 shadow-xl p-10 space-y-6">
                 <h2 className="text-2xl font-black text-navy-900 border-l-8 border-saffron pl-6">
                   Notification Events
                 </h2>
                 <p className="text-sm text-navy-400 font-medium pl-1">
                   Choose which events trigger automatic emails or WhatsApp messages.
                 </p>

                 <div className="overflow-hidden rounded-3xl border border-navy-50">
                   {/* Header row */}
                   <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 bg-navy-50/60">
                     <span className="text-[10px] font-black uppercase tracking-widest text-navy-300">Event</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-navy-300 w-20 text-center">Email</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-navy-300 w-20 text-center">WhatsApp</span>
                   </div>

                   {[
                     {
                       label: "New Order Placed",
                       note: "Notify admin when a customer pays",
                       emailKey: "notifyOrderEmail",
                       waKey: "notifyOrderWhatsapp"
                     },
                     {
                       label: "Order Shipped",
                       note: "Alert when order status changes to SHIPPED",
                       emailKey: "notifyShippedEmail",
                       waKey: "notifyShippedWhatsapp"
                     },
                     {
                       label: "Low Stock Alert",
                       note: "Trigger when variant stock drops below threshold",
                       emailKey: "notifyLowStockEmail",
                       waKey: null
                     },
                     {
                       label: "New Customer Signup",
                       note: "Notify when a new user registers",
                       emailKey: "notifyNewUserEmail",
                       waKey: null
                     }
                   ].map((row, i) => (
                     <div
                       key={row.emailKey}
                       className={`grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-5 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-navy-50/20'} border-t border-navy-50`}
                     >
                       <div>
                         <p className="font-black text-navy-900 text-sm">{row.label}</p>
                         <p className="text-[11px] text-navy-400 font-medium mt-0.5">{row.note}</p>
                       </div>

                       {/* Email toggle */}
                       <div className="w-20 flex justify-center">
                         <button
                           onClick={() => setStoreSettings({ ...storeSettings, [row.emailKey]: !(storeSettings as any)[row.emailKey] } as any)}
                           className={`w-12 h-6 rounded-full relative transition-all duration-300 ${(storeSettings as any)[row.emailKey] ? 'bg-navy-900' : 'bg-navy-100'}`}
                         >
                           <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${(storeSettings as any)[row.emailKey] ? 'translate-x-6' : 'translate-x-0'}`} />
                         </button>
                       </div>

                       {/* WhatsApp toggle */}
                       <div className="w-20 flex justify-center">
                         {row.waKey ? (
                           <button
                             onClick={() => setStoreSettings({ ...storeSettings, [row.waKey!]: !(storeSettings as any)[row.waKey!] } as any)}
                             className={`w-12 h-6 rounded-full relative transition-all duration-300 ${(storeSettings as any)[row.waKey] ? 'bg-green-500' : 'bg-navy-100'}`}
                           >
                             <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${(storeSettings as any)[row.waKey] ? 'translate-x-6' : 'translate-x-0'}`} />
                           </button>
                         ) : (
                           <span className="text-[10px] text-navy-200 font-bold">N/A</span>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

             </div>
           )}

           {activeTab === 'social' && (
             <div className="bg-white rounded-[3rem] border border-navy-100 shadow-xl p-12 space-y-10 animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-black text-navy-900 border-l-8 border-saffron pl-6">Global Presence</h2>
                <div className="space-y-8">
                   {['instagram', 'facebook', 'twitter'].map(platform => (
                     <div key={platform} className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-navy-300">{platform} Profile URL</label>
                        <div className="relative">
                           <input 
                              className="w-full bg-navy-50/50 border-none rounded-2xl p-5 pl-14 text-navy-900 font-bold focus:ring-2 focus:ring-saffron outline-none"
                              placeholder={`https://${platform.toLowerCase()}.com/elevenessentials`}
                              value={(storeSettings.socialLinks as any)?.[platform] || ""}
                              onChange={(e) => setStoreSettings({
                                ...storeSettings, 
                                socialLinks: { ...(storeSettings.socialLinks as any), [platform]: e.target.value }
                              })}
                           />
                           <Share2 size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-200" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'security' && (
             <div className="bg-white rounded-[3rem] border border-navy-100 shadow-xl p-12 space-y-10 animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-black text-navy-900 border-l-8 border-saffron pl-6">Shield & Auth</h2>
                <div className="p-10 bg-navy-900 rounded-[2.5rem] text-center space-y-6 text-white">
                   <Lock size={48} className="mx-auto text-saffron" />
                   <h3 className="text-xl font-black">Two-Factor Authentication</h3>
                   <p className="text-navy-300 text-sm max-w-sm mx-auto font-medium">Add an extra layer of security to your admin account. This feature is currently in early access.</p>
                   <Button disabled className="rounded-2xl bg-white/10 text-white font-bold h-12 px-8 border border-white/20">Coming Soon</Button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
