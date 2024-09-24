import cron from 'node-cron';
import { scrapeHistoricalData } from './../service/scraperService';
import { getPeriodTimestamps } from './../utils/getPeriodTimestamps';
import { prisma } from '@repo/db/prisma';
const currencyPairs = [
  { from: 'GBP', to: 'INR', periods: ['1W', '1M', '3M', '6M', '1Y'] },
  { from: 'AED', to: 'INR', periods: ['1W', '1M', '3M', '6M', '1Y'] },
];

const triggerScraping = async () => {
  for (const { from, to, periods } of currencyPairs) {
    for (const period of periods) {
      try {
        const { from: startTime, to: endTime } = getPeriodTimestamps(period);
        const scrapedData = await scrapeHistoricalData(
          `${from}${to}`,
          startTime,
          endTime,
        );

        const insertPromises = scrapedData.map((item) => {
          const formattedDate = item.date
            ? Math.floor(new Date(Date.parse(item.date)).getTime() / 1000)
            : null;
          return prisma.historicalData.create({
            data: {
              date: formattedDate || null,
              open: item.open ?? 0,
              high: item.high ?? 0,
              low: item.low ?? 0,
              close: item.close ?? 0,
              volume: item.volume ?? 0,
              currencyPair: `${from}${to}`,
            },
          });
        });

        await Promise.all(insertPromises);
      } catch (error) {
        console.error(
          `Error scraping ${from}-${to} for period ${period}:`,
          error,
        );
      }
    }
  }
};

cron.schedule('0 0 * * *', () => {
  console.log('Triggering scraping job...');
  triggerScraping()
    .then(() => console.log('Scraping job completed.'))
    .catch((error) => console.error('Error in scraping job:', error));
});
