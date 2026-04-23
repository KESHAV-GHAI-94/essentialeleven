"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Save,
  Package,
  Users,
  ShieldCheck,
  ToggleLeft as Toggle,
  Settings,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

const DEFAULT_SETTINGS = {
  browserNotifications: true,
  emailAlerts: true,
  whatsappAlerts: false,
  orderAlerts: true,
  inventoryAlerts: true,
  newCustomerAlerts: true,
  marketingEmails: false,
  securityAlerts: true
};

export default function NotificationSettingsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const loadSettings = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/users/settings/notifications/${session.user.id}`);
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      loadSettings();
    }
  }, [session?.user?.id, resetTrigger]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setSaving(true);
    try {
      const res = await fetch("http://localhost:4000/api/users/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, settings })
      });
      if (res.ok) {
        alert("Success! Your notification preferences have been updated.");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Error: Could not save your preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm("Are you sure you want to restore system defaults? This will overwrite your current unsaved changes.")) {
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-saffron animate-spin" />
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="max-w-4xl mx-auto mt-20">
        <div className="p-12 bg-white rounded-[2.5rem] border border-navy-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-navy-50 rounded-full flex items-center justify-center mx-auto text-navy-200">
             <ShieldCheck size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-navy-900">Access Restricted</h2>
            <p className="text-navy-400 font-medium mt-2">You must be logged in as an administrator to manage these preferences.</p>
          </div>
          <Link href="/api/auth/signin">
             <Button className="rounded-xl bg-navy-900 text-white font-bold px-8 h-12">Sign In to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: "Delivery Channels",
      description: "How would you like to receive system alerts?",
      items: [
        { id: "browserNotifications", label: "Browser Notifications", icon: Bell, note: "Real-time popups while using the dashboard" },
        { id: "emailAlerts", label: "Email Summaries", icon: Mail, note: "Daily and weekly digest of store activity" },
        { id: "whatsappAlerts", label: "WhatsApp Alerts", icon: MessageSquare, note: "Direct messages for high-priority order events" },
      ]
    },
    {
      title: "Store Activities",
      description: "Which events should trigger a notification?",
      items: [
        { id: "orderAlerts", label: "New Orders", icon: Package, note: "Notify when a payment is verified" },
        { id: "inventoryAlerts", label: "Inventory Thresholds", icon: Settings, note: "Notify when items are low or out of stock" },
        { id: "newCustomerAlerts", label: "New Registrations", icon: Users, note: "Notify when a new user joins the store" },
      ]
    },
    {
      title: "Security & System",
      description: "Critical account and application health updates",
      items: [
        { id: "securityAlerts", label: "Security Logs", icon: ShieldCheck, note: "Notify on unusual admin login attempts" },
      ]
    }
  ];

  if (loading && session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-saffron animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* breadcrumbs */}
      <div className="flex items-center gap-2">
        <Link href="/admin/notifications" className="p-2 hover:bg-navy-50 rounded-xl transition-colors text-navy-400">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black text-navy-900 tracking-tight">Notification Settings</h1>
      </div>

      {!session?.user?.id && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold text-center">
          You must be logged in to manage your preferences.
        </div>
      )}

      <div className={`grid grid-cols-1 gap-8 ${!session?.user?.id ? 'opacity-50 pointer-events-none' : ''}`}>
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] border border-navy-100 shadow-xl overflow-hidden p-10">
            <div className="mb-8">
              <h2 className="text-xl font-black text-navy-900">{section.title}</h2>
              <p className="text-navy-400 font-medium text-sm mt-1">{section.description}</p>
            </div>

            <div className="space-y-6">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = settings[item.id as keyof typeof settings];
                return (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex gap-5 items-center">
                      <div className={`p-3 rounded-2xl transition-colors ${isActive ? 'bg-navy-900 text-saffron shadow-lg' : 'bg-navy-50 text-navy-300'}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className={`font-black text-sm transition-colors ${isActive ? 'text-navy-900' : 'text-navy-400'}`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-navy-300 font-medium mt-0.5">{item.note}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSetting(item.id as keyof typeof settings)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isActive ? 'bg-saffron' : 'bg-navy-100'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3 pb-12">
          <Button
            variant="outline"
            className="h-14 px-8 rounded-2xl font-bold border-navy-100 text-navy-400 hover:bg-navy-900 hover:text-white"
            onClick={handleRestoreDefaults}
          >
            Restore Defaults
          </Button>
          <Button
            className="h-14 px-10 rounded-2xl font-black bg-navy-900 text-white shadow-2xl hover:scale-[1.02] transition-transform flex gap-2"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}

