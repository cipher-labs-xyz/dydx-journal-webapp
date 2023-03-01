import styles from "./Stats.module.css";
import { Stats as TStats } from "../../helpers/dataProcessing";
import { formatTime, formatCurrency, formatNumber } from "../../helpers/formatting";
import { getMaxSession } from "../../helpers/util";

type Props = {
  stats: TStats;
};

const Stats = ({ stats }: Props) => {
  const averageWin = stats.win.total / stats.win.count;
  const averageLoss = Math.abs(stats.loss.total / stats.loss.count);
  return (
    <div className={styles.stats}>
      <div>
        <h3>Largest Win</h3>
        <h2>{formatCurrency(stats.win.largest)}</h2>
      </div>
      <div>
        <h3>Largest Loss</h3>
        <h2>{formatCurrency(stats.loss.largest)}</h2>
      </div>
      <div>
        <h3>Average Win</h3>
        <h2>{formatCurrency(averageWin)}</h2>
      </div>
      <div>
        <h3>Average Loss</h3>
        <h2>{formatCurrency(averageLoss)}</h2>
      </div>
      <div>
        <h3>Avg. Hold Time</h3>
        <h2>{formatTime(stats.count && stats.holdingTime / stats.count)}</h2>
      </div>
      <div>
        <h3>Most Profitable Session</h3>
        <h2 style={{ textTransform: "capitalize" }}>{getMaxSession(stats.sessions)}</h2>
      </div>
      <div>
        <h3>Profit Factor</h3>
        <h2>{formatNumber(stats.win.total / Math.abs(stats.loss.total))}</h2>
      </div>
      <div>
        <h3>Payoff Ratio</h3>
        <h2>{formatNumber(averageWin / averageLoss)}</h2>
      </div>
      <div>
        <h3>Avg. Hold Time / Winners</h3>
        <h2>{formatTime(stats.win.count && stats.win.holdingTime / stats.win.count)}</h2>
      </div>
      <div>
        <h3>Trading Expectancy</h3>
        <h2>{formatCurrency(stats.count && stats.pnl / stats.count)}</h2>
      </div>
      <div>
        <h3>Largest # Consec. Wins</h3>
        <h2>{stats.win.largestConsecutive}</h2>
      </div>
      <div>
        <h3>Largest # Consec. Losses</h3>
        <h2>{stats.loss.largestConsecutive}</h2>
      </div>
      <div>
        <h3>Avg. Hold Time / Losers</h3>
        <h2>{formatTime(stats.loss.count && stats.loss.holdingTime / stats.loss.count)}</h2>
      </div>
      <div>
        <h3>Maximum Drawdown</h3>
        <h2>{formatCurrency(stats.maxDrawdown == -Infinity ? 0 : stats.maxDrawdown)}</h2>
      </div>
      <div>
        <h3>Avg # Consec. Wins</h3>
        <h2>{formatNumber(stats.win.averageConsecutive)}</h2>
      </div>
      <div>
        <h3>Avg # Consec. Losses</h3>
        <h2>{formatNumber(stats.loss.averageConsecutive)}</h2>
      </div>
    </div>
  );
};

export default Stats;
