import { RefObject } from "react";
import { createPortal } from "react-dom";
import { TooltipProps } from "recharts";
import { Position } from "../../helpers/dataProcessing";
import { formatCurrency, formatNumber } from "../../helpers/formatting";
import { ArrowUp, ArrowDown } from "../../svgs";
import styles from "./Chart.module.css";

const symbols = {
  up: <ArrowUp width={8} height={8} />,
  down: <ArrowDown width={8} height={8}  />,
  zero: <span style={{ fontWeight: "bold", fontSize: "1.4em", lineHeight: "0" }}>-</span>
}

const CustomTooltip = ({ pnl, label, invested }: { pnl: number; label: string; invested: number }) => {
  const pnlPercent = invested == 0 ? 0 : Math.abs((pnl / invested) * 100);
  return (
    <>
      <small style={{ display: "block", marginBottom: "10px" }}>{label}</small>
        <h2>{formatCurrency(Math.abs(pnl))}</h2>
        <small className={pnl < 0 ? styles.down : pnl > 0 ? styles.up : styles.zero} style={{ display: "flex", marginTop: "8px", alignItems: "center", gap: "6px" }}>
          {pnl < 0 ? symbols.down : pnl > 0 ? symbols.up : symbols.zero}
          <span>{pnlPercent == 0 ? 0 : pnlPercent < 0.01 ? "<0.01" : formatNumber(pnlPercent)}%</span>
        </small>
    </>
  );
};

const timeFormatOptions: Intl.DateTimeFormatOptions = {
  hour12: true,
  month: "short",
  year: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

const Tooltip = ({
  active,
  payload,
  label,
  tooltipRef,
  data,
  referenced,
}: TooltipProps<number, number> & {
  data: Position[];
  tooltipRef: RefObject<HTMLDivElement>;
  referenced: Position | undefined;
}) => {
  if (!tooltipRef.current) return null;
  if (!data.length) return createPortal(<CustomTooltip pnl={0} invested={0} label={new Date(label).toLocaleString("en-US", timeFormatOptions)} />, tooltipRef.current);
  if (active && payload && payload.length && payload[0].value != undefined) {
    return createPortal(
      <CustomTooltip pnl={payload[0].value || 0} invested={payload[0].payload.runningInvested} label={new Date(label).toLocaleString("en-US", timeFormatOptions)} />,
      tooltipRef.current
    );
  }
  if (referenced)
    return createPortal(
      <CustomTooltip
        pnl={referenced?.runningPnl || 0}
        invested={referenced?.runningInvested || 0}
        label={(referenced.closedAt || referenced.createdAt).toLocaleString("en-US", timeFormatOptions)}
      />,
      tooltipRef.current
    );
  return createPortal(
    <CustomTooltip
      label={(data[data.length - 1].closedAt || data[data.length - 1].createdAt).toLocaleString("en-US", timeFormatOptions)}
      pnl={data[data.length - 1].runningPnl}
      invested={data[data.length - 1].runningInvested}
    />,
    tooltipRef.current
  );
};

export default Tooltip;
