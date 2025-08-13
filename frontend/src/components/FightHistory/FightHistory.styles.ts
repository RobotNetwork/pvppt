export const fightHistoryStyles = `
  .fight-history { background: #0f1216; border-radius: 12px; padding: .9rem; box-shadow: 0 6px 18px rgba(0,0,0,.35); height: fit-content; max-height: 80vh; overflow-y: auto; overflow-x: hidden; border: 1px solid #2a2f37; }
  .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: .6rem; padding-bottom: .3rem; border-bottom: 1px solid #2a2f37; }
  .history-header h3 { margin: 0; color: #e4e0cf; font-size: 1rem; font-weight: 800; }
  .filters { display:flex; gap:.35rem; align-items:center; }
  .filter-btn { background:#12161c; color:#c7cbd1; border:1px solid #2a2f37; padding:.25rem .5rem; border-radius:6px; font-size:.8rem; cursor:pointer; }
  .filter-btn.active { background:#1a212b; color:#e4e0cf; border-color:#c9a227; box-shadow:0 0 0 2px rgba(201,162,39,.15); }
  .clear-history-btn { background: none; border: 1px solid #2a2f37; color:#c7cbd1; border-radius:6px; font-size: .95rem; cursor: pointer; padding: .25rem .45rem; }
  .clear-history-btn:hover { background:#1a212b; }
  .history-list { display:flex; flex-direction:column; gap:.5rem; }
  .history-item { background:#0c0f13; border:1px solid #2a2f37; border-radius:8px; padding:.6rem .75rem; margin-bottom:.1rem; cursor:pointer; transition:all .15s ease; position:relative; }
  .history-item:hover { border-color:#c9a227; box-shadow:0 0 0 2px rgba(201,162,39,.15); }
  .history-item.selected { border-color:#6a8dff; box-shadow: 0 0 0 2px rgba(106,141,255,.18); background:#0e1320; }
  .history-item.duplicate { border-color:#e06b6b; background:#160f10; box-shadow:0 0 0 2px rgba(224,107,107,.18); }
  .delete-btn { position:absolute; top:.35rem; right:.35rem; background:none; border:1px solid #2a2f37; color:#c7cbd1; font-size:.85rem; cursor:pointer; opacity:0; transition:opacity .15s ease; padding:.15rem .35rem; border-radius:4px; }
  .history-item:hover .delete-btn { opacity:1; }
  .delete-btn:hover { background:#1a212b; color:#e06b6b; }
  .fight-names { display:flex; align-items:center; gap:.4rem; margin-bottom:.35rem; font-weight:800; font-size:.9rem; color:#c7cbd1; }
  .winner-indicator { background-color:#356337; color:#e4f6e8; padding:.1rem .35rem; border-radius:4px; font-size:.7rem; font-weight:800; }
  .vs { color:#6e7581; font-weight:600; }
  .fight-stats { display:flex; justify-content:space-between; font-size:.8rem; color:#aeb3bb; font-weight:700; }
  .damage-dealt { color:#e6b35c; }
  .attack-count { color:#7aa2ff; }
`;


