import { FightData } from '../../types'
import { FightDataParser } from '../../utils/fightDataParser'

export interface FightMetricsDisplayProps {
	fightData: FightData;
	parser: FightDataParser;
	winner: string | null;
}


