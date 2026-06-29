export type ActionType = 'prick' | 'worse' | 'heels' | 'reset' | 'custom' | 'heels_fine';

export interface HistoryItem {
  id: string;
  type: ActionType;
  emoji: string;
  text: string;
  amount: number; // 0 for heels / reset
  timestamp: number; // Epoch timestamp in ms
}
