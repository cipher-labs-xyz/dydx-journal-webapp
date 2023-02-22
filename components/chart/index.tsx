import { PositionStatus } from "@dydxprotocol/v3-client";
import { RefObject } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { Period } from "../../config/defaults";
import { Position } from "../../helpers/dataProcessing";
import styles from "./Chart.module.css";
import CustomTooltip from "./CustomTooltip";

type Props = {
  data: Position[];
  period: Period;
  tooltipRef: RefObject<HTMLDivElement>;
  referenced: Position | undefined;
};

const addBounds = (data: Position[], period: Period) : {
  runningPnl: number;
  runningInvested: number;
  closedAt?: Date;
  createdAt: Date;
}[] => {
  const upper = new Date();
  const lower = new Date(upper);
  lower.setDate(lower.getDate() - period);
  if (!data.length) return [{ runningPnl: 0, runningInvested: 0, closedAt: lower, createdAt: lower }, { runningPnl: 0, runningInvested: 0, closedAt: upper, createdAt: upper }];
  return [
    { runningPnl: 0, runningInvested: 0, closedAt: lower, createdAt: lower },
    ...data,
    { runningPnl: data[data.length - 1].runningPnl, runningInvested: data[data.length - 1].runningInvested, closedAt: upper, createdAt: upper },
  ];
};

const Chart = ({ period, data, tooltipRef, referenced }: Props) => {
  const tickFormatter = (value: number) => {
    if (period == 1)
      return new Date(value).toLocaleTimeString(undefined, { hour12: true, hour: "numeric", minute: "2-digit" });
    if (period == 7)
      return new Date(value).toLocaleString("en-US", { hour12: true, weekday: "short", hour: "numeric" });
    return new Date(value).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" });
  };

  const hist = addBounds(data.filter((a) => a.status != PositionStatus.OPEN), period);
  const color = hist[hist.length -1].runningPnl < 0 ? "var(--color-red)" : "var(--color-green)"

  return (
    <ResponsiveContainer className={styles.chart} width="100%" height={350}>
      <LineChart data={hist} margin={{ top: 5 }}>
        
        <YAxis
          hide
          domain={([dataMin, dataMax]) => {
            const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax)) * 1.1;
            return [-absMax, absMax];
          }}
        />
        <XAxis
          dataKey={(d: Position) => d.closedAt?.getTime() || d.createdAt.getTime()}
          type="number"
          domain={["dataMin", "dataMax"]}
          tickCount={8}
          interval="preserveStartEnd"
          mirror
          axisLine={false}
          tickFormatter={tickFormatter}
          stroke="#6F6E84"
        />
        <Tooltip
          content={<CustomTooltip data={data} tooltipRef={tooltipRef} referenced={referenced} />}
          cursor={{ stroke: "rgb(247, 247, 247, 0.3)" }}
        />
        <ReferenceLine y={0} stroke="rgb(247, 247, 247, 0.3)" strokeDasharray="3 3" />
        {referenced ? (
          <>
            <ReferenceLine
              x={referenced.closedAt?.getTime() || referenced.createdAt.getTime()}
              stroke="rgb(247, 247, 247, 0.3)"
            />
            <ReferenceDot
              x={referenced.closedAt?.getTime() || referenced.createdAt.getTime()}
              y={referenced.runningPnl}
              r={4}
              fill={color}
              stroke="none"
            />
          </>
        ) : null}
        <Line
          type="linear"
          dataKey="runningPnl"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ stroke: "none" }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
