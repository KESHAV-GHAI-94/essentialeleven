"use client";

import { 
  ShieldCheck, 
  Globe, 
  Zap, 
  Star, 
  Award, 
  Users,
  Target,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const stats = [
    { label: "Products Curated", value: "500+", icon: Star },
    { label: "Happy Clients", value: "10k+", icon: Users },
    { label: "Global Presence", value: "12+", icon: Globe },
    { label: "Fast Deliveries", value: "24h", icon: Zap },
  ];

  const values = [
    {
      title: "Premium Quality",
      description: "Every product in the Eleven Essentials collection undergoes a rigorous vetting process to ensure architectural perfection and lasting durability.",
      icon: ShieldCheck,
      color: "bg-navy-900"
    },
    {
      title: "Absolute Exclusivity",
      description: "We don't follow trends; we set them. Our collections are curated for those who demand a lifestyle that is uniquely their own.",
      icon: Award,
      color: "bg-saffron"
    },
    {
      title: "Agile Service",
      description: "Time is the ultimate luxury. Our logistics ecosystem is engineered for speed, delivering your essentials with surgical precision.",
      icon: Zap,
      color: "bg-navy-900"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-navy-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-navy-800 via-navy-900 to-black opacity-80" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/20 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-500/10 rounded-full blur-[120px] -ml-48 -mb-48" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-saffron text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <Target size={14} />
             Our Mission Control
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Redefining the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-orange-400">Essential Lifestyle.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-navy-300 text-lg md:text-xl font-medium mb-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            Eleven Essentials is more than a marketplace. It's a highly-curated ecosystem of premium products designed for the modern architect of their own life.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
            <Link href="/shop">
              <Button className="bg-saffron text-navy-900 h-16 px-10 rounded-2xl font-black hover:scale-[1.05] transition-transform shadow-2xl shadow-saffron/20">
                Explore the Vault
              </Button>
            </Link>
            <Link href="#our-story">
              <Button variant="ghost" className="text-white hover:text-saffron h-16 px-10 font-black text-lg">
                Discover Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-900 mx-auto mb-6 group-hover:bg-navy-900 group-hover:text-saffron transition-all duration-500 transform group-hover:rotate-12">
                    <Icon size={28} />
                  </div>
                  <p className="text-4xl font-black text-navy-900 mb-2">{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="our-story" className="py-32 bg-navy-50/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 relative">
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-saffron/20 rounded-full blur-3xl" />
               <div className="bg-navy-900 rounded-[3.5rem] p-4 relative z-10">
                  <div className="aspect-[4/5] bg-navy-800 rounded-[3rem] overflow-hidden flex items-center justify-center">
                    <Rocket size={120} className="text-saffron opacity-20 animate-pulse" />
                  </div>
               </div>
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <div className="w-12 h-1.5 bg-saffron rounded-full" />
              <h2 className="text-5xl font-black text-navy-900 tracking-tight leading-tight">
                Architecting Excellence <br /> Since the Beginning.
              </h2>
              <div className="space-y-6 text-navy-400 font-medium text-lg leading-relaxed">
                <p>
                  Eleven Essentials was born from a simple realization: the market was saturated with quantity, but starving for quality. We set out to create a sanctuary where every click leads to excellence.
                </p>
                <p>
                  Our philosophy is rooted in the number Eleven—representing a level beyond the traditional ten-point scale. We go the extra mile, find the rarer piece, and provide the swifter service.
                </p>
              </div>
              <div className="pt-6">
                 <div className="flex items-center gap-6 p-8 bg-white rounded-3xl border border-navy-100 shadow-xl shadow-navy-900/5 hover:border-navy-900 transition-all cursor-crosshair group">
                    <div className="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center text-saffron shrink-0 group-hover:scale-[1.1] transition-transform">
                       <QuoteIcon className="w-8 h-8 fill-current" />
                    </div>
                    <p className="text-navy-900 font-bold italic text-lg leading-snug">
                      "Essential doesn't mean basic. It means indispensable."
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-saffron font-black uppercase tracking-[0.3em] text-xs mb-4">Our Foundation</p>
            <h2 className="text-5xl font-black text-navy-900 tracking-tight">Core Architectural Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="p-10 rounded-[3rem] bg-navy-50/50 border-2 border-transparent hover:border-navy-900/10 hover:bg-white hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 group">
                  <div className={`w-16 h-16 ${value.color === 'bg-saffron' ? 'bg-saffron text-navy-900' : 'bg-navy-900 text-white'} rounded-2xl flex items-center justify-center mb-8 transform group-hover:-rotate-12 transition-transform duration-500`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-navy-900 mb-6">{value.title}</h3>
                  <p className="text-navy-400 font-medium leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-5xl mx-auto bg-navy-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-[100px] -mr-48 -mt-48" />
           <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
                Ready to Join the <br />
                <span className="text-saffron">Essential Revolution?</span>
              </h2>
              <p className="text-navy-300 font-medium text-lg mb-12 max-w-xl mx-auto">
                Discover a curation of products that enhance your daily rhythm and elevate your lifestyle architectural standards.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/shop">
                  <Button className="bg-saffron text-navy-900 h-16 px-12 rounded-2xl font-black text-lg hover:scale-[1.05] transition-transform">
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16 px-12 rounded-2xl font-black text-lg">
                    Contact Liaison
                  </Button>
                </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

function QuoteIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017V4H21.017C22.1216 4 23.017 4.89543 23.017 6V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM3.017 21C2.46472 21 2.017 20.5523 2.017 20V11C2.017 7.68629 4.70329 5 8.017 5H11.017V8H9.017C7.91243 8 7.017 8.89543 7.017 10V13C7.017 13.5523 7.46472 14 8.017 14H11.017V21H3.017Z" />
    </svg>
  );
}
