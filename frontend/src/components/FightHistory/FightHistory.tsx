import React from 'react'
import type { FightHistoryProps } from './FightHistory.types'
import { fightHistoryStyles } from './FightHistory.styles'
import HistoryTooltip from '../HistoryTooltip'

const FightHistory: React.FC<FightHistoryProps> = ({ 
  fights, 
  selectedFight, 
  onFightSelect, 
  onClearHistory, 
  onDeleteFight, 
  getWinner, 
  duplicateFightId 
}) => {
  const [filter, setFilter] = React.useState<'all'|'wins'|'losses'>('all');
  const [hoveredId, setHoveredId] = React.useState<number | null>(null)
  const hoverTimerRef = React.useRef<number | null>(null)
  const [hoveredTop, setHoveredTop] = React.useState<number>(0)

  const filtered = fights.filter((f) => {
    const w = getWinner(f.data);
    if (filter === 'all') return true;
    if (filter === 'wins') return w === f.competitorName;
    if (filter === 'losses') return w === f.opponentName;
    return true;
  });
  if (fights.length === 0) {
    return (
      <div className="fight-history">
      <style>{fightHistoryStyles}</style>
      <div className="history-header">
        <h3>Fight History</h3>
        </div>
        <div className="no-history">
          <p>No fight data saved.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fight-history">
      <style>{fightHistoryStyles}</style>
      <div className="history-header">
        <h3>History ({filtered.length})</h3>
        <div className="filters">
          <button className={`filter-btn ${filter==='all'?'active':''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter==='wins'?'active':''}`} onClick={() => setFilter('wins')}>Wins</button>
          <button className={`filter-btn ${filter==='losses'?'active':''}`} onClick={() => setFilter('losses')}>Losses</button>
          <button
            onClick={onClearHistory}
            className="clear-history-btn"
            title="Delete fight history"
          >🗑️</button>
        </div>
      </div>

      <div className="history-list">
        {filtered.map((fight) => {
          const winner = getWinner(fight.data)
          const isSelected = selectedFight && selectedFight.id === fight.id
          const isDuplicate = duplicateFightId === fight.id

          return (
            <div
              key={fight.id}
              className={`history-item ${isSelected ? 'selected' : ''} ${isDuplicate ? 'duplicate' : ''}`}
              onClick={() => onFightSelect(fight)}
              onMouseEnter={(e) => {
                if (hoverTimerRef.current) {
                  window.clearTimeout(hoverTimerRef.current)
                }
                hoverTimerRef.current = window.setTimeout(() => {
                  setHoveredId(fight.id)
                }, 1500)
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                setHoveredTop(Math.max(0, Math.min(e.clientY - rect.top, rect.height)))
              }}
              onMouseLeave={() => {
                if (hoverTimerRef.current) {
                  window.clearTimeout(hoverTimerRef.current)
                }
                hoverTimerRef.current = null
                setHoveredId(null)
                setHoveredTop(0)
              }}
              onMouseMove={(e) => {
                if (hoveredId === fight.id) {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  setHoveredTop(Math.max(0, Math.min(e.clientY - rect.top, rect.height)))
                }
              }}
            >
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteFight(fight.id)
                }}
                title="Delete this fight"
              >
                🗑️
              </button>

              <div className="fight-names">
                <span className="competitor-name">
                  {winner === fight.competitorName
                    ? (<span className="winner-indicator">{fight.competitorName}</span>)
                    : (fight.competitorName)
                  }
                </span>

                <span className="vs">vs</span>

                <span className="opponent-name">
                  {winner === fight.opponentName
                    ? (<span className="winner-indicator">{fight.opponentName}</span>)
                    : (fight.opponentName)
                  }
                </span>
              </div>
              <div className="fight-stats">
                <span className="damage-dealt">
                  <strong>dmg</strong>: {fight.data.competitor.damageDealt} <strong>vs</strong> {fight.data.opponent.damageDealt}
                </span>
                <span className="attack-count">
                  <strong>hits</strong>: {fight.data.competitor.attackCount} <strong>vs</strong> {fight.data.opponent.attackCount}
                </span>
              </div>

              {hoveredId === fight.id && (
                <HistoryTooltip
                  fightData={fight.data}
                  winner={winner}
                  style={{ right: 8, ...( { ['--tooltip-top' as any]: `${hoveredTop}px` } as React.CSSProperties ) }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FightHistory


