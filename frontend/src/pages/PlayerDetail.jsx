// src/pages/PlayerDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function PlayerDetails() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://scoutvault.onrender.com/api/players/${id}`);
        const data = await res.json();
        setPlayer(data);
      } catch (err) {
        console.error("❌ Error fetching player details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-700 mt-6">Loading player details...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Player Not Found</h2>
          <p className="text-gray-600 mb-8">The player you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/players"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Players
          </Link>
        </div>
      </div>
    );
  }

  // Handle photo: use DB photo if valid, else fallback
  const isPlaceholder =
    !player.photo ||
    player.photo.includes("via.placeholder.com") ||
    player.photo.trim() === "";

  const photoUrl = isPlaceholder
    ? "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face"
    : player.photo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Enhanced Back Button */}
        <Link
          to="/players"
          className="inline-flex items-center gap-3 mb-8 sm:mb-12 text-gray-600 hover:text-blue-600 transition-all duration-200 group bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/80 hover:shadow-md"
        >
          <div className="p-1 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors">
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="font-semibold text-sm sm:text-base">Back to Players</span>
        </Link>

        {/* Enhanced Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden mb-8 sm:mb-12 hover:shadow-3xl transition-all duration-500 border border-white/20">
          {/* Dynamic Header with Pattern */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-24 sm:h-32 lg:h-40 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-6 -translate-y-8"></div>
            {/* Animated background elements */}
            <div className="absolute top-4 right-8 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-4 left-12 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse delay-700"></div>
          </div>
          
          <div className="relative px-6 sm:px-8 lg:px-12 pb-8 sm:pb-12">
            {/* Enhanced Player Photo */}
            <div className="flex justify-center -mt-12 sm:-mt-16 lg:-mt-20 mb-6 sm:mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
                <img
                  src={photoUrl}
                  alt={player.name}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-full border-4 sm:border-6 border-white shadow-2xl ring-4 ring-blue-100/50 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face";
                  }}
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Enhanced Player Info */}
            <div className="text-center space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                {player.name}
              </h1>
              
              {/* Enhanced Player Details Cards */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 max-w-2xl mx-auto">
                <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-gray-500 font-medium">Team</p>
                      <p className="text-lg font-bold text-gray-800">{player.team || "Free Agent"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6 border border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 1.5V10a1 1 0 01-1-1V9a1 1 0 011-1h2a1 1 0 011 1v0a1 1 0 01-1 1V10a1 1 0 01-1-1.5z" />
                      </svg>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-gray-500 font-medium">Age</p>
                      <p className="text-lg font-bold text-gray-800">{player.age || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats and Predictions Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Enhanced Stats Card */}
          {player.stats && (
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 hover:shadow-3xl transition-all duration-500 border border-white/20 group">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Player Statistics</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Performance metrics and data</p>
                </div>
              </div>

              {/* Enhanced Responsive Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {Object.entries(player.stats).map(([key, value], index) => (
                  <div
                    key={key}
                    className="group/stat relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 p-5 sm:p-6 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <p className="text-xs sm:text-sm text-gray-500 capitalize font-semibold mb-2 tracking-wide">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover/stat:text-blue-600 transition-colors">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Predictions Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 hover:shadow-3xl transition-all duration-500 border border-white/20 group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Market Predictions</h3>
                <p className="text-gray-600 text-sm sm:text-base">Future value forecasts</p>
              </div>
            </div>

            {player.predictions?.length > 0 ? (
              <div className="space-y-4 max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar">
                {player.predictions.map((p, idx) => (
                  <div
                    key={idx}
                    className="group/prediction relative bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 p-5 sm:p-6 rounded-2xl border border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover/prediction:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex-shrink-0 shadow-sm"></div>
                        <span className="text-sm sm:text-base text-gray-700 font-semibold">
                          {new Date(p.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold text-green-600 group-hover/prediction:text-green-700">
                          €{p.value.toLocaleString()}
                        </span>
                        <svg className="w-4 h-4 text-green-500 opacity-0 group-hover/prediction:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="relative mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent h-px top-1/2 -translate-y-1/2"></div>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-700 mb-3">No Predictions Available</h4>
                <p className="text-gray-500 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                  Market forecasts will appear here once our analysis is complete. Check back soon for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }
      `}</style>
    </div>
  );
}

export default PlayerDetails;