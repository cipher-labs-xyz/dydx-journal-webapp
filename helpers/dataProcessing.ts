import { PositionResponseObject } from "@dydxprotocol/v3-client";

export type Sessions = {
  american: number;
  asian: number;
  european: number;
}

export type Stats = {
  win: {
    averageConsecutive: number;
    count: number;
    holdingTime: number;
    largest: number;
    largestConsecutive: number;
    total: number;
  };
  loss: {
    averageConsecutive: number;
    count: number;
    holdingTime: number;
    largest: number;
    largestConsecutive: number;
    total: number;
  };
  sessions: Sessions
  count: number;
  maxDrawdown: number;
  pnl: number;
  holdingTime: number;
};

export type Interim = {
  win: { run: number; runsCount: number };
  loss: { run: number; runsCount: number };
  prev?: "win" | "loss";
  peak: number;
};

export type Position = Omit<
  PositionResponseObject,
  "createdAt" | "closedAt" | "entryPrice" | "exitPrice" | "sumOpen" | "sumClose" | "realizedPnl" | "unrealizedPnl"
> & {
  closedAt?: Date;
  createdAt: Date;
  entryPrice: number;
  exitPrice: number;
  holdingTime: number;
  outcome: "win" | "loss" | "even" | "open";
  pnl: number;
  runningPnl: number;
  sumClose: number;
  sumOpen: number;
  unrealizedPnl: number;
  realizedPnl: number;
};

export const determineOutcome = (pnl: number) => {
  if (pnl > 0) return "win";
  if (pnl < 0) return "loss";
  return "even";
};

const detemineHoldingTime = (open: Date, closedAt: Date | undefined) => {
  const closed = closedAt || new Date();
  return Math.floor(closed.getTime() - open.getTime());
};

const updateSessions = (sessions: Sessions, pnl: number, time: Date) => {
  var hour = time.getUTCHours();
  if (hour >= 22 || hour < 8) sessions.asian += pnl;
  if (hour >= 8 && hour < 16) sessions.european += pnl;
  if (hour >= 13 && hour < 21) sessions.american += pnl;
}


const processPositions = (positions: PositionResponseObject[]) => {
  const stats: Stats = {
    win: {
      averageConsecutive: 0,
      count: 0,
      holdingTime: 0,
      largest: 0,
      largestConsecutive: 0,
      total: 0,
    },
    loss: {
      averageConsecutive: 0,
      count: 0,
      holdingTime: 0,
      largest: 0,
      largestConsecutive: 0,
      total: 0,
    },
    sessions: {
      american: 0,
      asian: 0,
      european: 0
    },
    count: positions.length,
    maxDrawdown: -Infinity,
    pnl: 0,
    holdingTime: 0,
  };

  const interim: Interim = {
    win: { run: 0, runsCount: 0 },
    loss: { run: 0, runsCount: 0 },
    peak: 0,
  };

  const updateWinLossStats = (type: "win" | "loss", holdingTime: number, pnl: number) => {
    stats[type].holdingTime += holdingTime;
    stats[type].count += 1;
    stats[type].total += pnl;
    const absPnl = Math.abs(pnl)
    if (absPnl > stats[type].largest) stats[type].largest = absPnl;
    interim[type].run += 1;
    if (interim[type].run > stats[type].largestConsecutive) stats[type].largestConsecutive = interim[type].run;
    if (interim.prev != type) {
      interim[type].runsCount += 1;
      interim[type == "win" ? "loss" : "win"].run = 0;
    }
    interim.prev = type;
  };

  const enhancedPositions: Position[] = positions.map((position) => {
    const createdAt = new Date(position.createdAt);
    const closedAt = position.closedAt ? new Date(position.closedAt) : undefined;

    // Convert for later formatting
    const sumOpen = position.sumOpen ? parseFloat(position.sumOpen) : 0
    const sumClose = position.sumClose ? parseFloat(position.sumClose) : 0
    const entryPrice = position.entryPrice ? parseFloat(position.entryPrice) : 0
    const exitPrice = position.exitPrice ? parseFloat(position.exitPrice) : 0
    const realizedPnl = position.realizedPnl ? parseFloat(position.realizedPnl) : 0
    const unrealizedPnl = position.unrealizedPnl ? parseFloat(position.unrealizedPnl) : 0
    const currency = { sumOpen, sumClose, entryPrice, exitPrice, realizedPnl, unrealizedPnl }

    const holdingTime = detemineHoldingTime(createdAt, closedAt);

    if (position.status == "OPEN")
      return {
        ...position,
        outcome: "open",
        holdingTime,
        createdAt,
        closedAt: undefined,
        pnl: 0,
        runningPnl: stats.pnl,
        ...currency
      };

    const outcome = determineOutcome(realizedPnl);
    stats.pnl += realizedPnl;
    if (closedAt) updateSessions(stats.sessions, realizedPnl, closedAt)
    if (outcome == "win" || outcome == "loss") updateWinLossStats(outcome, holdingTime, realizedPnl);

    //Calulate max drawdown
    if (stats.pnl > interim.peak) interim.peak = stats.pnl;
    if (outcome == "loss") {
      const drawdown = interim.peak - stats.pnl;
      if (drawdown > stats.maxDrawdown) stats.maxDrawdown = drawdown;
    }

    stats.holdingTime += holdingTime;

    return { ...position, outcome, holdingTime, createdAt, closedAt, pnl: realizedPnl, runningPnl: stats.pnl, ...currency };
  });

  stats.win.averageConsecutive = stats.win.count / interim.win.runsCount;
  stats.loss.averageConsecutive = stats.loss.count / interim.loss.runsCount;

  return { stats, enhancedPositions };
};

export default processPositions;
