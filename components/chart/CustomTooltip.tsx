import { RefObject } from "react";
import { createPortal } from "react-dom";
import { TooltipProps } from "recharts";
import { Position } from "../../helpers/dataProcessing";
import { formatCurrency } from "../../helpers/formatting";
import styles from "./Chart.module.css";

const CustomTooltip = ({ pnl, label }: { pnl: number; label: string }) => (
  <>
    <small style={{ display: "block", marginBottom: "20px" }}>{label}</small>
    <h2 className={pnl < 0 ? styles.down : styles.up}>{formatCurrency(Math.abs(pnl))}</h2>
  </>
);

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
  if (!tooltipRef.current || !data.length) return null;
  if (active && payload && payload.length && payload[0].value != undefined) {
    return createPortal(
      <CustomTooltip
        pnl={payload[0].value || 0}
        label={new Date(label).toLocaleString("en-US", timeFormatOptions)}
      />,
      tooltipRef.current
    );
  }
  if (referenced)
    return createPortal(
      <CustomTooltip
        pnl={referenced?.runningPnl || 0}
        label={(referenced.closedAt || referenced.createdAt).toLocaleString("en-US", timeFormatOptions)}
      />,
      tooltipRef.current
    );
  return createPortal(
    <CustomTooltip
      label={(data[data.length - 1].closedAt || data[data.length - 1].createdAt)
        .toLocaleString("en-US", timeFormatOptions)
        }
      pnl={data[data.length - 1].runningPnl}
    />,
    tooltipRef.current
  );
};

export default Tooltip;
