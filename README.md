# PvP Performance Tracker (PvPPT)

A modern TypeScript rewrite of the PvP Performance Tracker RuneLite plugin, featuring a React frontend and extensible backend architecture.

## 🏗️ Project Structure

```
pvppt/
├── pvp-performance-tracker/    # Original Java RuneLite plugin (reference)
├── src/                        # TypeScript backend source
│   ├── types/                  # Type definitions and interfaces
│   ├── engine/                 # Calculation engine for damage/accuracy
│   ├── metrics/                # Extensible metric system
│   ├── config/                 # Configuration management
│   ├── services/               # External service integrations
│   └── utils/                  # Utility functions
├── frontend/                   # React frontend application
├── package.json                # Root package configuration
├── tsconfig.json               # TypeScript configuration
└── jest.config.js              # Testing configuration
```

## 🚀 Features

- **TypeScript Backend**: Full type-safe implementation of PvP calculations
- **Extensible Metrics**: Plugin-like system for custom analytics
- **Calculation Engine**: Accurate damage and accuracy calculations
- **React Frontend**: Modern web interface for data visualization
- **OSRS Integration**: Hiscore API integration for player statistics
- **Modular Architecture**: Clean separation of concerns and extensibility

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd pvppt

# Install all dependencies
npm run install:all
```

### Development
```bash
# Start both backend and frontend in development mode
npm run dev

# Or run them separately:
npm run dev:backend    # TypeScript compilation with watch
npm run dev:frontend   # React development server
```

### Building
```bash
# Build both backend and frontend
npm run build

# Or build separately:
npm run build:backend
npm run build:frontend
```

### Testing
```bash
# Run all tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## 📚 Architecture

### Backend Components

#### Types System (`src/types/`)
Comprehensive TypeScript interfaces covering all PvP data models:
- Combat levels and equipment
- Fight performance data
- Configuration interfaces
- API response types

#### Calculation Engine (`src/engine/`)
Handles all damage and accuracy calculations:
- Multi-style support (Melee, Ranged, Magic)
- Special attack handling
- Prayer integration
- Void set detection

#### Metrics System (`src/metrics/`)
Extensible plugin-like system for analytics:
- Built-in metrics (damage, accuracy, timing)
- Custom metric creation
- Dependency management
- Validation and error handling

#### Configuration (`src/config/`)
Type-safe configuration management:
- Plugin settings
- Validation
- Default values
- Change notifications

#### Services (`src/services/`)
External integrations:
- OSRS Hiscore API
- Player statistics
- Caching and validation

### Frontend Components

The React frontend provides:
- Fight data input and parsing
- Performance metrics display
- Fight history management
- Real-time data visualization

## 🔧 Configuration

The system supports extensive configuration through the `PluginConfiguration` interface:

```typescript
interface PluginConfiguration {
  // General settings
  restrictToLms: boolean;
  showFightHistoryPanel: boolean;
  
  // Gear & ammo settings
  ringChoice: RingData;
  boltChoice: AmmoData;
  
  // Level settings
  attackLevel: number;
  strengthLevel: number;
  
  // And many more...
}

## 📊 Metrics

### Built-in Metrics
- **Damage**: Total damage dealt/received, damage ratio, average hit
- **Accuracy**: Overall accuracy, off-prayer accuracy
- **Performance**: Fight duration, DPS
- **Timing**: Attack timing analysis

### Custom Metrics
Create custom metrics using the `MetricBuilder`:

```typescript
const customMetric = MetricBuilder.createCustomMetric(
  'my_metric',
  'My Custom Metric',
  'Description of what this metric measures',
  MetricCategory.CUSTOM,
  'units',
  (fight, config) => {
    // Your calculation logic here
    return calculatedValue;
  }
);
```

## 🧪 Testing

The project includes comprehensive testing infrastructure:

- **Jest**: Test runner with TypeScript support
- **Coverage**: Code coverage reporting
- **Mocks**: Built-in mocking for external dependencies
- **Setup**: Global test configuration

## 📦 Build System

- **TypeScript**: Strict type checking and compilation
- **Vite**: Fast frontend development and building
- **Workspaces**: Monorepo management with npm workspaces
- **Concurrent**: Parallel development server execution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Original Java plugin authors
- RuneLite community
- OSRS development team

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Check the documentation
- Review the architecture guide
