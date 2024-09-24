export const getPeriodTimestamps = (
  period: string,
): { from: number; to: number } => {
  const now = new Date();
  const currentTime = Math.floor(now.getTime() / 1000);

  const match = period.match(/^(\d+)([WMY])$/);
  if (!match || !match[1] || !match[2]) {
    throw new Error('Invalid period format');
  }

  const amount = parseInt(match[1]!, 10) as number;
  const unit = match[2]!;

  let from;
  let startOfMonth;
  let startOfYear;

  switch (unit) {
    case 'D':
      from = currentTime - amount * 24 * 60 * 60;
      break;
    case 'W':
      from = currentTime - amount * 7 * 24 * 60 * 60;
      break;
    case 'M':
      startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() - amount,
        1,
      );
      from = Math.floor(startOfMonth.getTime() / 1000);
      break;
    case 'Y':
      startOfYear = new Date(now.getFullYear() - amount, 0, 1);
      from = Math.floor(startOfYear.getTime() / 1000);
      break;
    default:
      throw new Error(`Unsupported time unit: ${unit}`);
  }

  const endOfCurrentDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  const to = Math.floor(endOfCurrentDay.getTime() / 1000);

  return {
    from,
    to,
  };
};
