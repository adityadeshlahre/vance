import puppeteer from 'puppeteer';

interface HistoricalData {
  date: string | null;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export const scrapeHistoricalData = async (
  quote: string,
  from: number,
  to: number,
): Promise<HistoricalData[]> => {
  const url = `https://finance.yahoo.com/quote/${
    quote
  }%3DX/history/?period1=${from}&period2=${to}`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  const data: HistoricalData[] = await page.evaluate(() => {
    const rows = document.querySelectorAll('table tbody tr');
    const result: HistoricalData[] = [];

    rows.forEach((row) => {
      const cols = row.querySelectorAll('td');

      if (cols.length < 7) {
        return;
      }

      const date = cols[0]?.textContent?.trim() || null;
      const open =
        parseFloat(cols[1]?.textContent?.replace(',', '') || '0') || null;
      const high =
        parseFloat(cols[2]?.textContent?.replace(',', '') || '0') || null;
      const low =
        parseFloat(cols[3]?.textContent?.replace(',', '') || '0') || null;
      const close =
        parseFloat(cols[4]?.textContent?.replace(',', '') || '0') || null;
      const volume =
        parseInt(cols[6]?.textContent?.replace(',', '') || '0', 10) || null;

      result.push({ date, open, high, low, close, volume });
    });

    return result;
  });

  await browser.close();

  return data;
};
