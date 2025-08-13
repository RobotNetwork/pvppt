export const advancedAnalysisStyles = `
  .advanced-analysis { background: #0f1216; border-radius: 12px; padding: .9rem; box-shadow: 0 6px 18px rgba(0,0,0,.35); border: 1px solid #2a2f37; }
  .analysis-header { position: sticky; top: 0; z-index: 1; background: #0f1216; margin-bottom: .6rem; padding-bottom: .3rem; border-bottom: 1px solid #2a2f37; display:flex; align-items:center; justify-content: space-between; }
  .analysis-header h3 { margin: 0; color: #e4e0cf; font-size: 1rem; font-weight: 800; }
  .toggle-btn { background: #1a1f26; color: #e4e0cf; border: 1px solid #2a2f37; border-radius: 6px; padding: .25rem .5rem; cursor: pointer; font-weight: 700; }
  .toggle-btn:focus { outline: 2px solid #3b82f6; outline-offset: 2px; }
  .analysis-controls { display:flex; flex-direction: column; gap: .5rem; margin-bottom: .5rem; }
  .checkbox { display:flex; align-items:center; gap:.5rem; color:#c7cbd1; font-weight:700; }
  .spike-graph-wrapper { display:flex; flex-direction: column; align-items: center; gap:.35rem; }
  .spike-graph { width: 100%; height: 120px; background: #0c0f13; border:1px solid #2a2f37; border-radius: 8px; }
  .bar-competitor { fill: #6a8dff; opacity: .85; }
  .bar-opponent { fill: #e6b35c; opacity: .85; }
  .legend { display:flex; align-items:center; gap:.35rem; color:#aeb3bb; font-size:.8rem; }
  .legend-box { width:10px; height:10px; display:inline-block; border-radius:2px; }
  .legend-box.competitor { background:#6a8dff; }
  .legend-box.opponent { background:#e6b35c; }
  .empty-state { color:#6e7581; font-size:.9rem; }
  .tick-text { fill:#7f8792; font-size:10px; user-select:none; }
  .axis-label { fill:#aeb3bb; font-size:10px; }
  .line-competitor { stroke:#6a8dff; stroke-width:2; fill:none; opacity:.95; }
  .line-opponent { stroke:#e6b35c; stroke-width:2; fill:none; opacity:.95; }
  .point-competitor { fill:#6a8dff; }
  .point-opponent { fill:#e6b35c; }
`


