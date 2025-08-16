import React from 'react'
import type { FightData } from '../../types'
import { advancedAnalysisStyles } from './AdvancedAnalysis.styles'

export interface AdvancedAnalysisProps {
  fightData: FightData | null
  showSpike?: boolean
  onShowSpikeChange?: (value: boolean) => void
}

type SpikeSeries = {
  ticks: number[]
  competitor: number[]
  opponent: number[]
  competitorCumulative: number[]
  opponentCumulative: number[]
}

export const computeSpikeSeries = (fightData: FightData | null): SpikeSeries | null => {
  if (!fightData) return null

  const cEntries = fightData.competitor.ticks
  const oEntries = fightData.opponent.ticks

  if ((!cEntries || cEntries.length === 0) && (!oEntries || oEntries.length === 0)) {
    return { ticks: [], competitor: [], opponent: [], competitorCumulative: [], opponentCumulative: [] }
  }

  const tickSet = new Set<number>()
  for (const e of cEntries) tickSet.add(e.tick)
  for (const e of oEntries) tickSet.add(e.tick)

  const ticks = Array.from(tickSet).sort((a, b) => a - b)

  const tickToCompDamage = new Map<number, number>()
  const tickToOppDamage = new Map<number, number>()

  for (const e of cEntries) {
    const prev = tickToCompDamage.get(e.tick) || 0
    const dmg = e.recorded?.dmg || 0
    tickToCompDamage.set(e.tick, prev + dmg)
  }
  for (const e of oEntries) {
    const prev = tickToOppDamage.get(e.tick) || 0
    const dmg = e.recorded?.dmg || 0
    tickToOppDamage.set(e.tick, prev + dmg)
  }

  const competitor = ticks.map(t => tickToCompDamage.get(t) || 0)
  const opponent = ticks.map(t => tickToOppDamage.get(t) || 0)

  // cumulative totals by tick index
  const competitorCumulative: number[] = []
  const opponentCumulative: number[] = []
  competitor.reduce((acc, val, i) => {
    const sum = acc + val
    competitorCumulative[i] = sum
    return sum
  }, 0)
  opponent.reduce((acc, val, i) => {
    const sum = acc + val
    opponentCumulative[i] = sum
    return sum
  }, 0)

  return { ticks, competitor, opponent, competitorCumulative, opponentCumulative }
}

export const SpikeGraph: React.FC<{ series: SpikeSeries; competitorName: string; opponentName: string }> = ({ series, competitorName, opponentName }) => {
  const barWidth = 8
  const barGap = 4
  const chartHeight = 120
  const paddingLeft = 18
  const paddingRight = 6
  const paddingBottom = 16
  const paddingTop = 6
  const innerHeight = chartHeight - paddingTop - paddingBottom
  const width = paddingLeft + paddingRight + (series.ticks.length * (barWidth + barGap))

  const maxBarValue = Math.max(1, ...series.competitor, ...series.opponent)
  const maxLineValue = Math.max(1, ...series.competitorCumulative, ...series.opponentCumulative)

  const scaleBarY = (v: number) => (v / maxBarValue) * innerHeight
  const scaleLineY = (v: number) => (v / maxLineValue) * innerHeight

  const buildLinePath = (values: number[]): string => {
    if (values.length === 0) return ''
    return values.map((v, i) => {
      const x = paddingLeft + i * (barWidth + barGap) + Math.floor(barWidth / 2)
      const y = chartHeight - paddingBottom - scaleLineY(v)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  const compLine = buildLinePath(series.competitorCumulative)
  const oppLine = buildLinePath(series.opponentCumulative)

  return (
    <div className="spike-graph-wrapper">
      <svg width={width} height={chartHeight} className="spike-graph" role="img" aria-label="Damage per tick spike graph">
        <g>
          {/* X axis tick labels */}
          <g transform={`translate(0, ${chartHeight - paddingBottom})`}>
            {series.ticks.map((t, i) => {
              const x = paddingLeft + i * (barWidth + barGap)
              return (
                <text key={`tick-${t}`} x={x + Math.floor(barWidth / 2)} y={12} textAnchor="middle" className="tick-text">{t}</text>
              )
            })}
          </g>

          {/* Bars */}
          <g transform={`translate(0, ${chartHeight - paddingBottom})`}>
            {series.ticks.map((_, i) => {
              const x = paddingLeft + i * (barWidth + barGap)
              const compH = scaleBarY(series.competitor[i])
              const oppH = scaleBarY(series.opponent[i])
              return (
                <g key={i} transform="scale(1, -1)">
                  <rect x={x} y={0} width={Math.floor(barWidth / 2)} height={compH} className="bar-competitor">
                    <title>{`${competitorName}: tick ${series.ticks[i]} → ${series.competitor[i]}`}</title>
                  </rect>
                  <rect x={x + Math.floor(barWidth / 2)} y={0} width={Math.ceil(barWidth / 2)} height={oppH} className="bar-opponent">
                    <title>{`${opponentName}: tick ${series.ticks[i]} → ${series.opponent[i]}`}</title>
                  </rect>
                </g>
              )
            })}
          </g>

          {/* Cumulative lines */}
          <path d={compLine} className="line-competitor" />
          <path d={oppLine} className="line-opponent" />

          {/* Points for hoverable values on cumulative lines */}
          {series.ticks.map((t, i) => {
            const cxComp = paddingLeft + i * (barWidth + barGap) + Math.floor(barWidth / 2)
            const cyComp = chartHeight - paddingBottom - scaleLineY(series.competitorCumulative[i])
            const cxOpp = cxComp
            const cyOpp = chartHeight - paddingBottom - scaleLineY(series.opponentCumulative[i])
            return (
              <g key={`pt-${t}`}>
                <circle cx={cxComp} cy={cyComp} r={2.5} className="point-competitor">
                  <title>{`${competitorName} cumulative @ tick ${t}: ${series.competitorCumulative[i]}`}</title>
                </circle>
                <circle cx={cxOpp} cy={cyOpp} r={2.5} className="point-opponent">
                  <title>{`${opponentName} cumulative @ tick ${t}: ${series.opponentCumulative[i]}`}</title>
                </circle>
              </g>
            )
          })}

          {/* Axis labels */}
          <text x={paddingLeft} y={12} className="axis-label">Ticks</text>
        </g>
      </svg>
      <div className="legend">
        <span className="legend-box competitor" />
        <span>{competitorName}</span>
        <span className="legend-box opponent" />
        <span>{opponentName}</span>
      </div>
    </div>
  )
}

const AdvancedAnalysis: React.FC<AdvancedAnalysisProps> = ({ showSpike = false, onShowSpikeChange }) => {
  const [expanded, setExpanded] = React.useState<boolean>(false)

  return (
    <div className="advanced-analysis">
      <style>{advancedAnalysisStyles}</style>
      <div className="analysis-header">
        <h3>Advanced Analysis</h3>
        <button className="toggle-btn" onClick={() => setExpanded(v => !v)} aria-expanded={expanded} aria-controls="advanced-analysis-body">
          {expanded ? 'Hide' : 'Show'}
        </button>
      </div>
      <div id="advanced-analysis-body" hidden={!expanded}>
        <div className="analysis-controls">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={!!showSpike}
              onChange={(e) => onShowSpikeChange?.(e.target.checked)}
            />
            <span>Damage per tick + cumulative</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default AdvancedAnalysis


