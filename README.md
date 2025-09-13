# ScoutVault ⚽

**AI-Powered Football Player Transfer Value Prediction & Analytics Platform**

ScoutVault is a comprehensive web application that leverages machine learning to predict football player transfer values using FIFA dataset analysis. The platform combines advanced data science techniques with an intuitive web interface to provide actionable insights for football analytics.

## 🚀 Key Features

### Machine Learning Pipeline
- **Advanced ML Models**: Random Forest, Ridge Regression, and Gradient Boosting algorithms
- **High Accuracy**: Achieves 98% prediction accuracy on FIFA player datasets
- **Robust Data Processing**: Handles missing values, outliers, and data validation
- **Log Transformation**: Implements safe logarithmic scaling for better prediction performance

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

### Frontend
- **React**: Modern UI framework with hooks
- **JavaScript ES6+**: Advanced frontend functionality
- **Recharts**: Interactive data visualization library
- **Tailwind CSS**: Utility-first styling framework
- **Export Libraries**: XLSX, jsPDF, html2canvas for data export

### Data Processing
- **FIFA Player Dataset**: Comprehensive player statistics and attributes
- **Feature Engineering**: Age, overall rating, potential, physical attributes
- **Data Validation**: Robust cleaning and preprocessing pipeline
- **Predictions Storage**: JSON-based prediction results

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
recharts>=2.5.0
tailwindcss>=3.0.0
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
│   │   └── Analytics.jsx          # Main analytics dashboard
│   ├── components/                # React components
│   └── utils/                     # Utility functions
├── backend/
│   ├── models/                    # Trained ML models
│   ├── data/                      # Dataset files
│   └── predictions.json           # Model predictions
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

## 📈 Analytics Insights

The platform provides comprehensive insights including:

- **Player Valuation Trends**: Market value patterns across age groups
- **Team Analysis**: Squad value comparisons and team rankings
- **Market Distribution**: Value range analysis and player concentration
- **Prediction Accuracy**: Model confidence and error margins

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach with touch-friendly controls
- Desktop-optimized layouts for detailed analysis
- Progressive enhancement for different screen sizes

### Interactive Elements
- Real-time chart updates based on filters
- Hover effects and detailed tooltips
- Smooth animations and transitions
- Loading states for better user feedback

### Export & Reporting
- Professional PDF reports with charts and statistics
- High-quality PNG chart exports
- Excel/CSV data exports with formatting
- Custom report generation with timestamps

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
- **Database**: JSON-based predictions storage
- **CDN**: Static assets served via Netlify's global CDN

## 📊 Performance Optimization

- **Efficient Data Processing**: Optimized filtering and calculations
- **Chart Rendering**: Responsive container sizing
- **Export Performance**: Chunked processing for large datasets
- **Memory Management**: Proper cleanup and garbage collection

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
- Football analytics community for inspiration and validation

---

*Built with ❤️ for football analytics and data science*
