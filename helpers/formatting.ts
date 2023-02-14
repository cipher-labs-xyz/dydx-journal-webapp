export const formatTime = (period: number) => {
  // Calculate the number of days by dividing the difference in milliseconds by the number of milliseconds in a day
  const days = Math.floor(period / (1000 * 60 * 60 * 24));
  // Calculate the number of hours by dividing the remaining number of milliseconds by the number of milliseconds in an hour
  const hours = Math.floor((period % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  // Calculate the number of minutes by dividing the remaining number of milliseconds by the number of milliseconds in a minute
  const minutes = Math.floor((period % (1000 * 60 * 60)) / (1000 * 60));
  return (days ? `${days}d ` : "") + (hours ? `${hours}h ` : "") + `${minutes}m`;
};

export const trimCurrency = (s: string | undefined) => {
  if (!s) return undefined;
  const abs = s.charAt(0) == "-" ? s.slice(1) : s;
  return abs.replace(/(\.[0-9]{2,}?)0+$/, "$1");
};

const currencyFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const numberFormat = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatCurrency = (n: number) => n ? currencyFormat.format(n) : "$0.00"
export const formatNumber = (n: number) => numberFormat.format(n)

export const formatDiscount = (s: string) => 100 - parseFloat(s) * 100