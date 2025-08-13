import { PvpTrackerConfig, CalculationMode } from '../../types'

export interface ConfigurationPanelProps {
  config: PvpTrackerConfig;
  onConfigChange: (config: PvpTrackerConfig) => void;
  calculationMode: CalculationMode;
  onCalculationModeChange: (mode: CalculationMode) => void;
  hidden?: boolean;
}


