import { PvpTrackerConfig, RobeHitFilter, RingData, BoltAmmo, StrongBoltAmmo, DartAmmo } from '../types';

// ================================= Default Configuration =================================

export const DEFAULT_CONFIG: PvpTrackerConfig = {
  // General Settings
  settingsConfigured: false,
  restrictToLms: false,
  showFightHistoryPanel: true,
  robeHitFilter: RobeHitFilter.EITHER,
  
  // Gear/Ammo Settings
  ringChoice: RingData.BERSERKER_RING,
  boltChoice: BoltAmmo.DIAMOND_BOLTS_E,
  strongBoltChoice: StrongBoltAmmo.DIAMOND_DRAGON_BOLTS_E,
  bpDartChoice: DartAmmo.DRAGON_DARTS,
  
  // Level Settings
  attackLevel: 118,
  strengthLevel: 118,
  defenceLevel: 120,
  rangedLevel: 112,
  magicLevel: 99,
  
  // Misc Settings
  dlongIsVls: true,
  fightLogInChat: false,
  showWorldInSummary: true,
  nameFilter: ''
};

// ================================= Configuration Service =================================

export class ConfigService {
  private static instance: ConfigService;
  private config: PvpTrackerConfig;
  private readonly STORAGE_KEY = 'pvp_tracker_config';
  private readonly VERSION_KEY = 'pvp_tracker_config_version';
  private readonly CURRENT_VERSION = '1.0.0';

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  // ================================= Configuration Management =================================

  getConfig(): PvpTrackerConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<PvpTrackerConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  resetToDefaults(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
  }

  // ================================= Validation =================================

  validateConfig(config: PvpTrackerConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate level ranges
    if (config.attackLevel < 1 || config.attackLevel > 120) {
      errors.push('Attack level must be between 1 and 120');
    }
    if (config.strengthLevel < 1 || config.strengthLevel > 120) {
      errors.push('Strength level must be between 1 and 120');
    }
    if (config.defenceLevel < 1 || config.defenceLevel > 120) {
      errors.push('Defence level must be between 1 and 120');
    }
    if (config.rangedLevel < 1 || config.rangedLevel > 120) {
      errors.push('Ranged level must be between 1 and 120');
    }
    if (config.magicLevel < 1 || config.magicLevel > 120) {
      errors.push('Magic level must be between 1 and 120');
    }


    return {
      isValid: errors.length === 0,
      errors
    };
  }



  // ================================= Persistence =================================

  private loadConfig(): PvpTrackerConfig {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const version = localStorage.getItem(this.VERSION_KEY);
      
      if (stored && version === this.CURRENT_VERSION) {
        const parsed = JSON.parse(stored);
        const validation = this.validateConfig(parsed);
        
        if (validation.isValid) {
          return parsed;
        } else {
          console.warn('Stored config validation failed, using defaults:', validation.errors);
        }
      } else if (stored && version !== this.CURRENT_VERSION) {
        console.log('Config version mismatch, migrating from', version, 'to', this.CURRENT_VERSION);
        // Here you could implement migration logic for different versions
      }
    } catch (error) {
      console.error('Error loading config from localStorage:', error);
    }
    
    return { ...DEFAULT_CONFIG };
  }

  private saveConfig(): void {
    try {
      const validation = this.validateConfig(this.config);
      if (validation.isValid) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
        localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
      } else {
        console.error('Cannot save invalid config:', validation.errors);
      }
    } catch (error) {
      console.error('Error saving config to localStorage:', error);
    }
  }

  // ================================= Utility Methods =================================

  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  importConfig(configJson: string): { success: boolean; errors?: string[] } {
    try {
      const imported = JSON.parse(configJson);
      const validation = this.validateConfig(imported);
      
      if (validation.isValid) {
        this.config = imported;
        this.saveConfig();
        return { success: true };
      } else {
        return { success: false, errors: validation.errors };
      }
    } catch (error) {
      return { success: false, errors: ['Invalid JSON format'] };
    }
  }

  // ================================= Configuration Presets =================================

  getPresetConfigs(): { name: string; config: Partial<PvpTrackerConfig> }[] {
    return [
      {
        name: 'LMS Focused',
        config: {
          restrictToLms: true
        }
      },
      {
        name: 'World PvP',
        config: {
          restrictToLms: false,
          showWorldInSummary: true
        }
      },
      {
        name: 'General PvP',
        config: {
          restrictToLms: false,
          showFightHistoryPanel: true
        }
      }
    ];
  }

  applyPreset(presetName: string): boolean {
    const preset = this.getPresetConfigs().find(p => p.name === presetName);
    if (preset) {
      this.updateConfig(preset.config);
      return true;
    }
    return false;
  }
}

// ================================= Export Functions =================================

export function getConfigService(): ConfigService {
  return ConfigService.getInstance();
}

export function getDefaultConfig(): PvpTrackerConfig {
  return { ...DEFAULT_CONFIG };
}
