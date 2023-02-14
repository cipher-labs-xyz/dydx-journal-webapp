import { CircularProgress } from "@mui/material";
import { RefObject } from "react";
import styles from "./Stats.module.css";

type Props = {
  wins: number;
  losses: number;
  count: number;
  noPadding?: boolean;
};

const MenuStats = ({ wins, losses, count, noPadding = false }: Props) => {
  const winPercent = count && Math.round((wins / count) * 100);
  const lossPercent = count && Math.round((losses / count) * 100);
  return (
    <div className={styles.menustats} style={noPadding ? { padding: 0 } : undefined }>
      <div className={styles.progress}>
        <CircularProgress color="secondary" variant="determinate" value={100} thickness={5} size={85} />
        <CircularProgress
          className={styles.circle}
          color="success"
          variant="determinate"
          value={winPercent}
          thickness={5}
          size={85}
        />
        <div className={styles.circletext}>
          <h2>{winPercent}</h2>
          <small>WIN%</small>
        </div>
      </div>
      <div className={styles.progress}>
        <CircularProgress color="secondary" variant="determinate" value={100} thickness={5} size={85} />
        <CircularProgress
          className={styles.circle}
          color="error"
          variant="determinate"
          value={lossPercent}
          thickness={5}
          size={85}
        />
        <div className={styles.circletext}>
          <h2>{lossPercent}</h2>
          <small>LOSS%</small>
        </div>
      </div>
    </div>
  );
};

export default MenuStats;
