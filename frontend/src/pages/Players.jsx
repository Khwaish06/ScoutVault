// src/pages/Players.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("cards"); // cards or table

  // Fetch all players
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/players");
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error("❌ Error fetching players:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Filter and sort players
  const filteredPlayers = players
    .filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.team && player.team.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
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

  const getPlayerPhoto = (player) => {
    const isPlaceholder = !player.photo || 
      player.photo.includes("via.placeholder.com") || 
      player.photo.trim() === "";
    
    return isPlaceholder 
      ? "https://placehold.co/100x100?text=No+Photo" 
      : player.photo;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg sm:text-xl text-gray-600">Loading players...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
            <div className="bg-blue-600 p-2 sm:p-3 rounded-xl">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Players</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              
              {/* Search Bar */}
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search players or teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="team">Sort by Team</option>
                  <option value="age">Sort by Age</option>
                  <option value="value">Sort by Value</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg sm:rounded-xl p-1 w-full sm:w-auto">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-md sm:rounded-lg transition text-sm sm:text-base ${
                      viewMode === "cards" 
                        ? "bg-white shadow text-blue-600" 
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="hidden sm:inline ml-2">Cards</span>
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-md sm:rounded-lg transition text-sm sm:text-base ${
                      viewMode === "table" 
                        ? "bg-white shadow text-blue-600" 
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="hidden sm:inline ml-2">Table</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Players Content */}
        {filteredPlayers.length > 0 ? (
          viewMode === "cards" ? (
            /* Card View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredPlayers.map((player) => (
                <div
                  key={player._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 sm:p-4">
                    <div className="flex justify-center">
                      <img
                        src={getPlayerPhoto(player)}
                        alt={player.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-2 sm:border-3 border-white shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6 -mt-2 sm:-mt-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate" title={player.name}>
                        {player.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 truncate" title={player.team || "Free Agent"}>
                        {player.team || "Free Agent"}
                      </p>
                    </div>

                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs sm:text-sm">Age</span>
                        <span className="font-semibold text-gray-700 text-sm sm:text-base">{player.age || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs sm:text-sm">Latest Value</span>
                        <span className="font-bold text-green-600 text-sm sm:text-base">
                          {player.predictions?.[0]?.value
                            ? `€${player.predictions[0].value.toLocaleString()}`
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/players/${player._id}`}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 px-4 text-sm sm:text-base rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-center block font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-left p-3 sm:p-6 font-semibold text-gray-700 text-sm sm:text-base">Player</th>
                      <th className="text-left p-3 sm:p-6 font-semibold text-gray-700 text-sm sm:text-base hidden sm:table-cell">Team</th>
                      <th className="text-left p-3 sm:p-6 font-semibold text-gray-700 text-sm sm:text-base hidden md:table-cell">Age</th>
                      <th className="text-left p-3 sm:p-6 font-semibold text-gray-700 text-sm sm:text-base">Value</th>
                      <th className="text-left p-3 sm:p-6 font-semibold text-gray-700 text-sm sm:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player, index) => (
                      <tr
                        key={player._id}
                        className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="p-3 sm:p-6">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <img
                              src={getPlayerPhoto(player)}
                              alt={player.name}
                              className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-gray-200 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-gray-800 text-sm sm:text-base truncate" title={player.name}>
                                {player.name}
                              </div>
                              <div className="text-xs sm:hidden text-gray-600 truncate" title={player.team || "Free Agent"}>
                                {player.team || "Free Agent"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 sm:p-6 text-gray-600 text-sm sm:text-base hidden sm:table-cell">
                          <div className="truncate" title={player.team || "Free Agent"}>
                            {player.team || "Free Agent"}
                          </div>
                        </td>
                        <td className="p-3 sm:p-6 text-gray-600 text-sm sm:text-base hidden md:table-cell">
                          {player.age || "N/A"}
                        </td>
                        <td className="p-3 sm:p-6">
                          <span className="font-bold text-green-600 text-sm sm:text-base">
                            {player.predictions?.[0]?.value
                              ? `€${player.predictions[0].value.toLocaleString()}`
                              : "N/A"}
                          </span>
                        </td>
                        <td className="p-3 sm:p-6">
                          <Link
                            to={`/players/${player._id}`}
                            className="bg-blue-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
                          >
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">View</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">No Players Found</h3>
            <p className="text-sm sm:text-base text-gray-500">
              {searchTerm ? "Try adjusting your search terms" : "No players available at the moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Players;