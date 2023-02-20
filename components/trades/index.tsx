import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from "@mui/material";
import { Position } from "../../helpers/dataProcessing";
import { formatCurrency } from "../../helpers/formatting";
import { formatTime } from "../../helpers/formatting";
import { timeOptions } from "../../config/defaults";
import Image from "next/image";
import styles from "./Trades.module.css";
import { Dispatch, SetStateAction } from "react";

type Props = {
  positions: Position[] | undefined;
  setReferenced: Dispatch<SetStateAction<Position | undefined>>;
};

const Trades = ({ positions, setReferenced }: Props) => {
  if (!positions || !positions.length)
    return null;
  return (
    <TableContainer component={Paper} className={styles.container} style={{ overflow: "initial" }}>
      <Table stickyHeader>
        <TableHead className={styles.header}>
          <TableRow>
            <TableCell>Date & Time</TableCell>
            <TableCell>Market</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Entry</TableCell>
            <TableCell>Exit</TableCell>
            <TableCell>P&amp;L</TableCell>
            <TableCell className={styles["hide-mobile"]}>Outcome</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ overflowX: "scroll" }}>
          {positions
            .map((row, i) => {
              return (
                <TableRow
                  className={styles[row.status]}
                  key={i}
                  onMouseEnter={() => row.status != "OPEN" && setReferenced(row)}
                  onMouseLeave={() => setReferenced(undefined)}
                >
                  <TableCell className={styles.date}>
                    <span>{new Date(row.createdAt).toLocaleString("en-US", timeOptions).toUpperCase()}</span>
                    <br></br>
                    {row.closedAt && (
                      <span style={{ color: "var(--color-text-dark)" }}>
                        {formatTime(row.closedAt.getTime() - row.createdAt.getTime())}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Image
                      className={styles.micon}
                      src={`/images/currencies/${row.market.split("-")[0].toLowerCase()}.png`}
                      alt="Market icon"
                      width={24}
                      height={24}
                      unoptimized
                    />
                    <span className={styles["hide-mobile"]}>{row.market}</span>
                  </TableCell>
                  <TableCell>
                    <span className={styles[row.side]}>{row.side.toLowerCase()}</span>
                  </TableCell>
                  <TableCell className={styles[row.status]}>
                    <span className={styles.status}>{row.status}</span>
                    {row.status == "CLOSED" ? (
                      <span className={styles.time}>
                        {row.closedAt
                          ?.toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                          })
                          .toUpperCase()}
                        <br />
                        {row.closedAt
                          ?.toLocaleString("en-US", {
                            hour12: true,
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          .toUpperCase()}
                      </span>
                    ) : undefined}
                  </TableCell>
                  <TableCell>
                    <span>{row.sumOpen}</span>
                    <br />
                    <span className={styles.price}>{formatCurrency(row.entryPrice)}</span>
                  </TableCell>
                  <TableCell>
                    <span>{row.sumClose ? row.sumClose : ""}</span>
                    <br />
                    <span className={styles.price}>{row.exitPrice ? formatCurrency(row.exitPrice) : ""}</span>
                  </TableCell>
                  <TableCell>
                    {row.status == "OPEN" ? (
                      <>
                        <span className={`${styles.pnl} ${styles[row.realizedPnl ? row.outcome : "even"]}`}>
                          {formatCurrency(row.realizedPnl)}
                        </span>
                        <br></br>
                        <Tooltip title="Unrealised P&amp;L" arrow>
                          <span className={`${styles.pnl} ${styles.unrealized} ${styles[row.outcome]}`}>
                            {formatCurrency(row.unrealizedPnl)}
                          </span>
                        </Tooltip>
                      </>
                    ) : (
                      <span className={`${styles.pnl} ${styles[row.outcome]}`}>{formatCurrency(row.realizedPnl)}</span>
                    )}
                  </TableCell>
                  <TableCell className={styles["hide-mobile"]}>
                    <span className={`${styles.outcome} ${styles[row.outcome]}`}>{row.outcome}</span>
                  </TableCell>
                </TableRow>
              );
            })
            .reverse()}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Trades;
