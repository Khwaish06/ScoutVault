// src/pages/Analytics.jsx
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ correct import

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

function Analytics() {
  const [players, setPlayers] = useState([]);
  const [teamFilter, setTeamFilter] = useState("All");
  const [ageRange, setAgeRange] = useState([15, 40]);
  const [valueRange, setValueRange] = useState([0, 200_000_000]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("https://scoutvault.onrender.com/api/players");
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error("❌ Error fetching players:", err);
      }
    };
    fetchPlayers();
  }, []);

  // 🔍 Apply filters
  const filteredPlayers = players.filter((p) => {
    const ageOk = p.age >= ageRange[0] && p.age <= ageRange[1];
    const value = p.predictions?.[0]?.value || 0;
    const valueOk = value >= valueRange[0] && value <= valueRange[1];
    const teamOk = teamFilter === "All" || p.team === teamFilter;
    return ageOk && valueOk && teamOk;
  });

  const teams = [...new Set(players.map((p) => p.team).filter(Boolean))].sort();

  // 📊 Data for charts
  const topPlayers = [...filteredPlayers]
    .filter((p) => p.predictions?.[0]?.value)
    .sort((a, b) => b.predictions[0].value - a.predictions[0].value)
    .slice(0, 10)
    .map((p) => ({ name: p.name, value: p.predictions[0].value }));

  const ageValueData = filteredPlayers
    .filter((p) => p.age && p.predictions?.[0]?.value)
    .map((p) => ({ x: p.age, y: p.predictions[0].value, name: p.name }));

  const teamAverages = Object.values(
    filteredPlayers.reduce((acc, p) => {
      if (p.team && p.predictions?.[0]?.value) {
        if (!acc[p.team]) acc[p.team] = { team: p.team, total: 0, count: 0 };
        acc[p.team].total += p.predictions[0].value;
        acc[p.team].count++;
      }
      return acc;
    }, {})
  )
    .map((t) => ({ team: t.team, avg: t.total / t.count }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10);

  const distribution = filteredPlayers
    .filter((p) => p.predictions?.[0]?.value)
    .reduce((acc, p) => {
      const bucket = Math.floor(p.predictions[0].value / 10_000_000) * 10;
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {});

  const distributionData = Object.entries(distribution).map(([range, count]) => ({
    range: `€${range}–${parseInt(range) + 10}M`,
    count,
  }));

  // Statistics for PDF
  const stats = {
    totalPlayers: filteredPlayers.length,
    avgValue: filteredPlayers.reduce((sum, p) => sum + (p.predictions?.[0]?.value || 0), 0) / (filteredPlayers.length || 1),
    avgAge: filteredPlayers.reduce((sum, p) => sum + (p.age || 0), 0) / (filteredPlayers.length || 1),
    totalTeams: teams.length,
    highestValue: Math.max(...filteredPlayers.map(p => p.predictions?.[0]?.value || 0)),
    lowestValue: Math.min(...filteredPlayers.filter(p => p.predictions?.[0]?.value).map(p => p.predictions[0].value))
  };

  // ⬇️ Export CSV
  const exportToCSV = () => {
    const headers = ["Name", "Team", "Age", "Value (€)"];
    const rows = filteredPlayers.map((p) => [
      p.name,
      p.team,
      p.age,
      p.predictions?.[0]?.value || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "filtered_players.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ⬇️ Export Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPlayers.map((p) => ({
        Name: p.name,
        Team: p.team,
        Age: p.age,
        Value: p.predictions?.[0]?.value || "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Players");
    XLSX.writeFile(workbook, "filtered_players.xlsx");
  };

  // 📸 Export Charts as PNG
  const exportChartsAsPNG = async () => {
    setIsExporting(true);
    const charts = document.querySelectorAll(".chart-card");
    
    for (let idx = 0; idx < charts.length; idx++) {
      const chart = charts[idx];
      try {
        const canvas = await html2canvas(chart, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: chart.scrollWidth,
          height: chart.scrollHeight
        });
        
        const link = document.createElement("a");
        link.download = `chart_${idx + 1}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error(`Error capturing chart ${idx + 1}:`, error);
      }
    }
    setIsExporting(false);
  };

  // 📄 Enhanced PDF Export - FIXED VERSION
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Initialize PDF with proper settings
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });
      
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Set up fonts
      pdf.setFont("helvetica");

      // ENHANCED HEADER DESIGN
      // Main gradient header
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, pageWidth, 35, "F");
      
      // Accent bar
      pdf.setFillColor(59, 130, 246); // blue-500
      pdf.rect(0, 35, pageWidth, 3, "F");
      
      // Soccer ball icon (simple circles)
      pdf.setFillColor(255, 255, 255);
      pdf.circle(25, 20, 8, "F");
      pdf.setFillColor(15, 23, 42);
      pdf.circle(25, 20, 6, "S");
      
      // Title
      pdf.setFontSize(26);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text("ScoutVault Analytics Report", 40, 18);
      
      // Subtitle with professional styling
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(200, 200, 200);
      const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      pdf.text(`Generated on ${currentDate}`, 40, 28);
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      
      let yPos = 55;
      
      // ENHANCED FILTER INFO SECTION
      pdf.setFillColor(248, 250, 252); // gray-50
      pdf.rect(margin, yPos, contentWidth, 30, "F");
      pdf.setDrawColor(226, 232, 240); // gray-200
      pdf.setLineWidth(0.5);
      pdf.rect(margin, yPos, contentWidth, 30, "S");
      
      // Filter section header
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(51, 65, 85); // slate-700
      pdf.text("Applied Filters", margin + 5, yPos + 10);
      
      // Filter details
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(71, 85, 105); // slate-600
      pdf.text(`Team: ${teamFilter}`, margin + 5, yPos + 18);
      pdf.text(`Age Range: ${ageRange[0]} - ${ageRange[1]} years`, margin + 60, yPos + 18);
      pdf.text(`Value Range: €${(valueRange[0]/1000000).toFixed(1)}M - €${(valueRange[1]/1000000).toFixed(1)}M`, margin + 5, yPos + 25);
      
      yPos += 40;
      
      // ENHANCED SUMMARY STATISTICS
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text("Executive Summary", margin, yPos);
      yPos += 10;
      
      // Create enhanced stats table
      const summaryData = [
        ["Total Players Analyzed", stats.totalPlayers.toLocaleString()],
        ["Average Player Value", `€${(stats.avgValue / 1_000_000).toFixed(2)}M`],
        ["Average Player Age", `${stats.avgAge.toFixed(1)} years`],
        ["Teams Represented", stats.totalTeams.toString()],
        ["Highest Player Value", `€${(stats.highestValue / 1_000_000).toFixed(2)}M`],
        ["Most Affordable Player", `€${(stats.lowestValue / 1_000_000).toFixed(2)}M`]
      ];

      autoTable(pdf, {
        startY: yPos,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "grid",
        headStyles: {
          fillColor: [59, 130, 246], // blue-500
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 11,
          cellPadding: 4
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 4,
          textColor: [51, 65, 85] // slate-700
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // gray-50
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 70 },
          1: { cellWidth: 50, halign: "right" }
        },
        tableWidth: contentWidth * 0.7,
        margin: { left: margin },
        didDrawPage: (data) => {
          // Add border around the table
          pdf.setDrawColor(226, 232, 240);
          pdf.setLineWidth(1);
        }
      });

      // NEW PAGE FOR CHARTS
      pdf.addPage();
      yPos = margin;
      
      // Charts section header with enhanced styling
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text("Data Visualizations & Insights", margin, yPos);
      
      // Add decorative line
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(2);
      pdf.line(margin, yPos + 3, margin + 80, yPos + 3);
      
      yPos += 20;
      
      // Chart descriptions
      const chartDescriptions = [
        "This chart showcases the top 10 most valuable players based on current market predictions.",
        "Scatter plot revealing the relationship between player age and market value.",
        "Average team valuations highlighting the most valuable squads in our dataset.",
        "Distribution analysis showing how player values are spread across different ranges."
      ];
      
      // Capture and add charts with enhanced quality
      const charts = document.querySelectorAll(".chart-card");
      const chartTitles = [
        "Top 10 Most Valuable Players",
        "Age vs Value Distribution", 
        "Top 10 Teams by Average Value",
        "Value Distribution Analysis"
      ];
      
      for (let i = 0; i < Math.min(charts.length, 4); i++) {
        const chart = charts[i];
        
        try {
          // Check if we need a new page
          if (yPos + 100 > pageHeight - margin) {
            pdf.addPage();
            yPos = margin;
          }
          
          // Chart title with enhanced styling
          pdf.setFontSize(13);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(30, 58, 138); // blue-900
          pdf.text(`${i + 1}. ${chartTitles[i]}`, margin, yPos);
          
          // Chart description
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(71, 85, 105);
          const description = pdf.splitTextToSize(chartDescriptions[i], contentWidth);
          pdf.text(description, margin, yPos + 8);
          yPos += 18;
          
          // Capture chart with high quality
          const canvas = await html2canvas(chart, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: chart.scrollWidth,
            height: chart.scrollHeight,
            onclone: (clonedDoc) => {
              const clonedChart = clonedDoc.querySelector('.chart-card');
              if (clonedChart) {
                clonedChart.style.boxShadow = 'none';
                clonedChart.style.border = '1px solid #e5e7eb';
                clonedChart.style.borderRadius = '8px';
              }
            }
          });
          
          const imgData = canvas.toDataURL("image/png", 1.0);
          const imgWidth = contentWidth - 10;
          const imgHeight = Math.min((canvas.height * imgWidth) / canvas.width, 100);
          
          // Add subtle border around chart
          pdf.setDrawColor(226, 232, 240);
          pdf.setLineWidth(0.5);
          pdf.rect(margin + 2, yPos, imgWidth - 4, imgHeight, "S");
          
          // Add chart image
          pdf.addImage(imgData, "PNG", margin + 5, yPos + 2, imgWidth - 10, imgHeight - 4);
          yPos += imgHeight + 15;
          
        } catch (error) {
          console.error(`Error adding chart ${i + 1} to PDF:`, error);
          pdf.setFontSize(10);
          pdf.setTextColor(239, 68, 68); // red-500
          pdf.text(`[Chart could not be rendered - please check console for details]`, margin, yPos);
          yPos += 15;
        }
      }

      // ENHANCED PLAYER DATA TABLE
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text("Detailed Player Data", margin, margin);
      
      // Add subtitle
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(71, 85, 105);
      pdf.text(`Showing top ${Math.min(50, filteredPlayers.length)} players from filtered dataset`, margin, margin + 8);

      autoTable(pdf, {
        startY: margin + 15,
        head: [["#", "Player Name", "Team", "Age", "Market Value"]],
        body: filteredPlayers
          .sort((a, b) => (b.predictions?.[0]?.value || 0) - (a.predictions?.[0]?.value || 0))
          .slice(0, 50)
          .map((p, i) => [
            (i + 1).toString(),
            p.name || "Unknown",
            p.team || "Free Agent",
            p.age ? p.age.toString() : "N/A",
            p.predictions?.[0]?.value
              ? `€${(p.predictions[0].value / 1_000_000).toFixed(2)}M`
              : "Not Available",
          ]),
        theme: "striped",
        headStyles: {
          fillColor: [30, 58, 138], // blue-900
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 10,
          cellPadding: 3
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 2.5,
          textColor: [51, 65, 85]
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center", fontStyle: "bold" },
          1: { cellWidth: 45, fontStyle: "bold" },
          2: { cellWidth: 35 },
          3: { cellWidth: 15, halign: "center" },
          4: { cellWidth: 28, halign: "right", fontStyle: "bold" }
        },
        margin: { left: margin, right: margin },
        didDrawCell: (data) => {
          // Highlight high-value players
          if (data.column.index === 4 && data.cell.raw && typeof data.cell.raw === 'string') {
            const value = parseFloat(data.cell.raw.replace('€', '').replace('M', ''));
            if (value > 50) {
              data.cell.styles.textColor = [220, 38, 127]; // pink-600
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });

      // ENHANCED FOOTER
      const totalPages = pdf.internal.pages.length - 1;
      const reportId = `TIQ-${Date.now().toString().slice(-6)}`;
      
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Footer background
        pdf.setFillColor(248, 250, 252);
        pdf.rect(0, pageHeight - 15, pageWidth, 15, "F");
        
        // Footer content
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128); // gray-500
        pdf.text(
          ` ScoutVault Analytics Report | Report ID: ${reportId}`,
          margin,
          pageHeight - 6
        );
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin - 20,
          pageHeight - 6
        );
        
        // Add generation timestamp
        if (i === totalPages) {
          pdf.text(
            `Generated: ${new Date().toLocaleString()}`,
            pageWidth / 2 - 25,
            pageHeight - 6
          );
        }
      }

      // Save with enhanced filename
      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `ScoutVault_Analytics_Report_${timestamp}_${reportId}.pdf`;
      
      pdf.save(fileName);
      
      // Success notification could be added here
      console.log("✅ PDF exported successfully:", fileName);
      
    } catch (err) {
      console.error("❌ Error generating PDF:", err);
      alert("Failed to generate PDF report. Please try again or check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Comprehensive football player analytics and insights
          </p>
        </div>

        {/* Filters Section - Enhanced Mobile Responsiveness */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filters</h3>
          
          {/* Mobile-first filter layout */}
          <div className="space-y-4 sm:space-y-0">
            {/* Team Filter - Full width on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-fit">Team:</span>
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              >
                <option value="All">All Teams</option>
                {teams.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Age Range - Stacked on mobile, inline on larger screens */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-fit">Age:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={ageRange[0]}
                  onChange={(e) => setAgeRange([+e.target.value, ageRange[1]])}
                  placeholder="Min"
                  className="px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 w-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={ageRange[1]}
                  onChange={(e) => setAgeRange([ageRange[0], +e.target.value])}
                  placeholder="Max"
                  className="px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 w-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Value Range - Stacked on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-medium text-gray-700 min-w-fit">Value (€):</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={valueRange[0]}
                  onChange={(e) => setValueRange([+e.target.value, valueRange[1]])}
                  placeholder="Min"
                  className="px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 w-full sm:w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                />
                <span className="text-gray-400 hidden sm:inline">-</span>
                <input
                  type="number"
                  value={valueRange[1]}
                  onChange={(e) => setValueRange([valueRange[0], +e.target.value])}
                  placeholder="Max"
                  className="px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 w-full sm:w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span>Showing <span className="font-semibold text-blue-700">{filteredPlayers.length}</span> players</span>
                {stats.totalPlayers > 0 && (
                  <span className="text-xs sm:text-sm">
                    Avg Value: <span className="font-semibold text-blue-700">€{(stats.avgValue/1000000).toFixed(2)}M</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Export Actions - Mobile Responsive */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📤 Export Data</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={exportToCSV}
              disabled={isExporting}
              className="px-4 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-medium text-sm"
            >
              📄 Export CSV
            </button>
            <button
              onClick={exportToExcel}
              disabled={isExporting}
              className="px-4 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-medium text-sm"
            >
              📊 Export Excel
            </button>
            <button
              onClick={exportChartsAsPNG}
              disabled={isExporting}
              className="px-4 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-medium text-sm"
            >
              {isExporting ? "📸 Exporting..." : "📸 Charts"}
            </button>
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="px-4 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-medium text-sm"
            >
              {isExporting ? "📄 Creating..." : "📄 PDF Report"}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-3">
            Export your filtered data and visualizations in various formats
          </p>
        </div>

        {/* Charts Grid - Fully Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Top Players Chart */}
          <div className="chart-card bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">
              💎 Top 10 Most Valuable Players
            </h3>
            <div className="h-64 sm:h-80 lg:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={topPlayers} 
                  margin={{ 
                    top: 20, 
                    right: 10, 
                    left: 10, 
                    bottom: window.innerWidth < 640 ? 80 : 60 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0}
                    height={window.innerWidth < 640 ? 100 : 80}
                    fontSize={window.innerWidth < 640 ? 9 : 11}
                  />
                  <YAxis 
                    tickFormatter={(v) => `€${(v / 1_000_000).toFixed(1)}M`} 
                    fontSize={window.innerWidth < 640 ? 9 : 11} 
                  />
                  <Tooltip
                    formatter={(val) => [`€${val.toLocaleString()}`, "Value"]}
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      fontSize: window.innerWidth < 640 ? "12px" : "14px"
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Age vs Value Chart */}
          <div className="chart-card bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">
              📈 Age vs Value Distribution
            </h3>
            <div className="h-64 sm:h-80 lg:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ 
                  top: 20, 
                  right: window.innerWidth < 640 ? 10 : 30, 
                  left: window.innerWidth < 640 ? 10 : 20, 
                  bottom: 20 
                }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Age" 
                    fontSize={window.innerWidth < 640 ? 9 : 11} 
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Value"
                    tickFormatter={(v) => `€${(v / 1_000_000).toFixed(0)}M`}
                    fontSize={window.innerWidth < 640 ? 9 : 11}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(val, name) =>
                      name === "y" ? `€${val.toLocaleString()}` : val
                    }
                    labelFormatter={(label, payload) =>
                      payload?.[0]?.payload?.name || "Player"
                    }
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      fontSize: window.innerWidth < 640 ? "12px" : "14px"
                    }}
                  />
                  <Scatter data={ageValueData} fill="#10b981" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team Averages Chart */}
          <div className="chart-card bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">
              🏟️ Top 10 Teams by Avg Value
            </h3>
            <div className="h-64 sm:h-80 lg:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={teamAverages} 
                  margin={{ 
                    top: 20, 
                    right: 10, 
                    left: 10, 
                    bottom: window.innerWidth < 640 ? 80 : 60 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="team" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0}
                    height={window.innerWidth < 640 ? 100 : 80}
                    fontSize={window.innerWidth < 640 ? 9 : 11}
                  />
                  <YAxis 
                    tickFormatter={(v) => `€${(v / 1_000_000).toFixed(1)}M`} 
                    fontSize={window.innerWidth < 640 ? 9 : 11} 
                  />
                  <Tooltip
                    formatter={(val) => [`€${val.toLocaleString()}`, "Avg Value"]}
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      fontSize: window.innerWidth < 640 ? "12px" : "14px"
                    }}
                  />
                  <Bar dataKey="avg" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Value Distribution Chart */}
          <div className="chart-card bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">
              📊 Value Distribution (10M Ranges)
            </h3>
            <div className="h-64 sm:h-80 lg:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={distributionData} 
                  margin={{ 
                    top: 20, 
                    right: 10, 
                    left: 10, 
                    bottom: 20 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="range" 
                    fontSize={window.innerWidth < 640 ? 9 : 11}
                    angle={window.innerWidth < 640 ? -45 : 0}
                    textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                  />
                  <YAxis fontSize={window.innerWidth < 640 ? 9 : 11} />
                  <Tooltip
                    formatter={(val) => [`${val} players`, "Count"]}
                    contentStyle={{ 
                      backgroundColor: "#ffffff", 
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      fontSize: window.innerWidth < 640 ? "12px" : "14px"
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Mobile-Friendly Stats Cards - Only show on mobile for quick overview */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
              <div className="text-2xl font-bold">{stats.totalPlayers}</div>
              <div className="text-sm opacity-90">Total Players</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white">
              <div className="text-2xl font-bold">€{(stats.avgValue/1000000).toFixed(1)}M</div>
              <div className="text-sm opacity-90">Avg Value</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="text-2xl font-bold">{stats.avgAge.toFixed(1)}</div>
              <div className="text-sm opacity-90">Avg Age</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-white">
              <div className="text-2xl font-bold">{stats.totalTeams}</div>
              <div className="text-sm opacity-90">Teams</div>
            </div>
          </div>
        </div>

        {/* Footer for mobile */}
        <div className="text-center text-xs text-gray-500 pb-4">
          <p>ScoutVault Analytics Dashboard</p>
          <p>Best viewed on desktop for full experience</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;