import { Request, Response } from 'express';
import { scrapeHistoricalData } from './../service/scraperService';
import { HistoricalData, historicalDataStore } from './../store/dataStore';

export const scrapeYahooFinance = async (req: Request, res: Response) => {
  const { quote, from, to } = req.query;

  if (!quote || !from || !to) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const data = await scrapeHistoricalData(
      String(quote),
      Number(from),
      Number(to),
    );

    console.log(data);
    const key: string = String(quote);
    if (!historicalDataStore[key]) {
      historicalDataStore[key] = [];
    }

    //@ts-expect-error : void error
    data.forEach((item: HistoricalData) => {
      const formattedDate = item.date
        ? Math.floor(new Date(item.date).getTime() / 1000)
        : null; //    item.date = 'May 8, 2024' -----> 1727202600 this should be saved something like this

      historicalDataStore[key]?.push({
        date: formattedDate || null,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume !== null ? item.volume : 0,
      });
    });

    res.status(200).json({ message: 'Data scraped and saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error scraping data' });
  }
};
