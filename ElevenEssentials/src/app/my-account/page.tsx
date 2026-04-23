"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  MapPin,
  Package,
  Heart,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Save,
  LayoutDashboard,
  Globe,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Shield,
  CreditCard,
  Settings
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:4000";

interface UserAddress {
  id: string;
  street: string;
  recipientName?: string;
  phoneNumber?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orders: any[];
  addresses: UserAddress[];
}

export default function MyAccountPage() {
  const { data: session, status, update } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [saving, setSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
    otp: ""
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [timer, setTimer] = useState(300);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "", 
    recipientName: "",
    phoneNumber: "",
    city: "", 
    state: "", 
    country: "India", 
    zipCode: "", 
    isDefault: false
  });

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${session.user.id}/profile`);
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) fetchProfile();
  }, [session?.user?.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${session.user.id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData?.name,
          email: userData?.email,
          phone: userData?.phone,
          password: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
          otp: passwordForm.otp
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      alert("Profile updated successfully!");
      setPasswordForm({ newPassword: "", confirmPassword: "", otp: "" });
      setShowOtpInput(false);
      update(); // Refresh session
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const requestProfileOTP = async () => {
    if (!session?.user?.id) return;
    setFormError(null);

    // VALIDATION BEFORE SENDING OTP
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setFormError("Please fill in both password fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/request-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id })
      });
      const data = await res.json();
      if (res.ok) {
        setShowOtpInput(true);
        setTimer(300); // Reset timer to 5 minutes
      } else {
        throw new Error(data.error || "Failed to send OTP");
      }
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtpInput && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpInput, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const handleOpenEditModal = (addr: UserAddress) => {
    setNewAddress({
      street: addr.street,
      recipientName: addr.recipientName || "",
      phoneNumber: addr.phoneNumber || "",
      city: addr.city,
      state: addr.state,
      country: addr.country,
      zipCode: addr.zipCode,
      isDefault: addr.isDefault
    });
    setEditingAddressId(addr.id);
    setShowAddressModal(true);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingAddressId
        ? `${API_BASE_URL}/api/users/addresses/${editingAddressId}`
        : `${API_BASE_URL}/api/users/${session?.user?.id}/addresses`;

      const res = await fetch(url, {
        method: editingAddressId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress)
      });

      if (res.ok) {
        setShowAddressModal(false);
        setEditingAddressId(null);
        setNewAddress({ 
          street: "", 
          recipientName: "",
          phoneNumber: "",
          city: "", 
          state: "", 
          country: "India", 
          zipCode: "", 
          isDefault: false 
        });
        fetchProfile();
      }
    } catch (err) {
      alert("Failed to process address");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/users/addresses/${id}`, { method: "DELETE" });
      fetchProfile();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const [addressLoading, setAddressLoading] = useState<string | null>(null);

  const handleSetDefaultAddress = async (id: string) => {
    if (!session?.user?.id) return;
    setAddressLoading(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${session.user.id}/addresses/${id}/default`, {
        method: "PATCH"
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update");
      }

      await fetchProfile();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setAddressLoading(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-navy-900 animate-spin" />
        <p className="font-bold text-navy-400 uppercase tracking-widest text-xs">Accessing your vaults...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-xl mx-auto my-20 p-12 text-center bg-white rounded-3xl border border-navy-100 shadow-xl">
        <Shield size={64} className="mx-auto text-navy-200 mb-6" />
        <h2 className="text-2xl font-black text-navy-900 mb-2">Member Authentication Required</h2>
        <p className="text-navy-400 font-medium mb-8">Login to view your orders, saved addresses, and profile settings.</p>
        <Link href="/login">
          <Button className="w-full bg-navy-900 text-white h-14 rounded-2xl font-black">Login to Account</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "security", label: "Vault Security", icon: ShieldCheck },
    { id: "addresses", label: "Address Book", icon: MapPin },
    { id: "orders", label: "Order History", icon: Package, link: "/my-account/orders" },
    { id: "wishlist", label: "Saved Items", icon: Heart, link: "/wishlist" },
  ];

  return (
    <div className="min-h-screen bg-navy-50/20 text-navy-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Stat Card */}
        <div className="bg-navy-900 rounded-[3rem] p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black tracking-tight mb-2">Hello, {userData?.name?.split(' ')[0]}!</h1>
            <p className="text-navy-300 font-medium">Manage your premium essentials and vault security.</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center min-w-[120px]">
              <p className="text-[10px] uppercase font-black tracking-widest text-saffron mb-1">Orders</p>
              <p className="text-2xl font-bold">{userData?.orders?.length || 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center min-w-[120px]">
              <p className="text-[10px] uppercase font-black tracking-widest text-saffron mb-1">Addresses</p>
              <p className="text-2xl font-bold">{userData?.addresses?.length || 0}</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Nav */}
          <div className="space-y-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return tab.link ? (
                <Link key={tab.id} href={tab.link} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-navy-50 text-navy-400 hover:border-navy-900 hover:text-navy-900 transition-all font-bold">
                  <TabIcon size={20} />
                  {tab.label}
                  <ChevronRight size={16} className="ml-auto opacity-30" />
                </Link>
              ) : (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all font-bold ${activeTab === tab.id ? 'bg-navy-900 text-white shadow-xl' : 'bg-white border border-navy-50 text-navy-400 hover:bg-navy-50'}`}
                >
                  <TabIcon size={20} />
                  {tab.label}
                </button>
              );
            })}
            <button 
              onClick={() => signOut({ callbackUrl: "/" })} 
              className="w-full flex lg:hidden items-center gap-4 p-5 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all mt-8"
            >
              <LogOut size={20} />
              Secure Logout
            </button>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-[3rem] border border-navy-100 shadow-sm p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <form onSubmit={handleUpdateProfile} className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-saffron">
                        <User size={20} />
                      </div>
                      <h3 className="text-xl font-black text-navy-900">Identity Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block ml-1">Full Name</label>
                        <input
                          className="w-full bg-navy-50/50 border-2 border-transparent rounded-2xl p-5 font-bold text-navy-900 focus:border-navy-900 focus:bg-white transition-all outline-none"
                          value={userData?.name}
                          onChange={(e) => setUserData(userData ? { ...userData, name: e.target.value } : null)}
                        />
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block ml-1">Email (Immutable)</label>
                        <input
                          className="w-full bg-navy-50/50 border-none rounded-2xl p-5 font-bold text-navy-900 opacity-60 cursor-not-allowed"
                          value={userData?.email}
                          readOnly
                        />
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block ml-1">Mobile Number</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-navy-100 pr-2">
                            <span className="text-xs font-black text-navy-400">+91</span>
                          </div>
                          <input
                            maxLength={10}
                            className="w-full bg-navy-50/50 border-2 border-transparent rounded-2xl p-5 pl-16 font-bold text-navy-900 focus:border-navy-900 focus:bg-white transition-all outline-none"
                            value={userData?.phone || ""}
                            placeholder="0000000000"
                            onChange={(e) => setUserData(userData ? { ...userData, phone: e.target.value.replace(/\D/g, '') } : null)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={saving} className="bg-navy-900 text-white h-16 px-12 rounded-[2rem] font-black shadow-2xl shadow-navy-900/20 hover:scale-[1.02] transition-transform flex gap-3">
                    {saving && <Loader2 className="animate-spin" size={20} />}
                    <Save size={20} className="text-saffron" />
                    Update Identity details
                  </Button>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-[3rem] border border-navy-100 shadow-sm p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <form onSubmit={handleUpdateProfile} className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-saffron">
                        <ShieldCheck size={20} />
                      </div>
                      <h3 className="text-xl font-black text-navy-900">Credential Synchronization</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block ml-1">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-navy-50/50 border-2 border-transparent rounded-2xl p-5 font-bold text-navy-900 focus:border-navy-900 focus:bg-white transition-all outline-none"
                          value={passwordForm.newPassword}
                          onChange={(e) => {
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                            setFormError(null);
                          }}
                        />
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2 block ml-1">Verify Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-navy-50/50 border-2 border-transparent rounded-2xl p-5 font-bold text-navy-900 focus:border-navy-900 focus:bg-white transition-all outline-none"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => {
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                            setFormError(null);
                          }}
                        />
                      </div>
                    </div>

                    {formError && (
                      <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        Error: {formError}
                      </p>
                    )}

                    {/* OTP SECTION */}
                    {(passwordForm.newPassword || passwordForm.confirmPassword) && (
                      <div className="pt-6 animate-in slide-in-from-top-4 duration-500">
                        {!showOtpInput ? (
                          <Button
                            type="button"
                            onClick={requestProfileOTP}
                            disabled={otpLoading}
                            className="bg-navy-900/10 text-navy-900 border-2 border-navy-900/5 hover:bg-navy-900 hover:text-white h-12 px-8 rounded-xl font-black flex gap-2 transition-all"
                          >
                            {otpLoading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                            Authorize Password Change
                          </Button>
                        ) : (
                          <div className="space-y-4 max-w-xs transition-all">
                            <label className="text-[10px] font-black uppercase tracking-widest text-saffron mb-2 block ml-1">Verification Code Sent</label>
                            <input
                              maxLength={6}
                              placeholder="000000"
                              className="w-full bg-saffron/10 border-2 border-saffron/20 rounded-2xl p-5 font-black text-2xl tracking-[0.5em] text-center text-navy-900 focus:border-saffron focus:bg-white transition-all outline-none"
                              value={passwordForm.otp}
                              onChange={(e) => setPasswordForm({ ...passwordForm, otp: e.target.value })}
                            />
                            <p className={`text-[10px] font-black uppercase tracking-widest ml-1 ${timer < 30 ? 'text-red-500 animate-pulse' : 'text-navy-300'}`}>
                              {timer > 0 ? `Expires in ${formatTime(timer)}` : "OTP Expired"}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={saving || !showOtpInput || passwordForm.otp.length !== 6}
                    className="bg-navy-900 text-white h-16 px-12 rounded-[2rem] font-black shadow-2xl shadow-navy-900/20 hover:scale-[1.02] transition-transform flex gap-3 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                  >
                    {saving && <Loader2 className="animate-spin" size={20} />}
                    <ShieldCheck size={20} className="text-saffron" />
                    Synchronize New Credentials
                  </Button>
                </form>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-navy-900">Address Book</h2>
                  <Button onClick={() => { setEditingAddressId(null); setNewAddress({ street: "", city: "", state: "", country: "India", zipCode: "", isDefault: false }); setShowAddressModal(true); }} className="bg-saffron text-navy-900 h-12 px-6 rounded-xl font-black flex gap-2 hover:scale-[1.05] transition-transform">
                    <Plus size={20} />
                    Add New Address
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userData?.addresses?.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((addr: any) => (
                    <div key={addr.id} className={`p-8 bg-white rounded-3xl border transition-all duration-500 ${addr.isDefault ? 'border-saffron shadow-lg scale-[1.02]' : 'border-navy-100'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center text-navy-900">
                          <MapPin size={24} />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditModal(addr)}
                            className="p-2 hover:bg-navy-50 rounded-lg text-navy-400 hover:text-navy-900 transition-colors"
                            title="Edit Address"
                          >
                            <Edit size={16} />
                          </button>
                          {addr.isDefault && (
                            <span className="text-[10px] font-black uppercase tracking-widest bg-saffron/20 text-navy-900 px-3 py-1 rounded-full">Primary</span>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="font-black text-navy-900 text-lg">{addr.recipientName || userData?.name}</p>
                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">{addr.phoneNumber || "+91 00000 00000"}</p>
                      </div>
                      <p className="font-bold text-navy-900 text-sm mb-1">{addr.street}</p>
                      <p className="text-navy-400 font-medium text-xs">{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="text-navy-400 font-medium text-xs mb-6">{addr.country}</p>

                      <div className="flex items-center justify-between mt-auto">
                        {!addr.isDefault && (
                          <button
                            disabled={!!addressLoading}
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-navy-900 hover:text-saffron transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                          >
                            {addressLoading === addr.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                            {addressLoading === addr.id ? "Updating..." : "Make Primary"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest ml-auto"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {(!userData?.addresses || userData.addresses.length === 0) && (
                  <div className="p-20 bg-navy-50/50 rounded-[3rem] border-2 border-dashed border-navy-100 text-center">
                    <MapPin size={48} className="mx-auto text-navy-100 mb-4" />
                    <p className="text-navy-400 font-bold italic">Your address book is empty. Add a vault for faster checkouts.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Premium Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-white w-full max-w-xl rounded-[3.5rem] p-10 md:p-14 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-full blur-3xl -mr-16 -mt-16" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center text-saffron shadow-lg shadow-navy-900/20">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-navy-900 tracking-tight">{editingAddressId ? "Modify Vault" : "Shipping Vault"}</h3>
                    <p className="text-navy-400 font-bold text-sm uppercase tracking-widest mt-1">{editingAddressId ? "Update existing destination" : "Register a new destination"}</p>
                  </div>
                </div>

                <form onSubmit={handleAddAddress} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <input 
                          placeholder="Recipient Name" 
                          className="w-full bg-navy-50/50 rounded-2xl p-5 pl-14 text-navy-900 font-bold border-2 border-transparent transition-all focus:border-navy-900 focus:bg-white outline-none" 
                          value={newAddress.recipientName} 
                          onChange={e => setNewAddress({...newAddress, recipientName: e.target.value})} 
                          required 
                        />
                        <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-200 group-focus-within:text-navy-900 transition-colors" />
                      </div>
                      <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                          <ShieldCheck size={20} className="text-navy-200 group-focus-within:text-navy-900 transition-colors" />
                          <span className="text-xs font-black text-navy-400 border-r border-navy-100 pr-2">+91</span>
                        </div>
                        <input 
                          maxLength={10}
                          placeholder="9876543210" 
                          className="w-full bg-navy-50/50 rounded-2xl p-5 pl-24 text-navy-900 font-bold border-2 border-transparent transition-all focus:border-navy-900 focus:bg-white outline-none" 
                          value={newAddress.phoneNumber} 
                          onChange={e => setNewAddress({...newAddress, phoneNumber: e.target.value.replace(/\D/g, '')})} 
                          required 
                        />
                      </div>
                   </div>

                   <div className="relative group">
                    <input
                      placeholder="Street Address"
                      className="w-full bg-navy-50/50 rounded-2xl p-5 pl-14 text-navy-900 font-bold border-2 border-transparent transition-all focus:border-navy-900 focus:bg-white outline-none"
                      value={newAddress.street}
                      onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                      required
                    />
                    <LayoutDashboard size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-200 group-focus-within:text-navy-900 transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative group">
                      <input
                        placeholder="City"
                        className="w-full bg-navy-50/50 rounded-2xl p-5 pl-14 text-navy-900 font-bold border-2 border-transparent transition-all focus:border-navy-900 focus:bg-white outline-none"
                        value={newAddress.city}
                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                      />
                      <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-200 group-focus-within:text-navy-900 transition-colors" />
                    </div>
                    <div className="relative group">
                      <input
                        placeholder="State"
                        className="w-full bg-navy-50/50 rounded-2xl p-5 pl-14 text-navy-900 font-bold border-2 border-transparent transition-all focus:border-navy-900 focus:bg-white outline-none"
                        value={newAddress.state}
                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                        required
                      />
                      <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-200 group-focus-within:text-navy-900 transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative group">
                      <input
                        placeholder="Zip Code"
                        className="w-full bg-navy-50/50 rounded-2xl p-5 pl-14 text-navy-900 font-bold border-2 border-transparent transition-all focus:border-navy-900 focus:bg-white outline-none"
                        value={newAddress.zipCode}
                        onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                        required
                      />
                      <ShieldCheck size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-200 group-focus-within:text-navy-900 transition-colors" />
                    </div>
                    <div className="relative group">
                      <select
                        disabled
                        className="w-full bg-navy-50/50 rounded-2xl p-5 pl-14 text-navy-900 font-bold border-2 border-transparent opacity-60 cursor-not-allowed appearance-none outline-none"
                        value="India"
                      >
                        <option value="India">India</option>
                      </select>
                      <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/4" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-6 bg-navy-50/30 rounded-3xl group cursor-pointer hover:bg-navy-50 transition-colors" onClick={() => setNewAddress({ ...newAddress, isDefault: !newAddress.isDefault })}>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${newAddress.isDefault ? 'bg-navy-900 border-navy-900 text-saffron' : 'border-navy-200 bg-white'}`}>
                      {newAddress.isDefault && <CheckCircle2 size={14} />}
                    </div>
                    <span className="text-sm font-black text-navy-900 uppercase tracking-widest">Set as Primary Shipping Vault</span>
                  </div>

                  <div className="flex gap-6 pt-6">
                    <Button type="button" variant="ghost" onClick={() => setShowAddressModal(false)} className="flex-1 h-16 rounded-2xl font-black text-navy-400 hover:text-navy-900 hover:bg-navy-50">Cancel</Button>
                    <Button type="submit" disabled={saving} className="flex-[2] bg-navy-900 text-white h-16 rounded-3xl font-black shadow-2xl shadow-navy-900/40 hover:scale-[1.02] transition-transform active:scale-95 flex gap-3 items-center justify-center">
                      {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="text-saffron" />}
                      {saving ? (editingAddressId ? "Updating..." : "Encrypting...") : (editingAddressId ? "Update Vault" : "Secure Save")}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="mt-8 pt-8 border-t border-navy-100 flex items-center justify-center gap-3 text-navy-300">
                <Shield size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">AES-256 Encrypted Profile Data</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
