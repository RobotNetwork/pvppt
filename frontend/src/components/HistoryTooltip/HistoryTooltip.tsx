import React from 'react'
import type { HistoryTooltipProps } from './HistoryTooltip.types'
import { historyTooltipStyles } from './HistoryTooltip.styles'
import { FightDataParser } from '../../utils/fightDataParser'

const HistoryTooltip: React.FC<HistoryTooltipProps> = ({ fightData, winner, style }) => {
	const parser = React.useMemo(() => new FightDataParser(), [])
	const competitor = parser.formatMetrics(fightData.competitor, true, fightData.opponent)
	const opponent = parser.formatMetrics(fightData.opponent, false, fightData.competitor)

	const parsePercent = (pct: string): number => {
		const m = pct.match(/\(([^)]+)%\)/)
		return m ? parseFloat(m[1]) : 0
	}

	const attackDiff = Math.abs(fightData.competitor.attackCount - fightData.opponent.attackCount)
	const damageDiff = Math.abs(fightData.competitor.damageDealt - fightData.opponent.damageDealt)
	const deservedDiff = Math.abs(fightData.competitor.deservedDamage - fightData.opponent.deservedDamage)
	const koCountDiff = Math.abs(competitor.koChances.count - opponent.koChances.count)

	return (
		<div className="history-tooltip" style={style}>
			<style>{historyTooltipStyles}</style>
			<div className="tooltip-inner">
				<div className="metrics">
					<div className={`fighter ${winner === competitor.name ? 'winner' : 'loser'}`}>						
						<div className="row"><span className="value">{competitor.offPrayStats}{attackDiff>0 && fightData.competitor.attackCount>fightData.opponent.attackCount && (<span className="diff pos">+{attackDiff}</span>)}</span></div>
						<div className="row"><span className="value">{competitor.deservedDamage}{deservedDiff>0 && fightData.competitor.deservedDamage>fightData.opponent.deservedDamage && (<span className="diff pos">+{parser.formatNumber(deservedDiff)}</span>)}</span></div>
						<div className="row"><span className="value">{competitor.damageDealt}{damageDiff>0 && fightData.competitor.damageDealt>fightData.opponent.damageDealt && (<span className="diff pos">+{damageDiff}</span>)}</span></div>
						<div className="row"><span className="value">{competitor.magicStats.split(' ')[0]}{parsePercent(competitor.magicStats)>parsePercent(opponent.magicStats) && (<span className="diff pos">{competitor.magicStats.split(' ')[1]}</span>)}{parsePercent(competitor.magicStats)<parsePercent(opponent.magicStats) && (<span className="diff neg">{competitor.magicStats.split(' ')[1]}</span>)}</span></div>
						<div className="row"><span className="value">{competitor.offensivePrayStats}</span></div>
						<div className="row"><span className="value">{competitor.hpHealed}</span></div>
						<div className="row"><span className="value">{competitor.robeHitStats.split(' ')[0]}{parsePercent(competitor.robeHitStats)<parsePercent(opponent.robeHitStats) && (<span className="diff pos">{competitor.robeHitStats.split(' ')[1]}</span>)}{parsePercent(competitor.robeHitStats)>parsePercent(opponent.robeHitStats) && (<span className="diff neg">{competitor.robeHitStats.split(' ')[1]}</span>)}</span></div>
						<div className="row"><span className="value">{competitor.ghostBarrageStats}</span></div>
						<div className="row"><span className="value">{competitor.koChances.count} ({competitor.koChances.overallProbability>0 ? (competitor.koChances.overallProbability*100).toFixed(1) : '0.0'}%){koCountDiff>0 && competitor.koChances.count>opponent.koChances.count && (<span className="diff pos">+{koCountDiff}</span>)}</span></div>
					</div>
					<div className={`fighter ${winner === opponent.name ? 'winner' : 'loser'}`}>
						<div className="row"><span className="value">{opponent.offPrayStats}{attackDiff>0 && fightData.opponent.attackCount>fightData.competitor.attackCount && (<span className="diff pos">+{attackDiff}</span>)}</span></div>
						<div className="row"><span className="value">{opponent.deservedDamage}{deservedDiff>0 && fightData.opponent.deservedDamage>fightData.competitor.deservedDamage && (<span className="diff pos">+{parser.formatNumber(deservedDiff)}</span>)}</span></div>
						<div className="row"><span className="value">{opponent.damageDealt}{damageDiff>0 && fightData.opponent.damageDealt>fightData.competitor.damageDealt && (<span className="diff pos">+{damageDiff}</span>)}</span></div>
						<div className="row"><span className="value">{opponent.magicStats.split(' ')[0]}{parsePercent(opponent.magicStats)>parsePercent(competitor.magicStats) && (<span className="diff pos">{opponent.magicStats.split(' ')[1]}</span>)}{parsePercent(opponent.magicStats)<parsePercent(competitor.magicStats) && (<span className="diff neg">{opponent.magicStats.split(' ')[1]}</span>)}</span></div>
						<div className="row"><span className="value">{opponent.offensivePrayStats}</span></div>
						<div className="row"><span className="value">{opponent.hpHealed}</span></div>
						<div className="row"><span className="value">{opponent.robeHitStats.split(' ')[0]}{parsePercent(opponent.robeHitStats)<parsePercent(competitor.robeHitStats) && (<span className="diff pos">{opponent.robeHitStats.split(' ')[1]}</span>)}{parsePercent(opponent.robeHitStats)>parsePercent(competitor.robeHitStats) && (<span className="diff neg">{opponent.robeHitStats.split(' ')[1]}</span>)}</span></div>
						<div className="row"><span className="value">{opponent.ghostBarrageStats}</span></div>
						<div className="row"><span className="value">{opponent.koChances.count} ({opponent.koChances.overallProbability>0 ? (opponent.koChances.overallProbability*100).toFixed(1) : '0.0'}%){koCountDiff>0 && opponent.koChances.count>competitor.koChances.count && (<span className="diff pos">+{koCountDiff}</span>)}</span></div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HistoryTooltip



