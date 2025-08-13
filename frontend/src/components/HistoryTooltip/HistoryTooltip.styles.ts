export const historyTooltipStyles = `
	.history-tooltip {
		position: absolute;
		top: var(--tooltip-top, 0px);
		right: 0;
		z-index: 50;
		background: #0f1216;
		border: 1px solid #2a2f37;
		border-radius: 8px;
		box-shadow: 0 8px 24px rgba(0,0,0,.5);
		padding: .6rem .7rem;
		width: 360px;
		max-width: 100%;
		
		overflow: auto;
		pointer-events: none;
		box-sizing: border-box;
	}
	.history-tooltip .tooltip-inner { display:flex; flex-direction:column; gap:.5rem; }
	.history-tooltip .header { display:flex; justify-content:space-between; align-items:right; border-bottom:1px solid #232730; padding-bottom:.35rem; margin-bottom:.25rem; }
	.history-tooltip .header h4 { margin:0; font-size:.95rem; color:#e4e0cf; }
	.history-tooltip .metrics { display:grid; grid-template-columns:1fr 1fr; gap:.4rem; }
	.history-tooltip .fighter { background:#0c0f13; border:1px solid #2a2f37; border-radius:6px; padding:.5rem; }
	.history-tooltip .fighter.winner { border-color:#3b6f2a; box-shadow:0 0 0 2px rgba(59,111,42,.2); }
	.history-tooltip .fighter.loser { border-color:#6b2a2a; box-shadow:0 0 0 2px rgba(107,42,42,.15); }
	.history-tooltip .fighter h5 { margin:.1rem 0 .35rem 0; font-size:.9rem; color:#c7cbd1; }
	.history-tooltip .row { display:flex; justify-content:space-between; font-size:.8rem; padding:.2rem 0; border-bottom:1px dashed #1e232b; }
	.history-tooltip .row:last-child { border-bottom:none; }
	.history-tooltip .label { color:#aeb3bb; }
	.history-tooltip .value { color:#e4e0cf; display:flex; align-items:center; gap:.35rem; }
	.history-tooltip .diff { font-size:.75rem; font-weight:800; padding:.1rem .3rem; border-radius:4px; border:1px solid transparent; }
	.history-tooltip .diff.pos { background-color: rgba(53, 99, 55, .25); color:#74cb86; border-color: rgba(116,203,134,.35); }
	.history-tooltip .diff.neg { background-color: rgba(107, 42, 42, .25); color:#e06b6b; border-color: rgba(224,107,107,.35); }
`;
