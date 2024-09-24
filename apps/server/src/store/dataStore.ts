export interface HistoricalData {
  date: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export const historicalDataStore: { [key: string]: HistoricalData[] } = {};
