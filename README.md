# ScoutVault ⚽

**AI-Powered Football Player Transfer Value Prediction & Analytics Platform**

ScoutVault is a comprehensive web application that leverages machine learning to predict football player transfer values using FIFA dataset analysis. The platform combines advanced data science techniques with an intuitive web interface to provide actionable insights for football analytics.

## 🚀 Key Features

### Machine Learning Pipeline
- **Advanced ML Models**: Random Forest, Ridge Regression, and Gradient Boosting algorithms
- **High Accuracy**: Achieves 98% prediction accuracy on FIFA player datasets
- **Robust Data Processing**: Handles missing values, outliers, and data validation
- **Log Transformation**: Implements safe logarithmic scaling for better prediction performance

### Player Management System
- **Player Directory**: Complete player database with profile photos and team information
- **Individual Player Profiles**: Detailed player pages with comprehensive statistics
- **Advanced Search**: Multi-criteria search with name, team, and value range filters
- **Responsive Views**: Card and table view modes optimized for all devices

### Interactive Gaming
- **Penalty Shootout Game**: Extreme challenge mode with dynamic conditions
- **Advanced AI Goalkeeper**: Smart AI that learns shooting patterns and adapts
- **Dynamic Weather System**: Rain, wind, and pressure effects that impact gameplay
- **Multiple Difficulty Levels**: Easy, Medium, and Hard modes with varying success rates
- **Performance Tracking**: Score tracking, streaks, and high score persistence

### Analytics Dashboard
- **Interactive Visualizations**: Dynamic charts showing player values, age distributions, and team analytics
- **Advanced Filtering**: Filter by team, age range, and value range with real-time updates
- **Comprehensive Statistics**: Player averages, team comparisons, and value distribution analysis
- **Export Capabilities**: Multiple export formats (CSV, Excel, PNG charts, PDF reports)

### Web Application
- **Responsive Design**: Mobile-first approach with full desktop optimization
- **Real-time Predictions**: Live player value predictions using trained ML models
- **Professional UI**: Modern interface with enhanced user experience
- **Data Visualization**: Interactive charts using Recharts library

## 🛠 Tech Stack

### Backend
- **Python**: Core machine learning and data processing
- **Scikit-learn**: ML algorithms implementation
- **Pandas & NumPy**: Data manipulation and analysis
- **Joblib**: Model serialization and deployment
- **Matplotlib**: Statistical visualizations
- **REST API**: Express/Node.js backend with MongoDB integration

### Frontend
- **React**: Modern UI framework with hooks (useState, useEffect)
- **React Router**: Client-side routing for navigation
- **JavaScript ES6+**: Advanced frontend functionality
- **Recharts**: Interactive data visualization library
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Modern icon library
- **Export Libraries**: XLSX, jsPDF, html2canvas for data export

### Data Processing
- **FIFA Player Dataset**: Comprehensive player statistics and attributes
- **Feature Engineering**: Age, overall rating, potential, physical attributes
- **Data Validation**: Robust cleaning and preprocessing pipeline
- **Predictions Storage**: JSON-based prediction results
- **MongoDB**: Player data storage and management

## 🎮 Game Features

### Penalty Shootout Challenge
- **Dynamic Conditions**: Weather effects, wind, and pressure systems
- **Smart AI Goalkeeper**: Learns player patterns and adjusts difficulty
- **Power System**: Precise power control with optimal sweet spots (68-78%)
- **Time Pressure**: Optional countdown timers in hard mode
- **Realistic Physics**: Ball curve, wind effects, and goalkeeper reflexes

### Game Mechanics
- **Pattern Recognition**: AI tracks shooting history and adapts
- **Weather Effects**: Rain impacts ball control, wind affects trajectory
- **Goalkeeper Intelligence**: Multiple AI states (excellent, normal, poor form)
- **Pressure System**: Crowd pressure increases with attempts
- **Scoring System**: Streak tracking with performance analytics

### Difficulty Modes
```
Easy Mode: 25-45% success rate - Basic conditions
Medium Mode: 15-35% success rate - All weather effects active
Hard Mode: 10-25% success rate - Extreme conditions with time limits
```

## 📊 Machine Learning Model

### Model Performance
```
✅ Model Accuracy: 98%
✅ R² Score: 0.95+
✅ Mean Absolute Error: €2.1M average
✅ Robust Validation: Cross-validation with train/test split
```

### Key Features Used
- Player age and potential
- Overall FIFA rating
- Physical attributes (pace, shooting, passing, dribbling, defending, physic)
- Height and weight measurements
- Position-specific skills

### Data Pipeline
1. **Data Loading**: FIFA player dataset processing
2. **Cleaning**: Remove invalid values, handle missing data
3. **Feature Selection**: Essential player attributes
4. **Transformation**: Log scaling for value predictions
5. **Model Training**: Multiple algorithm comparison
6. **Validation**: Performance metrics and error analysis
7. **Deployment**: Model serialization for web application

## 🎯 Analytics Features

### Interactive Dashboard
- **Top Players Analysis**: Most valuable players visualization
- **Age vs Value**: Scatter plot showing age-value relationships
- **Team Comparisons**: Average team values and rankings
- **Distribution Analysis**: Value range distributions and patterns

### Player Management
- **Comprehensive Profiles**: Individual player pages with detailed statistics
- **Photo Management**: Automatic fallback system for player images
- **Team Organization**: Players grouped by team affiliations
- **Value Tracking**: Historical prediction data and trends

### Search & Filtering
- **Multi-criteria Search**: Name, team, and value range filters
- **Real-time Results**: Instant search with loading states
- **Sorting Options**: Sort by name, team, age, or market value
- **View Modes**: Toggle between card and list/table views
- **Responsive Design**: Optimized for mobile and desktop

### Export Capabilities
- **CSV Export**: Raw filtered player data
- **Excel Export**: Formatted spreadsheets with calculations
- **PNG Charts**: High-resolution chart exports
- **PDF Reports**: Professional analytics reports with:
  - Executive summaries
  - Statistical insights
  - Visual charts
  - Detailed player tables
  - Professional formatting

### Advanced Filtering
- Team-based filtering
- Age range selection
- Value range customization
- Real-time statistics updates
- Mobile-responsive controls

## 🚀 Getting Started

### Prerequisites
```bash
# Python requirements
pandas>=1.3.0
scikit-learn>=1.0.0
numpy>=1.21.0
matplotlib>=3.4.0
joblib>=1.1.0

# Node.js requirements
react>=18.0.0
react-router-dom>=6.0.0
recharts>=2.5.0
tailwindcss>=3.0.0
lucide-react>=0.263.1
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Khwaish06/ScoutVault.git
cd ScoutVault
```

2. **Set up Python environment**
```bash
pip install -r requirements.txt
```

3. **Install frontend dependencies**
```bash
npm install
```

4. **Run the machine learning pipeline**
```bash
python transfer_model_diagnostic.py
```

5. **Start the development server**
```bash
npm start
```

## 📁 Project Structure

```
ScoutVault/
├── src/
│   ├── pages/
│   │   ├── Analytics.jsx          # Main analytics dashboard
│   │   ├── Players.jsx            # Player directory with search/filter
│   │   ├── PlayerDetails.jsx      # Individual player profile pages
│   │   ├── Search.jsx             # Advanced search interface
│   │   └── Game.jsx              # Penalty shootout game
│   ├── components/                # Reusable React components
│   └── utils/                     # Utility functions
├── transferiq-backend/
│   ├── controllers/               # API route controllers
│   ├── models/                    # Database models and schemas
│   ├── routes/                    # Express route definitions
│   ├── node_modules/              # Node.js dependencies
│   ├── .gitignore                 # Git ignore rules
│   ├── LICENSE                    # Project license
│   └── README.md                  # Backend documentation
├── transfer_model_diagnostic.py   # ML pipeline
├── transfer_rf.pkl               # Trained Random Forest model
├── transfer_scaler.pkl           # Feature scaler
└── README.md
```

## 🔬 Model Training Process

### Data Preprocessing
- **Target Variable Cleaning**: Remove null/negative values
- **Outlier Handling**: Remove extreme values (>99th percentile)
- **Feature Selection**: Essential FIFA attributes
- **Safe Transformations**: Log scaling with validation
- **Final Validation**: Comprehensive data quality checks

### Model Selection
```python
models = {
    'RandomForest': RandomForestRegressor(n_estimators=50, max_depth=8),
    'Ridge': Ridge(alpha=1.0),
    'GradientBoosting': GradientBoostingRegressor(n_estimators=50)
}
```

### Performance Metrics
- **R² Score**: Model explanation variance
- **MAE**: Mean Absolute Error in euros
- **RMSE**: Root Mean Square Error
- **MAPE**: Mean Absolute Percentage Error

## 📱 User Interface Features

### Responsive Design
- Mobile-first approach with touch-friendly controls
- Desktop-optimized layouts for detailed analysis
- Progressive enhancement for different screen sizes
- Adaptive navigation and component layouts

### Component Architecture
- **Players.jsx**: Main player directory with card/table views
- **PlayerDetails.jsx**: Individual player profiles with enhanced UI
- **Search.jsx**: Advanced filtering with real-time results
- **Game.jsx**: Interactive penalty shootout with AI challenges

### Interactive Elements
- Real-time chart updates based on filters
- Hover effects and detailed tooltips
- Smooth animations and transitions
- Loading states for better user feedback
- Dynamic view mode switching

### State Management
- React hooks (useState, useEffect) for component state
- URL parameter handling for search queries
- Local state for game progress and scores
- Responsive loading and error states

## 📈 Analytics Insights

The platform provides comprehensive insights including:

- **Player Valuation Trends**: Market value patterns across age groups
- **Team Analysis**: Squad value comparisons and team rankings
- **Market Distribution**: Value range analysis and player concentration
- **Prediction Accuracy**: Model confidence and error margins
- **Search Analytics**: Advanced filtering and sorting capabilities

## 🎨 UI/UX Features

### Enhanced Visual Design
- Gradient backgrounds and modern card layouts
- Professional color schemes with proper contrast
- Consistent spacing and typography
- Interactive hover states and animations

### Navigation & Routing
- React Router for seamless page transitions
- Breadcrumb navigation and back buttons
- URL-based search parameter handling
- Mobile-responsive navigation menus

### Performance Optimization
- Efficient data processing and filtering
- Optimized image loading with fallbacks
- Responsive container sizing
- Memory management and cleanup

## 🚀 Live Demo

**🌐 [View ScoutVault Live](https://scoutvault.netlify.app/)**

## 🚀 Deployment

The application is deployed on:
- **Frontend**: Netlify - [https://scoutvault.netlify.app/](https://scoutvault.netlify.app/)
- **Backend**: Render - API endpoint available
- **API Endpoint**: `https://scoutvault.onrender.com/api/players`

### Deployment Configuration
- **Frontend**: Optimized React build deployed on Netlify
- **Backend**: Python ML models and API hosted on Render
- **Database**: JSON-based predictions storage with MongoDB integration
- **CDN**: Static assets served via Netlify's global CDN

## 🎮 Game Implementation Details

### AI Goalkeeper System
```javascript
// Smart goalkeeper with pattern learning
const calculateGoal = (shootPosition, goaliePos, power) => {
  // Pattern recognition from shot history
  const recentShots = shotHistory.slice(-3);
  const samePositionCount = recentShots.filter(shot => 
    shot.position === shootPosition).length;
  
  // Dynamic difficulty adjustment
  if (samePositionCount >= 2) {
    baseChance *= 0.4; // Goalkeeper expects this position
  }
}
```

### Weather System
- **Rain Effects**: Reduces ball control accuracy
- **Wind System**: Directional wind affects ball trajectory
- **Pressure Mechanics**: Crowd pressure increases with attempts
- **Time Challenges**: Optional countdown timers in hard mode

## 📊 Performance Optimization

- **Efficient Data Processing**: Optimized filtering and calculations
- **Chart Rendering**: Responsive container sizing
- **Export Performance**: Chunked processing for large datasets
- **Memory Management**: Proper cleanup and garbage collection
- **Image Optimization**: Fallback systems and lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Khwaish Goel**
- GitHub: [@Khwaish06](https://github.com/Khwaish06)
- Project Link: [https://github.com/Khwaish06/ScoutVault](https://github.com/Khwaish06/ScoutVault)

## 🙏 Acknowledgments

- FIFA for providing comprehensive player datasets
- Scikit-learn community for machine learning tools
- React and open-source community for frontend frameworks
- Tailwind CSS for utility-first styling
- Lucide React for modern iconography
- Football analytics community for inspiration and validation

---

*Built with ❤️ for football analytics and data science*
