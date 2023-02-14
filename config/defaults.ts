import { Market } from "@dydxprotocol/v3-client";

export const timeOptions: Intl.DateTimeFormatOptions = {
  hour12: true,
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

export const csvHeaders = [
  { label: "Created Time", key: "createdAt" },
  { label: "Market", key: "market" },
  { label: "Side", key: "side" },
  { label: "Entry Price (avg)", key: "entryPrice" },
  { label: "Exit Price (avg)", key: "exitPrice" },
  { label: "Inc. Trades (sum)", key: "sumOpen" },
  { label: "Dec. Trades (sum)", key: "sumClose" },
  { label: "Status", key: "status" },
  { label: "Profit/Loss", key: "pnl" },
  { label: "Running P/L", key: "runningPnl" },
  // { label: "", key: ""},
  // { label: "USER", key: "" }
];

export const defaultStats = {
  count: 0,
  holdingTime: 0,
  maxDrawdown: 0,
  pnl: 0,
  loss: { count: 0, total: 0, holdingTime: 0, averageConsecutive: 0, largestConsecutive: 0, largest: 0 },
  win: { count: 0, total: 0, holdingTime: 0, averageConsecutive: 0, largestConsecutive: 0, largest: 0 },
  sessions: {
    american: 0,
    asian: 0,
    european: 0,
  },
};

export const defaultMarkets: Market[] = [
  Market.BTC_USD,
  Market.ETH_USD,
  Market.LINK_USD,
  Market.AAVE_USD,
  Market.UNI_USD,
  Market.SUSHI_USD,
  Market.SOL_USD,
  Market.YFI_USD,
  Market.ONEINCH_USD,
  Market.AVAX_USD,
  Market.SNX_USD,
  Market.CRV_USD,
  Market.UMA_USD,
  Market.DOT_USD,
  Market.DOGE_USD,
  Market.MATIC_USD,
  Market.MKR_USD,
  Market.FIL_USD,
  Market.ADA_USD,
  Market.ATOM_USD,
  Market.COMP_USD,
  Market.BCH_USD,
  Market.LTC_USD,
  Market.EOS_USD,
  Market.ALGO_USD,
  Market.ZRX_USD,
  Market.XMR_USD,
  Market.ZEC_USD,
  Market.ENJ_USD,
  Market.ETC_USD,
  Market.XLM_USD,
  Market.TRX_USD,
  Market.XTZ_USD,
  Market.ICP_USD,
  Market.RUNE_USD,
  Market.LUNA_USD,
  Market.NEAR_USD,
  Market.CELO_USD,
];

export type Period = 1 | 7 | 30 | 90;

export const periods: Record<Period, string> = {
  1: "24 HOURS",
  7: "7 DAYS",
  30: "30 DAYS",
  90: "90 DAYS",
};

export type TPosition = "LONG" | "SHORT";

export type Filters = {
  period: Period;
  market?: Market;
  position?: TPosition;
};
