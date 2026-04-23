"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, ArrowRight } from "lucide-react";

const API_BASE_URL = "http://localhost:4000";

export function Footer() {
  const [links, setLinks] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);

  useEffect(() => {
    // Sync Footer Links
    fetch(`${API_BASE_URL}/api/settings/footer`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLinks(data);
      })
      .catch(err => console.error("Footer link sync error:", err));

    // Sync Social Settings
    fetch(`${API_BASE_URL}/api/settings/store`)
      .then(res => res.json())
      .then(data => {
        if (data) setStoreSettings(data);
      })
      .catch(err => console.error("Store settings sync error:", err));
  }, []);

  const socialIcons = [
    { icon: Facebook, name: 'facebook' },
    { icon: Instagram, name: 'instagram' },
    { icon: Twitter, name: 'twitter' }
  ];

  const getLinksByGroup = (groupName: string) => {
    return links.filter(l => l.group === groupName);
  };

  return (
    <footer className="bg-navy-900 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-saffron flex items-center justify-center font-bold text-navy-900">
                E11
              </div>
              <span className="text-xl font-bold text-white tracking-tighter uppercase">
                Essential <span className="text-saffron">Eleven</span>
              </span>
            </Link>
            <p className="text-navy-100/60 leading-relaxed max-w-xs text-sm">
              Redefining daily essentials through premium engineering and zero-budget accessibility.
            </p>
            <div className="flex gap-4">
              {socialIcons.map((item, i) => {
                const Icon = item.icon;
                const link = storeSettings?.socialLinks?.[item.name] || "#";
                return (
                  <Link 
                    key={i} 
                    href={link} 
                    target={link !== "#" ? "_blank" : undefined}
                    aria-label={item.name} 
                    className="p-2 bg-navy-800 text-navy-100 hover:bg-saffron hover:text-navy-900 transition-all rounded"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Collections</h4>
            <ul className="space-y-4">
              {getLinksByGroup("Collections").map((item) => (
                <li key={item.id}>
                  <Link href={item.url} className="text-navy-100/60 hover:text-saffron transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
              {getLinksByGroup("Collections").length === 0 && (
                ["Obsidian Store", "Meridian Logic", "Essential Staples"].map(item => (
                   <li key={item}>
                     <Link href="/shop" className="text-navy-100/60 hover:text-saffron transition-colors text-sm">{item}</Link>
                   </li>
                ))
              )}
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Experience</h4>
            <ul className="space-y-4">
              {getLinksByGroup("Experience").map((item) => (
                <li key={item.id}>
                  <Link href={item.url} className="text-navy-100/60 hover:text-saffron transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
              {getLinksByGroup("Experience").length === 0 && (
                ["About Us", "Track Order", "Warranty & Care"].map(item => (
                   <li key={item}>
                     <Link href="#" className="text-navy-100/60 hover:text-saffron transition-colors text-sm">{item}</Link>
                   </li>
                ))
              )}
            </ul>
          </div>

          {/* Newsletter / Circle */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Join the Circle</h4>
            <ul className="space-y-4 mb-6">
              {getLinksByGroup("Join the Circle").map((item) => (
                <li key={item.id}>
                  <Link href={item.url} className="text-navy-100/60 hover:text-saffron transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-navy-100/60 text-sm mb-6">Stay informed on limited drops and premium updates.</p>
            <div className="flex bg-navy-800 p-1 rounded group focus-within:ring-1 focus-within:ring-saffron">
              <input 
                type="email" 
                placeholder="Email address"
                className="bg-transparent border-none focus:ring-0 text-white text-sm px-4 py-2 w-full"
              />
              <button className="bg-saffron p-2 rounded text-navy-900 hover:bg-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-navy-100/40 text-xs tracking-tight">
            © 2026 Essential Eleven. All rights reserved. Built for the high-performance life.
          </p>
          <div className="flex gap-8">
             {["Terms", "Privacy", "Cookies"].map(item => (
                 <Link key={item} href="#" className="text-navy-100/40 hover:text-white text-xs transition-colors">{item}</Link>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
