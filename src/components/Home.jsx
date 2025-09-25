'use client';
import axios from "axios";
import Navbar from "./Navbar";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import useAuthStore from '@/utility/justAuth';
import ProfileDropdown from './ProfileDropdown';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    articles: 0,
    books: 0,
    journals: 0,
    loading: true
  });
  const [animatedNumbers, setAnimatedNumbers] = useState({
    articles: 0,
    books: 0,
    journals: 0
  });


  const { isLoggedIn, logout, hasHydrated } = useAuthStore();

  // Memoized logout handler with error handling
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      localStorage.clear();
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout. Please try again.');
    }
  }, [logout]);

  // Memoized search handler
  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      window.location.href = `/search/${encodeURIComponent(searchTerm.trim())}`;
    }
  }, [searchTerm]);

  

  // Animated counter while loading
  useEffect(() => {
    let interval;
    if (stats.loading) {
      interval = setInterval(() => {
        setAnimatedNumbers(prev => ({
          articles: Math.floor(Math.random() * 999999) + 100000,
          books: Math.floor(Math.random() * 99999) + 10000,
          journals: Math.floor(Math.random() * 9999) + 1000
        }));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [stats.loading]);

  // Number formatting
  const formatNumber = (num) => {
    if (num >= 100000) return Math.floor(num / 100000) + "L+";
    if (num >= 1000) return Math.floor(num / 1000) + "K+";
    return num + "+";
  };

  // Data fetching functions
  const fetchDOAJCount = async () => {
    try {
      const response = await axios.get('/api/doaj-stats');
      return {
        articles: response.data?.articles || 0,
        journals: response.data?.journals || 0,
        total: response.data?.total || 0
      };
    } catch {
      return { articles: 0, journals: 0, total: 0 };
    }
  };

  const fetchLocalCount = async () => {
    try {
      const response = await axios.get(`/api/journal`);
      const journals = response.data?.journals || [];
      const articleCount = journals.filter(j => j.type && !j.type.toLowerCase().includes('book')).length;
      const bookCount = journals.filter(j => j.type && j.type.toLowerCase().includes('book')).length;
      return { articles: articleCount, books: bookCount, total: journals.length };
    } catch {
      return { articles: 0, books: 0, total: 0 };
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const [doajData, localData] = await Promise.all([
        fetchDOAJCount(),
        fetchLocalCount()
      ]);
      setStats({
        articles: localData.articles + doajData.articles,
        books: localData.books,
        journals: doajData.journals,
        loading: false
      });
    } catch {
      setStats(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Initialize data
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Early return if store hasn't hydrated
  if (!hasHydrated) {
    return null;
  }

  return (
    <>
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.6)), url('/library.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <Navbar />

        {/* Hero Section - Premium Mobile Responsive */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 lg:px-16 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24 min-h-screen">
          {/* University Badge - Enhanced with Animation */}
          <div className="animate-fade-in-up rounded-full px-5 sm:px-7 py-3 sm:py-4 border border-white/20 bg-white/5 backdrop-blur-sm mb-8 sm:mb-12 shadow-2xl hover:border-white/30 transition-all duration-300" style={{animationDelay: '0.2s'}}>
            <span className="text-sm sm:text-base font-semibold text-white flex items-center gap-3">
              <span className="text-lg animate-pulse">📚</span>
              <span className="tracking-wide">Digital Library - Mangaldai College</span>
            </span>
          </div>

          {/* Main Heading - Enhanced Typography with Better Hierarchy */}
          <div className="animate-fade-in-up text-center mb-8 sm:mb-10" style={{animationDelay: '0.4s'}}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight px-2 drop-shadow-2xl">
              <span className="text-white">UNLOCK </span>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">KNOWLEDGE</span>
            </h1>
            
            {/* Decorative line */}
            <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full mb-4"></div>
          </div>

          {/* Subtitle - Enhanced with Better Typography */}
          <p className="animate-fade-in-up text-white/85 text-lg sm:text-xl md:text-2xl max-w-xl sm:max-w-2xl md:max-w-3xl mb-12 sm:mb-14 leading-relaxed font-light px-4 drop-shadow-lg text-center" style={{animationDelay: '0.6s'}}>
            Access millions of academic resources, research papers, and
            <br className="hidden sm:block" />
            digital archives from anywhere in the world
          </p>

          {/* Enhanced Search Section */}
          <div className="animate-slide-in-from-bottom bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 shadow-2xl max-w-xl sm:max-w-2xl md:max-w-4xl w-full mb-12 sm:mb-14 mx-auto relative overflow-hidden" style={{animationDelay: '0.8s'}}>
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5 pointer-events-none"></div>
            
            {/* Modern Search Bar */}
            <div className="flex w-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 overflow-hidden mb-10 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 relative group">
              {/* Search icon with animated background */}
              <div className="flex items-center pl-6 sm:pl-8 py-2 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Search className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" />
              </div>
              
              {/* Enhanced input */}
              <input
                type="text"
                placeholder="Search books, articles, research papers, datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="px-4 sm:px-5 py-3 sm:py-4 w-full bg-transparent text-white placeholder-white/70 focus:outline-none text-sm sm:text-base lg:text-lg font-medium focus:placeholder-white/50 transition-all duration-300"
                aria-label="Search for academic resources"
              />
              
              {/* Enhanced search button */}
              <button
                onClick={handleSearch}
                className={`relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 transition-all duration-500 font-bold px-6 sm:px-8 py-3 sm:py-4 text-white text-sm sm:text-base shadow-xl group ${
                  !searchTerm.trim() ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105'
                }`}
                disabled={!searchTerm.trim()}
                aria-label="Submit search"
              >
                <span className="relative z-10 tracking-wide">SEARCH</span>
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Advanced Search Button */}
            <div className="flex justify-center px-4">
              <Link
                href="/advanceSearch"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm text-white font-bold hover:from-cyan-400/30 hover:to-blue-400/30 hover:border-cyan-300/60 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 overflow-hidden"
                aria-label="Advanced Search"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="relative z-10">Advanced Search</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div> 

          {/* Premium Stats Section */}
          <div className="animate-fade-in grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-2xl sm:max-w-4xl md:max-w-7xl px-4 sm:px-6" style={{animationDelay: '1s'}}>
            {/* Research Articles */}
            <div className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-3xl text-center border border-white/25 hover:border-white/40 hover:from-white/20 hover:to-white/10 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              
              <h3 className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                {stats.loading ? formatNumber(animatedNumbers.articles) : formatNumber(stats.articles)}
              </h3>
              <p className="relative z-10 text-white/85 text-base sm:text-lg font-semibold">Research Articles</p>
            </div>
            
            {/* Digital Books */}
            <div className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-3xl text-center border border-white/25 hover:border-white/40 hover:from-white/20 hover:to-white/10 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              
              <h3 className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                {stats.loading ? formatNumber(animatedNumbers.books) : formatNumber(stats.books)}
              </h3>
              <p className="relative z-10 text-white/85 text-base sm:text-lg font-semibold">Digital Books</p>
            </div>
            
            {/* Academic Journals */}
            <div className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-3xl text-center border border-white/25 hover:border-white/40 hover:from-white/20 hover:to-white/10 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2H15" />
                </svg>
              </div>
              
              <h3 className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                {stats.loading ? formatNumber(animatedNumbers.journals) : formatNumber(stats.journals)}
              </h3>
              <p className="relative z-10 text-white/85 text-base sm:text-lg font-semibold">Academic Journals</p>
            </div>
            
            {/* Global Access */}
            <div className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-3xl text-center border border-white/25 hover:border-white/40 hover:from-white/20 hover:to-white/10 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                24/7
              </h3>
              <p className="relative z-10 text-white/85 text-base sm:text-lg font-semibold">Global Access</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}