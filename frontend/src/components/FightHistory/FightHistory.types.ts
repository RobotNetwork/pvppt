import { FightData, FightHistoryItem } from '../../types'

export interface FightHistoryProps {
  fights: FightHistoryItem[];
  selectedFight: FightHistoryItem | null;
  onFightSelect: (fight: FightHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteFight: (fightId: number) => void;
  getWinner: (fight: FightData) => string | null;
  duplicateFightId: number | null;
}


