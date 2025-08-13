export const configurationPanelStyles = `
  .configuration-panel { width: 280px; background:#0c0f13; color:#e4e0cf; border-right:1px solid #2a2f37; height: calc(100vh - 0px); position: sticky; top: 0; padding: 16px 12px; box-shadow: inset -1px 0 0 rgba(0,0,0,.25); }
  .configuration-panel h2 { text-align:left; margin: 0 0 12px 0; color:#c9a227; font-size: 1rem; letter-spacing:.5px; }
  .config-navigation { display:flex; flex-wrap:wrap; gap:6px; margin-bottom: 12px; border-bottom:1px solid #1e232b; padding-bottom: 10px; }
  .config-navigation button { background:#12161c; color:#c7cbd1; border:1px solid #2a2f37; padding:6px 8px; border-radius:6px; cursor:pointer; font-size:.78rem; font-weight:700; }
  .config-navigation button.active { background:#1a212b; color:#e4e0cf; border-color:#c9a227; box-shadow:0 0 0 2px rgba(201,162,39,.12); }
  .config-content { overflow:auto; max-height: calc(100vh - 140px); padding-right: 6px; }
  .config-section h3 { color:#e6b35c; margin:12px 0 8px; font-size:.95rem; }
  .config-item { margin-bottom: 10px; padding:10px; background:#0f1216; border-radius:8px; border:1px solid #2a2f37; }
  .config-item:hover { border-color:#c9a227; }
  .config-item label { display:flex; align-items:center; gap:8px; font-weight:700; font-size:.85rem; margin-bottom:6px; color:#e4e0cf; }
  .config-item input[type="checkbox"] { width:16px; height:16px; accent-color:#c9a227; cursor:pointer; }
  .config-item input[type="number"], .config-item select { background:#12161c; color:#c7cbd1; border:1px solid #2a2f37; border-radius:6px; padding:6px 8px; font-size:.85rem; min-width: 110px; }
  .config-description { color:#9aa2ad; font-size:.8rem; margin:0; margin-top:6px; font-style: italic; }
`;