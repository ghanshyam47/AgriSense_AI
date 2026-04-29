import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, ChevronRight, ArrowRight, Star, BarChart2,
  Droplets, Shield, Zap, Users, Globe, DollarSign,
  ChevronLeft, ChevronDown, Menu, X,
  Sprout, Cpu, Truck, ShoppingBasket, LayoutDashboard
} from 'lucide-react';
import Navbar from '../components/Navbar';



const FEATURES = [
  {
    icon: Sprout,
    title: 'Smart Crop Planning',
    desc: 'AI-powered planning aligned with monsoon patterns and weather forecasts.',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    borderColor: 'border-green-100',
  },
  {
    icon: Users,
    title: 'Voice Assistant',
    desc: 'Multilingual voice interface for farmers of all literacy levels.',
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-100',
  },
  {
    icon: Truck,
    title: 'Market Intelligence',
    desc: 'Real-time prices vs MSP alerts to maximize selling profits.',
    color: 'bg-teal-50',
    iconColor: 'text-teal-600',
    borderColor: 'border-teal-100',
  },
  {
    icon: ShoppingBasket,
    title: 'Weather Alerts',
    desc: 'Smart notifications linked to live weather for irrigation control.',
    color: 'bg-lime-50',
    iconColor: 'text-lime-600',
    borderColor: 'border-lime-100',
  },
];

const PLATFORM_TABS = [
  'Multilingual Voice UI',
  'Market Timing & MSP',
  'Smart Weather Alerts',
  'Monsoon Crop Calendar',
  'Pest Detection AI',
];

const PLATFORM_CONTENT = {
  'Multilingual Voice UI': {
    title: 'Multilingual Voice Assistant',
    desc: 'Empowering illiterate farmers through an integrated voice-based interface. Simply tap the mic and speak in local dialects to receive real-time weather and market advice, reducing the technology adoption barrier.',
    stat: '100%',
    statLabel: 'Accessibility for all',
  },
  'Market Timing & MSP': {
    title: 'Market Timing & MSP Comparisons',
    desc: 'Real-time market price overlays against Minimum Support Price (MSP) baselines. This visualizes exactly when and where to sell to secure the highest profit margins, integrating complex market data pipelines.',
    stat: '↑20%',
    statLabel: 'Increased farmer revenue',
  },
  'Smart Weather Alerts': {
    title: 'Smart Weather-Linked Alerts',
    desc: 'Connecting live weather APIs with agronomic models. If heavy rain is forecasted in 2 days, our AI automatically alerts farmers to delay irrigation, preventing waterlogging and saving resources.',
    stat: '40%',
    statLabel: 'Water usage reduced',
  },
  'Monsoon Crop Calendar': {
    title: 'Monsoon-Aligned Planning',
    desc: 'A dynamic crop planning calendar that schedules tasks from sowing to harvest. It is directly synchronized with the Indian monsoon patterns to ensure optimal crop cycles and avoid weather damages.',
    stat: 'Agile',
    statLabel: 'Weather-adaptive schedules',
  },
  'Pest Detection AI': {
    title: 'Early Warning Pest Detection',
    desc: 'Weather-based pest and disease early warning models predict outbreaks (e.g., High Humidity → Leaf Rust risk). Catch diseases before they spread, significantly reducing crop loss and bolstering food security.',
    stat: '30%',
    statLabel: 'Reduction in crop loss',
  },
};

const METRICS = [
  { value: '2.8M', label: 'Active farmers using the platform' },
  { value: '3.2M', label: 'Acres managed with AI planning' },
  { value: '$75M', label: 'Additional farmer earnings' },
  { value: '30+', label: 'Countries supported' },
];

const USER_STORIES = [
  {
    quote: '"AgriSense helped me increase my yield by 30%. The weather alerts alone saved my crops twice this season!"',
    name: 'Ramesh K.',
    role: 'Wheat farmer, Punjab',
  },
  {
    quote: '"The MSP alerts show me the best time to sell. I earned ₹15,000 more this harvest compared to last year."',
    name: 'Lakshmi Devi',
    role: 'Rice farmer, Tamil Nadu',
  },
];

const BLOG_POSTS = [
  {
    img: '/blog_post_1.png',
    date: 'June 10, 2025',
    title: 'Boost Your Harvest With Sustainable Practices',
  },
  {
    img: '/blog_post_2.png',
    date: 'June 13, 2025',
    title: 'Innovations Turning Farming Into Future Tech',
  },
  {
    img: '/farm_hero.png',
    date: 'June 15, 2025',
    title: 'Seasonal Farming Tips For A Bountiful Year',
  },
];

// Hero background image path (URL-encoded because filename has spaces)
const HERO_BG = '/WhatsApp%20Image%202026-04-21%20at%209.31.11%20PM.jpeg';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('Multilingual Voice UI');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[92vh] flex flex-col">
        {/* Soft green gradient top area for text */}
        <div className="relative z-10 pt-28 pb-12 px-6 text-center"
          style={{
            background: 'linear-gradient(180deg, #f0fdf4 0%, #f7fef9 40%, rgba(255,255,255,0.85) 100%)',
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/3 pointer-events-none"></div>
          <div className="absolute top-10 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-5 relative">
            Your Farm's AI<br />
            <span className="text-green-600">Intelligent Assistant</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto mb-8 relative leading-relaxed">
            The all-in-one agricultural platform with AI-driven crop planning, real-time market data, weather alerts, and smart irrigation — built for modern farmers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-0 relative">
            <Link
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-3.5 rounded-full transition-all shadow-lg shadow-green-200/60 hover:shadow-green-300/60 hover:-translate-y-0.5 text-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* Hero background image area */}
        <div className="relative flex-1 min-h-[340px] md:min-h-[420px]">
          {/* Gradient overlay from top fading into image */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 25%, transparent 50%)',
            }}
          ></div>
          <img
            src={HERO_BG}
            alt="Modern agricultural landscape with tractors and irrigation"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Bottom curve mask to create the organic flowing edge */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            style={{ height: '80px' }}
          >
            <svg
              viewBox="0 0 1440 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 40C200 80 400 0 720 40C1040 80 1240 0 1440 40V80H0V40Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── MISSION STATS ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="md:w-1/2">
          <p className="text-gray-800 text-xl md:text-2xl font-medium leading-relaxed">
            We are committed to transforming agriculture with{' '}
            <span className="font-display italic">innovative</span>{' '}
            <span className="text-green-600 font-display italic font-semibold">technology</span>{' '}
            and eco-friendly practices.
          </p>
        </div>
        <div className="md:w-1/2 flex items-center space-x-8 md:space-x-12 md:justify-end">
          <div>
            <p className="text-4xl md:text-5xl font-bold text-green-600">2.8M+</p>
            <p className="text-xs text-gray-400 mt-1.5 max-w-[140px]">Active farmers</p>
          </div>
          <div className="h-14 w-px bg-gray-200"></div>
          <div>
            <p className="text-4xl md:text-5xl font-bold text-gray-800">30%</p>
            <p className="text-xs text-gray-400 mt-1.5 max-w-[140px]">Average yield increase</p>
          </div>
        </div>
      </section>

      {/* ─── OUR SERVICES ─── */}
      <section className="relative py-16 md:py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #f8fdf9 0%, #f0faf2 50%, #f8fdf9 100%)',
        }}
      >
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-100 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Platform <span className="text-green-600">Features</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm leading-relaxed">
              Powerful AI tools designed to help every farmer succeed with data-driven decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className={`${feature.color} border ${feature.borderColor} rounded-2xl p-6 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group`}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={22} className={feature.iconColor} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-[15px]">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM CAPABILITIES ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Product <span className="text-green-600">Capabilities</span>
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tab List */}
            <div className="lg:w-48 flex-shrink-0">
              <div className="space-y-1.5">
                {PLATFORM_TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab
                      ? 'bg-green-600 text-white shadow-md shadow-green-200/60'
                      : 'text-gray-500 hover:bg-green-50 hover:text-gray-700'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:items-start">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{PLATFORM_CONTENT[activeTab].title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  {PLATFORM_CONTENT[activeTab].desc}
                </p>
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6 inline-block">
                  <p className="text-5xl font-bold text-green-600">{PLATFORM_CONTENT[activeTab].stat}</p>
                  <p className="text-sm text-gray-500 mt-1">{PLATFORM_CONTENT[activeTab].statLabel}</p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <img
                  src="/farming_robot.png"
                  alt="Farming technology"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg shadow-green-100/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GLOBAL STATS STRIP ─── */}
      <section className="border-y border-gray-100 py-14"
        style={{
          background: 'linear-gradient(135deg, #f8fdf9 0%, #ffffff 50%, #f0fdf4 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 text-center">
            {METRICS.map((stat) => (
              <div key={stat.value} className="group">
                <p className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-2 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FARMER SUCCESS STORIES ─── */}
      <section className="py-16 md:py-20"
        style={{
          background: 'linear-gradient(180deg, #f8fdf9 0%, #f0faf2 50%, #f8fdf9 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Farmer <span className="text-green-600">Success Stories</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            {USER_STORIES.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-green-100/50 hover:shadow-md hover:shadow-green-100/30 transition-all duration-300">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={14} className="text-yellow-400 fill-yellow-400 mr-0.5" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{t.quote}</p>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Nav arrows */}
          <div className="flex justify-center space-x-3">
            <button className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all">
              <ChevronLeft size={16} className="text-gray-500" />
            </button>
            <button className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shadow-md hover:bg-green-700 transition-all">
              <ChevronRight size={16} className="text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT UPDATES ─── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What's <span className="text-green-600">New</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2.5 max-w-md mx-auto leading-relaxed">
              Latest features and updates to help you get the most out of AgriSense.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="overflow-hidden rounded-2xl mb-4 shadow-sm">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                <h4 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors leading-snug">
                  {post.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-600"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Start growing smarter today</h2>
          <p className="text-green-50/80 text-lg max-w-2xl mx-auto mb-10 font-medium">
            Join 2.8+ million farmers using AgriSense to boost yields and maximize profits. Free to start, no credit card required.
          </p>
          <div className="flex items-center justify-center w-full max-w-md mx-auto">
            <Link
              to="/signup"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-2xl shadow-green-200 hover:-translate-y-1 text-sm uppercase tracking-widest"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.jpeg" alt="AgriSense" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-white font-bold">Agri<span className="text-green-400">Sense</span></span>
          </div>
          <p className="text-xs">© 2025 AgriSense Platform. All rights reserved.</p>
          <div className="flex space-x-6 text-xs">
            {['Privacy Policy', 'Terms', 'Contact'].map(link => (
              <a key={link} href="#" className="hover:text-green-400 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
