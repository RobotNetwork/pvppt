export const fightDataInputStyles = `
	.fight-data-input { background:#0f1216; border-radius:12px; padding:1rem; box-shadow:0 6px 18px rgba(0,0,0,.35); width:100%; max-width:100%; box-sizing:border-box; border:1px solid #2a2f37; }
	.input-header { margin-bottom: .75rem; text-align:center; }
	.input-header h2 { margin:0; color:#e4e0cf; font-size:1.1rem; font-weight:800; }
	.error-message { background:#2a1414; color:#e06b6b; padding:.75rem; border-radius:8px; margin-bottom:.75rem; border:1px solid rgba(224,107,107,.35); text-align:center; }
	.pasted-message { background:rgba(53,99,55,.25); color:#74cb86; padding:.6rem; border-radius:8px; margin-bottom:.75rem; border:1px solid rgba(116,203,134,.35); text-align:center; display:flex; align-items:center; justify-content:center; gap:.5rem; }
	.pasted-icon { font-size:1.1rem; font-weight:700; }
	.textarea-container { position:relative; margin-bottom: .5rem; }
	.fight-data-textarea { width:100%; padding: .9rem; border: 1px solid #2a2f37; border-radius:8px; font-family: 'Courier New', monospace; font-size:.9rem; resize: vertical; min-height:60px; transition: all .15s ease; background:#0c0f13; color:#c7cbd1; }
	.fight-data-textarea:focus { outline:none; border-color:#c9a227; box-shadow:0 0 0 2px rgba(201,162,39,.15); background:#0c0f13; color:#e4e0cf; }
	.fight-data-textarea.pasted { border-color:#356337; box-shadow:0 0 0 2px rgba(53,99,55,.2); }
	.textarea-overlay { position:absolute; top:0; left:0; right:0; bottom:0; pointer-events:none; display:flex; align-items:center; justify-content:center; background:rgba(8,10,13,0.35); border-radius:8px; transition:opacity .15s ease; }
	.fight-data-textarea:focus + .textarea-overlay, .fight-data-textarea.pasted + .textarea-overlay { opacity:0; }
	.paste-instructions { display:flex; flex-direction:column; align-items:center; gap:.5rem; color:#7f8793; font-size:.9rem; }
	.paste-icon { font-size:1.35rem; opacity:.8; }
`;


