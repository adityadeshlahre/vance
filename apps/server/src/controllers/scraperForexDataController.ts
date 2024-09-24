import { Request, Response } from 'express';
import { getPeriodTimestamps } from './../utils/getPeriodTimestamps';
import { historicalDataStore } from './../store/dataStore';

interface ForexDataRequest {
  from: string;
  to: string;
  period: string;
}

export const scrapeForexData = async (
  req: Request<unknown, unknown, ForexDataRequest>,
  res: Response,
) => {
  const { from, to, period } = req.body;

  if (!from || !to || !period) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const { from: startDate, to: endDate } = getPeriodTimestamps(period);
    console.log(startDate, endDate);

    const historicalData =
      historicalDataStore[`${from}${to}`]?.filter((data) => {
        return (
          data.date !== null && data.date >= startDate && data.date <= endDate
        );
      }) || [];

    if (historicalData.length === 0) {
      return res
        .status(404)
        .json({ message: 'No data found for the given period.' });
    }

    res.status(200).json(historicalData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching historical data' });
  }
};
