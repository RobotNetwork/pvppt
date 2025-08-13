import React, { useState, useEffect } from 'react'
import { PvpTrackerConfig, RobeHitFilter, RingData, BoltAmmo, StrongBoltAmmo, DartAmmo, CalculationMode } from '../../types'
import type { ConfigurationPanelProps } from './ConfigurationPanel.types'
import { configurationPanelStyles } from './ConfigurationPanel.styles'

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  config,
  onConfigChange,
  calculationMode,
  onCalculationModeChange,
  hidden = false
}) => {
  const [localConfig, setLocalConfig] = useState<PvpTrackerConfig>(config);
  const [activeSection, setActiveSection] = useState<string>('general');

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleConfigChange = (key: keyof PvpTrackerConfig, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  const renderGeneralSection = () => (
    <div className="config-section">
      <h3>General Settings</h3>
      
      <div className="config-item">
        <label>
          <input
            type="checkbox"
            checked={localConfig.settingsConfigured}
            onChange={(e) => handleConfigChange('settingsConfigured', e.target.checked)}
          />
          I have verified my settings
        </label>
        <p className="config-description">
          Some settings affect damage calculations. Please confirm them and tick this box to hide the config warning.
        </p>
      </div>

      <div className="config-item">
        <label>
          <input
            type="checkbox"
            checked={localConfig.restrictToLms}
            onChange={(e) => handleConfigChange('restrictToLms', e.target.checked)}
          />
          Restrict to LMS
        </label>
        <p className="config-description">
          Restricts functionality to LMS areas. Can be inaccurate outside LMS as attack animations must be manually mapped.
        </p>
      </div>

      <div className="config-item">
        <label>
          <input
            type="checkbox"
            checked={localConfig.showFightHistoryPanel}
            onChange={(e) => handleConfigChange('showFightHistoryPanel', e.target.checked)}
          />
          Show Fight History Panel
        </label>
        <p className="config-description">
          Enables the side-panel which displays previous fight statistics.
        </p>
      </div>

      <div className="config-item">
        <label>Hits on Robes Filter:</label>
        <select
          value={localConfig.robeHitFilter}
          onChange={(e) => handleConfigChange('robeHitFilter', e.target.value as RobeHitFilter)}
        >
          <option value={RobeHitFilter.BOTTOM}>Bottom</option>
          <option value={RobeHitFilter.TOP}>Top</option>
          <option value={RobeHitFilter.BOTH}>Both</option>
          <option value={RobeHitFilter.EITHER}>Either</option>
        </select>
        <p className="config-description">
          Which part of the robe to count hits on: bottom, top, both, or either.
        </p>
      </div>
    </div>
  );

  const renderGearAmmoSection = () => (
    <div className="config-section">
      <h3>Gear/Ammo Settings</h3>
      
      <div className="config-item">
        <label>Ring Used:</label>
        <select
          value={localConfig.ringChoice}
          onChange={(e) => handleConfigChange('ringChoice', e.target.value as RingData)}
        >
          {Object.values(RingData).map(ring => (
            <option key={ring} value={ring}>
              {ring.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
        <p className="config-description">
          Ring used for the deserved damage calculations outside of LMS.
        </p>
      </div>

      <div className="config-item">
        <label>RCB Ammo:</label>
        <select
          value={localConfig.boltChoice}
          onChange={(e) => handleConfigChange('boltChoice', e.target.value as BoltAmmo)}
        >
          {Object.values(BoltAmmo).map(bolt => (
            <option key={bolt} value={bolt}>
              {bolt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
        <p className="config-description">
          Bolts used for rune crossbow's deserved damage calculation.
        </p>
      </div>

      <div className="config-item">
        <label>ACB/DCB/DHCB Ammo:</label>
        <select
          value={localConfig.strongBoltChoice}
          onChange={(e) => handleConfigChange('strongBoltChoice', e.target.value as StrongBoltAmmo)}
        >
          {Object.values(StrongBoltAmmo).map(bolt => (
            <option key={bolt} value={bolt}>
              {bolt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
        <p className="config-description">
          Bolts used for ACB/DCB/DHCB's deserved damage calculation.
        </p>
      </div>

      <div className="config-item">
        <label>Blowpipe Ammo:</label>
        <select
          value={localConfig.bpDartChoice}
          onChange={(e) => handleConfigChange('bpDartChoice', e.target.value as DartAmmo)}
        >
          {Object.values(DartAmmo).map(dart => (
            <option key={dart} value={dart}>
              {dart.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
        <p className="config-description">
          Darts used for blowpipe deserved damage calculation.
        </p>
      </div>
    </div>
  );

  const renderLevelsSection = () => (
    <div className="config-section">
      <h3>Level Settings</h3>
      
      <div className="config-item">
        <label>Attack Level:</label>
        <input
          type="number"
          min="1"
          max="120"
          value={localConfig.attackLevel}
          onChange={(e) => handleConfigChange('attackLevel', parseInt(e.target.value))}
        />
        <p className="config-description">
          Attack level used for deserved damage calculations (includes potion boost).
        </p>
      </div>

      <div className="config-item">
        <label>Strength Level:</label>
        <input
          type="number"
          min="1"
          max="120"
          value={localConfig.strengthLevel}
          onChange={(e) => handleConfigChange('strengthLevel', parseInt(e.target.value))}
        />
        <p className="config-description">
          Strength level used for deserved damage calculations (includes potion boost).
        </p>
      </div>

      <div className="config-item">
        <label>Defence Level:</label>
        <input
          type="number"
          min="1"
          max="120"
          value={localConfig.defenceLevel}
          onChange={(e) => handleConfigChange('defenceLevel', parseInt(e.target.value))}
        />
        <p className="config-description">
          Defence level used for deserved damage calculations (includes potion boost).
        </p>
      </div>

      <div className="config-item">
        <label>Ranged Level:</label>
        <input
          type="number"
          min="1"
          max="120"
          value={localConfig.rangedLevel}
          onChange={(e) => handleConfigChange('rangedLevel', parseInt(e.target.value))}
        />
        <p className="config-description">
          Ranged level used for deserved damage calculations (includes potion boost).
        </p>
      </div>

      <div className="config-item">
        <label>Magic Level:</label>
        <input
          type="number"
          min="1"
          max="120"
          value={localConfig.magicLevel}
          onChange={(e) => handleConfigChange('magicLevel', parseInt(e.target.value))}
        />
        <p className="config-description">
          Magic level used for deserved damage calculations (includes potion boost).
        </p>
      </div>
    </div>
  );

  const renderCalculationSection = () => (
    <div className="config-section">
      <h3>Calculation Engine Settings</h3>
      
      <div className="config-item">
        <label>Calculation Mode:</label>
        <select
          value={calculationMode}
          onChange={(e) => onCalculationModeChange(e.target.value as CalculationMode)}
        >
          <option value={CalculationMode.DEFAULT}>Default (Use JSON data)</option>
          <option value={CalculationMode.HISCORE_LOOKUP}>Hiscore Lookup</option>
          <option value={CalculationMode.SETTINGS}>Use Custom Settings</option>
        </select>
        <p className="config-description">
          Choose how to calculate metrics: use data from JSON, lookup player stats via hiscore API, or use your configured settings.
        </p>
      </div>

      <div className="config-item">
        <label>
          <input
            type="checkbox"
            checked={localConfig.dlongIsVls}
            onChange={(e) => handleConfigChange('dlongIsVls', e.target.checked)}
          />
          Dlong = VLS
        </label>
        <p className="config-description">
          Track Dragon Longsword & its spec as a Vesta's Longsword for deserved damage.
        </p>
      </div>
    </div>
  );

  const renderMiscSection = () => (
    <div className="config-section">
      <h3>Misc Settings</h3>
      
      <div className="config-item">
        <label>
          <input
            type="checkbox"
            checked={localConfig.showWorldInSummary}
            onChange={(e) => handleConfigChange('showWorldInSummary', e.target.checked)}
          />
          Show World in Summary
        </label>
        <p className="config-description">
          Display the world number between names in the summary panel.
        </p>
      </div>
    </div>
  );

  return (
    <div className="configuration-panel" style={{opacity: hidden ? 0 : 1, pointerEvents: hidden ? 'none' : 'auto'}}>
      <style>{configurationPanelStyles}</style>
      <h2>PvP Performance Tracker Configuration</h2>
      
      <div className="config-navigation">
        <button
          className={activeSection === 'general' ? 'active' : ''}
          onClick={() => setActiveSection('general')}
        >
          General
        </button>
        <button
          className={activeSection === 'gear' ? 'active' : ''}
          onClick={() => setActiveSection('gear')}
        >
          Gear/Ammo
        </button>
        <button
          className={activeSection === 'levels' ? 'active' : ''}
          onClick={() => setActiveSection('levels')}
        >
          Levels
        </button>
        <button
          className={activeSection === 'calculation' ? 'active' : ''}
          onClick={() => setActiveSection('calculation')}
        >
          Calculation Engine
        </button>
        <button
          className={activeSection === 'misc' ? 'active' : ''}
          onClick={() => setActiveSection('misc')}
        >
          Misc
        </button>
      </div>

      <div className="config-content">
        {activeSection === 'general' && renderGeneralSection()}
        {activeSection === 'gear' && renderGearAmmoSection()}
        {activeSection === 'levels' && renderLevelsSection()}
        {activeSection === 'calculation' && renderCalculationSection()}
        {activeSection === 'misc' && renderMiscSection()}
      </div>
    </div>
  );
};

export default ConfigurationPanel;


