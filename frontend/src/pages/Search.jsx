// src/pages/Search.jsx
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search() {
  const queryParams = useQuery();
  const [name, setName] = useState(queryParams.get("name") || "");
  const [team, setTeam] = useState(queryParams.get("team") || "");
  const [minValue, setMinValue] = useState(queryParams.get("minValue") || "");
  const [maxValue, setMaxValue] = useState(queryParams.get("maxValue") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("cards");
  const [showFilters, setShowFilters] = useState(true);

  // Fetch players when filters change
  useEffect(() => {
    if (name || team || minValue || maxValue) {
      fetchPlayers();
      setHasSearched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (team) params.append("team", team);
      if (minValue) params.append("minValue", minValue);
      if (maxValue) params.append("maxValue", maxValue);

      const res = await fetch(
        `http://localhost:5000/api/players?${params.toString()}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("❌ Error fetching players:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setName("");
    setTeam("");
    setMinValue("");
    setMaxValue("");
    setResults([]);
    setHasSearched(false);
  };

  const getPlayerPhoto = (player) => {
    const isPlaceholder = !player.photo || 
      player.photo.includes("via.placeholder.com") || 
      player.photo.trim() === "";
    
    return isPlaceholder 
      ? "https://placehold.co/100x100?text=No+Photo" 
      : player.photo;
  };

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "team":
        return (a.team || "").localeCompare(b.team || "");
      case "age":
        return (b.age || 0) - (a.age || 0);
      case "value":
        const aValue = a.predictions?.[0]?.value || 0;
        const bValue = b.predictions?.[0]?.value || 0;
        return bValue - aValue;
      default:
        return 0;
    }
  });

  const hasActiveFilters = name || team || minValue || maxValue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-purple-600 p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Advanced Search</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Find players with specific criteria</p>
            </div>
          </div>
        </div>

        {/* Toggle Filters Button (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full mb-4 bg-white p-3 rounded-xl shadow-md border border-gray-200 flex items-center justify-between"
        >
          <span className="font-medium text-gray-800">Search Filters</span>
          <svg 
            className={`w-5 h-5 text-gray-600 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Search Filters */}
        <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-8 transition-all duration-300 ${
          showFilters ? 'block' : 'hidden lg:block'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-blue-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg flex-shrink-0">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Search Filters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Name Filter */}
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Player Name</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter player name..."
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Team Filter */}
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Team</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="Enter team name..."
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Min Value Filter */}
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Min Value (€)</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  placeholder="Minimum value..."
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Max Value Filter */}
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Max Value (€)</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <input
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  placeholder="Maximum value..."
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={fetchPlayers}
              disabled={!hasActiveFilters || loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Apply Filters
                </>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:border-red-300 hover:text-red-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            {/* Results Header */}
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-green-100 p-1.5 sm:p-2 rounded-md sm:rounded-lg flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Search Results</h3>
                  <p className="text-sm sm:text-base text-gray-600">{results.length} player{results.length !== 1 ? 's' : ''} found</p>
                </div>
              </div>

              {results.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="team">Sort by Team</option>
                    <option value="age">Sort by Age</option>
                    <option value="value">Sort by Value</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`flex-1 sm:flex-none px-3 py-2 rounded-md transition ${
                        viewMode === "cards" 
                          ? "bg-white shadow text-blue-600" 
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex-1 sm:flex-none px-3 py-2 rounded-md transition ${
                        viewMode === "list" 
                          ? "bg-white shadow text-blue-600" 
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Results Content */}
            {loading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-base sm:text-lg text-gray-600">Searching players...</p>
              </div>
            ) : results.length > 0 ? (
              viewMode === "cards" ? (
                /* Card View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {sortedResults.map((player) => (
                    <div
                      key={player._id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group hover:scale-105"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <img
                          src={getPlayerPhoto(player)}
                          alt={player.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full border-2 border-white shadow-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{player.name}</h4>
                          <p className="text-gray-600 text-sm mb-2">{player.team || "Free Agent"}</p>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                              <span className="text-gray-500">Age:</span>
                              <span className="font-medium text-gray-700">{player.age || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                              <span className="text-gray-500">Value:</span>
                              <span className="font-bold text-green-600">
                                {player.predictions?.[0]?.value
                                  ? `€${player.predictions[0].value.toLocaleString()}`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                          
                          <Link
                            to={`/players/${player._id}`}
                            className="mt-3 sm:mt-4 w-full bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium text-center block"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-2 sm:space-y-3">
                  {sortedResults.map((player) => (
                    <div
                      key={player._id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <img
                          src={getPlayerPhoto(player)}
                          alt={player.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-gray-200 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">{player.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {player.team || "Free Agent"} • Age: {player.age || "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-gray-500">Latest Value</div>
                          <div className="font-bold text-green-600 text-sm">
                            {player.predictions?.[0]?.value
                              ? `€${player.predictions[0].value.toLocaleString()}`
                              : "N/A"}
                          </div>
                        </div>
                        <div className="sm:hidden text-right">
                          <div className="font-bold text-green-600 text-xs">
                            {player.predictions?.[0]?.value
                              ? `€${(player.predictions[0].value / 1000000).toFixed(1)}M`
                              : "N/A"}
                          </div>
                        </div>
                        <Link
                          to={`/players/${player._id}`}
                          className="bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* No Results */
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">No Players Found</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">Try adjusting your search criteria to find more players</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white py-2 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Initial State - No Search Performed */}
        {!hasSearched && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 text-center">
            <div className="text-blue-400 mb-4 sm:mb-6">
              <svg className="w-20 h-20 sm:w-32 sm:h-32 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Start Your Search</h3>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">Enter your search criteria above and click "Apply Filters" to find players</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 text-sm sm:text-base">By Name</h4>
                <p className="text-xs sm:text-sm text-gray-600">Search for specific players</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 text-sm sm:text-base">By Team</h4>
                <p className="text-xs sm:text-sm text-gray-600">Find players from specific teams</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 text-sm sm:text-base">By Value</h4>
                <p className="text-xs sm:text-sm text-gray-600">Filter by market value range</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;