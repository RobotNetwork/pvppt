export const fightMetricsDisplayStyles = `
	.fight-metrics-display { background: #0f1216; border-radius: 12px; padding: 1.25rem; box-shadow: 0 6px 18px rgba(0,0,0,.35); width: 100%; max-width: 100%; box-sizing: border-box; border: 1px solid #2a2f37; }
	.fight-header { margin-bottom: 1rem; padding-bottom: .75rem; border-bottom: 1px solid #2a2f37; }
	.fight-header h2 { margin: 0 0 .35rem 0; color: #e4e0cf; font-size: 1.25rem; font-weight: 700; }
	.fight-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: .5rem; font-size: .85rem; }
	.fight-info>div { padding: .4rem .5rem; background-color: #12161c; border-radius: 6px; border-left: 3px solid #c9a227; color: #c7cbd1; }
	.metrics-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.fighter-metrics { padding: 1rem; border-radius: 8px; border: 1px solid #2a2f37; transition: box-shadow .2s ease; background: #0c0f13; }
	.fighter-metrics:hover { box-shadow: 0 0 0 2px rgba(201,162,39,.2); }
	.fighter-metrics h3 { margin: 0 0 .5rem 0; color: #e4e0cf; font-size: 1.05rem; font-weight: 700; padding-bottom: .4rem; border-bottom: 1px solid #232730; }
	.fighter-metrics.winner { border-color: #3b6f2a; box-shadow: 0 0 0 2px rgba(59,111,42,.25); }
	.fighter-metrics.winner h3 { color: #74cb86 !important; }
	.fighter-metrics.loser { border-color: #6b2a2a; box-shadow: 0 0 0 2px rgba(107,42,42,.25); }
	.fighter-metrics.loser h3 { color: #e06b6b !important; }
	.metrics-grid { display: flex; flex-direction: column; gap: .5rem; }
	.metric-row { display: flex; justify-content: space-between; align-items: center; padding: .45rem 0; border-bottom: 1px dashed #1e232b; }
	.metric-row:last-child { border-bottom: none; }
	.metric-label { font-weight: 600; color: #aeb3bb; font-size: .9rem; }
	.metric-value { font-weight: 700; color: #e4e0cf; font-size: .92rem; text-align: right; min-width: 140px; display: flex; align-items: center; justify-content: flex-end; gap: .5rem; }
	.difference { display: inline-flex; align-items: center; line-height: 1; font-size: .8rem; font-weight: 800; padding: .15rem .4rem; border-radius: 4px; white-space: nowrap; border: 1px solid transparent; }
	.difference.positive { background-color: rgba(53, 99, 55, .25); color: #74cb86; border-color: rgba(116,203,134,.35); }
	.difference.negative { background-color: rgba(107, 42, 42, .25); color: #e06b6b; border-color: rgba(224,107,107,.35); }
	@media (max-width: 768px) { .metrics-container { grid-template-columns: 1fr; gap: .75rem; } .fight-metrics-display { padding: 1rem; } }
`;


