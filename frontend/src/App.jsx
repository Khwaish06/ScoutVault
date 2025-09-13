// src/App.jsx
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Players from "./pages/Players.jsx";
import Search from "./pages/Search.jsx";
import PlayerDetails from "./pages/PlayerDetail.jsx";
import Analytics from "./pages/Analytics.jsx";
import Game from "./pages/Game.jsx";

function Dashboard() {
  const navigate = useNavigate();

  // Mock data for dashboard stats
  const dashboardStats = {
    totalPlayers: 2847,
    avgMarketValue: 12.5,
    topTransfers: 156,
    activeScouts: 23,
  };

  const recentActivity = [
    { player: "Kylian Mbappé", team: "PSG", value: "€180M", action: "Transfer Listed", time: "2 hours ago" },
    { player: "Erling Haaland", team: "Man City", value: "€175M", action: "Value Updated", time: "4 hours ago" },
    { player: "Vinicius Jr.", team: "Real Madrid", value: "€120M", action: "New Scout Report", time: "6 hours ago" },
    { player: "Jude Bellingham", team: "Real Madrid", value: "€110M", action: "Performance Analysis", time: "8 hours ago" }
  ];

  const quickActions = [
    { title: "View All Players", icon: "👥", route: "/players", color: "bg-blue-500" },
    { title: "Analytics Dashboard", icon: "📈", route: "/analytics", color: "bg-green-500" },
    { title: "Advanced Search", icon: "🔍", route: "/search", color: "bg-purple-500" },
    { title: "Penalty Game", icon: "⚽", route: "/game", color: "bg-orange-500" }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">🏠 Dashboard</h1>
        <div className="text-xs sm:text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Players</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{dashboardStats.totalPlayers.toLocaleString()}</p>
            </div>
            <div className="text-2xl sm:text-3xl text-blue-500">👥</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Avg Market Value</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">€{dashboardStats.avgMarketValue}M</p>
            </div>
            <div className="text-2xl sm:text-3xl text-green-500">💰</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Top Transfers</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{dashboardStats.topTransfers}</p>
            </div>
            <div className="text-2xl sm:text-3xl text-purple-500">🔄</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Active Scouts</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{dashboardStats.activeScouts}</p>
            </div>
            <div className="text-2xl sm:text-3xl text-orange-500">🕵️</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.route)}
              className={`${action.color} text-white p-3 sm:p-4 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105`}
            >
              <div className="text-lg sm:text-2xl mb-1 sm:mb-2">{action.icon}</div>
              <div className="font-medium text-xs sm:text-sm leading-tight">{action.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            📈 Recent Activity
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-gray-500">Live feed</span>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="group relative overflow-hidden p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                      {activity.player.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-800 text-sm sm:text-lg group-hover:text-blue-600 transition-colors truncate">{activity.player}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm text-gray-600">{activity.team}</p>
                      <div className="w-1 h-1 bg-gray-400 rounded-full hidden sm:block"></div>
                      <p className="text-xs sm:text-sm font-semibold text-green-600">{activity.value}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                    <span className="hidden sm:inline">{activity.action}</span>
                    <span className="sm:hidden">{activity.action.split(' ')[0]}</span>
                  </div>
                  <p className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 sm:mt-6 text-center">
          <button 
            onClick={() => navigate('/players')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg text-sm sm:text-base"
          >
            View All Activity 
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">⚡ Quick Stats</h2>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm sm:text-base">Premier League Players</span>
            <span className="font-bold text-sm sm:text-base">487</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm sm:text-base">La Liga Players</span>
            <span className="font-bold text-sm sm:text-base">423</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm sm:text-base">Serie A Players</span>
            <span className="font-bold text-sm sm:text-base">391</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm sm:text-base">Bundesliga Players</span>
            <span className="font-bold text-sm sm:text-base">356</span>
          </div>
          <div className="flex justify-between items-center border-t pt-2 sm:pt-3">
            <span className="text-gray-800 font-medium text-sm sm:text-base">Total Market Value</span>
            <span className="font-bold text-base sm:text-lg">€35.6B</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Layout() {
  const [open, setOpen] = useState(false); // Default closed on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setOpen(false); // Auto-close sidebar on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when clicking outside
  const handleOverlayClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      {/* Mobile Overlay */}
      {open && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${open ? "w-64" : isMobile ? "w-0" : "w-64"} 
          ${isMobile ? "fixed" : "relative"}
          ${isMobile ? "z-50" : "z-10"}
          bg-gray-900 text-white flex flex-col transition-all duration-300 
          ${isMobile && !open ? "-translate-x-full" : "translate-x-0"}
          h-full overflow-hidden
        `}
      >
        <div className="flex items-center justify-between p-4 flex-shrink-0">
          <h1 className={`text-xl sm:text-2xl font-bold transition-opacity duration-300 ${!open && isMobile ? "opacity-0" : "opacity-100"}`}>
            ⚽ ScoutVault
          </h1>
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            {open ? "⬅" : "➡"}
          </button>
        </div>

        <nav className="flex flex-col gap-2 mt-6 px-4 overflow-y-auto">
          <Link 
            to="/" 
            className="hover:bg-gray-700 p-3 rounded transition-colors flex items-center gap-3"
            onClick={() => isMobile && setOpen(false)}
          >
            <span className="text-lg flex-shrink-0">📊</span>
            <span className="transition-all duration-300">
              Dashboard
            </span>
          </Link>
          <Link 
            to="/players" 
            className="hover:bg-gray-700 p-3 rounded transition-colors flex items-center gap-3"
            onClick={() => isMobile && setOpen(false)}
          >
            <span className="text-lg flex-shrink-0">👥</span>
            <span className="transition-all duration-300">
              Players
            </span>
          </Link>
          <Link 
            to="/analytics" 
            className="hover:bg-gray-700 p-3 rounded transition-colors flex items-center gap-3"
            onClick={() => isMobile && setOpen(false)}
          >
            <span className="text-lg flex-shrink-0">📈</span>
            <span className="transition-all duration-300">
              Analytics
            </span>
          </Link>
          <Link 
            to="/search" 
            className="hover:bg-gray-700 p-3 rounded transition-colors flex items-center gap-3"
            onClick={() => isMobile && setOpen(false)}
          >
            <span className="text-lg flex-shrink-0">🔍</span>
            <span className="transition-all duration-300">
              Search
            </span>
          </Link>
          <Link 
            to="/game" 
            className="hover:bg-gray-700 p-3 rounded transition-colors flex items-center gap-3"
            onClick={() => isMobile && setOpen(false)}
          >
            <span className="text-lg flex-shrink-0">⚽</span>
            <span className="transition-all duration-300">
              Penalty Game
            </span>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-600 hover:text-gray-800 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-800">⚽ TransferIQ</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="h-full overflow-y-auto">
          <div className="p-3 sm:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/players" element={<Players />} />
              <Route path="/players/:id" element={<PlayerDetails />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/search" element={<Search />} />
              <Route path="/game" element={<Game />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}