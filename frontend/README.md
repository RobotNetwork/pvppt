# PvP Performance Tracker Frontend

A modern React TypeScript application for analyzing PvP fight data from Old School RuneScape.

## 🚀 Features

- **Fight Data Analysis**: Paste fight data JSON and get detailed metrics
- **Performance Metrics**: Off-prayer hits, deserved damage, magic accuracy, and more
- **Fight History**: Save and review past fights with duplicate detection
- **Real-time Processing**: Auto-analyze pasted data with visual feedback
- **Responsive Design**: Modern UI that works on desktop and mobile

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript 5.9** - Full type safety and modern JavaScript features
- **Vite 7** - Fast build tool and dev server
- **CSS Modules** - Scoped styling for components

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── FightDataInput.tsx      # Data input with auto-analysis
│   ├── FightMetricsDisplay.tsx # Metrics visualization
│   └── FightHistory.tsx        # Fight history management
├── types/               # TypeScript interfaces
│   └── index.ts         # All data model definitions
├── utils/               # Utility functions
│   └── fightDataParser.ts # Fight data parsing logic
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Development

The development server will start at `http://localhost:5173` with hot reload enabled.

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript compiler check
- `npm run lint` - Run ESLint

## 📊 Data Models

The application uses comprehensive TypeScript interfaces for all PvP data:

- **Fighter**: Player stats, combat levels, and fight performance
- **FightData**: Complete fight information with competitor and opponent
- **FightLogEntry**: Individual attack/hit data with gear and prayer info
- **FormattedMetrics**: Calculated and formatted display metrics

## 🎯 Key Features

### Auto-Analysis
- Automatically processes pasted fight data
- Visual feedback during processing
- Duplicate fight detection

### Performance Metrics
- **Off-prayer hits**: Success rate without protection prayers
- **Deserved damage**: Theoretical damage based on gear and levels
- **Magic accuracy**: Hit rate vs. expected hit rate
- **KO chances**: Probability calculations for kill opportunities
- **Robe hits**: Special melee/range hits on magic users

### Data Persistence
- Local storage for fight history
- Input field persistence
- Automatic cleanup of old data

## 🔄 Data Flow

1. **Input**: User pastes fight data JSON
2. **Parsing**: `FightDataParser` converts raw data to typed objects
3. **Analysis**: Metrics are calculated and formatted
4. **Display**: Components render the analyzed data
5. **Storage**: Fight data is saved to local storage

## 🧪 Testing

The application includes comprehensive TypeScript types that serve as runtime contracts. To add tests:

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react

# Add test script to package.json
"test": "vitest"
```

## 🚀 Deployment

The application builds to a static `dist/` folder that can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 📝 Contributing

1. Ensure TypeScript compilation passes: `npm run type-check`
2. Follow the existing code style and patterns
3. Add proper type annotations for all new code
4. Test your changes thoroughly

## 🔗 Related Projects

- **Backend**: TypeScript calculation engine and metrics system
- **Java Plugin**: RuneLite plugin for data collection
- **Documentation**: Comprehensive architecture and API docs

## 📄 License

This project is part of the PvP Performance Tracker ecosystem.
