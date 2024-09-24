import { Request, Response } from 'express';
import { scrapeHistoricalData } from './../service/scraperService';
import { prisma } from '@repo/db/prisma';

interface HistoricalData {
  date: string | null;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

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

    const insertPromises = data.map((item: HistoricalData) => {
      const formattedDate = item.date
        ? Math.floor(new Date(Date.parse(item.date)).getTime() / 1000)
        : null;

      return prisma.historicalData.create({
        data: {
          date: formattedDate || null,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume !== null ? item.volume : 0,
          currencyPair: quote as string,
        },
      });
    });

    await Promise.all(insertPromises);

    res.status(200).json({ message: 'Data scraped and saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error scraping data' });
  }
};
