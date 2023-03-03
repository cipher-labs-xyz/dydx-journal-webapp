import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import styles from "./Post.module.css";
import { toBlob } from "html-to-image";
import Hedgie from "../../hedgie";
import { formatCurrency, formatDiscount, formatNumber } from "../../../helpers/formatting";
import Card from "./Card";
import { DyDxFull } from "../../../svgs";
import { InfoProps } from "..";

export type Option = "twitter" | "insta-story" | "insta-post";

type Props = {
  type: Option;
  setBlob: Dispatch<SetStateAction<Blob | null>>;
  width: number;
  height: number;
} & InfoProps;

const hedgieDims: Record<Option, number> = {
  twitter: 340,
  "insta-post": 300,
  "insta-story": 710,
};

const Post: FC<Props> = ({ type, setBlob, width, height, stats, hedgies, affiliateLinks, filters, username }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current && toBlob(ref.current, { width, height }).then(setBlob);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const affiliateLink = affiliateLinks.length ? affiliateLinks[0] : undefined;

  return (
    <div ref={ref} className={styles.wrapper}>
      <div className={`${styles.post} ${styles[type]}`} style={{ width, height }}>
        <div style={{ display: "flex", gap: type == "insta-story" ? "60px" : "30px" }}>
          <Hedgie hedgies={hedgies} dimensions={hedgieDims[type]} />
          <Card
            showQR={type != "insta-post"}
            affiliateLink={affiliateLink}
            filters={filters}
            username={username}
            stats={stats}
          />
        </div>
        {type == "insta-post" && affiliateLink && (
          <div className={styles.link}>
            <div style={{ display: "inline-block" }}>
              <DyDxFull width={108} height={33} />
              <p style={{ color: "var(--color-text-dark)" }}>
                dydx.exchange/r/<span style={{ color: "var(--color-text-light)" }}>{affiliateLink.link}</span>
              </p>
              <span style={{ color: "var(--color-text-dark)" }}>Join DYDX with my referral link above to get a</span>
              <span>&nbsp;bonus {formatDiscount(affiliateLink.discountRate)}% discount&nbsp;</span>
              <span style={{ color: "var(--color-text-dark)" }}>off your fees</span>
            </div>
            <div style={{ background: "white", padding: "10px", borderRadius: "10px", display: "inline-flex" }}>
              <QRCode value={`https://dydx.exchange/r/${affiliateLink.link}`} size={80} level="L" />
            </div>
          </div>
        )}
        <div className={styles.stats}>
          <div>
            <h3>
              Profit&nbsp;
              <span className={stats.pnl >= 0 ? styles.up : styles.down}>
                ({formatNumber(stats.invested == 0 ? 0 : (stats.pnl / stats.invested) * 100)}%)
              </span>
            </h3>
            <h2>{formatCurrency(stats.pnl)}</h2>
          </div>
          <div>
            <h3>Profit Factor</h3>
            <h2>{formatNumber(stats.win.total / Math.abs(stats.loss.total))}</h2>
          </div>
          <div>
            <h3>Payoff Ratio</h3>
            <h2>{formatNumber(stats.win.total / stats.win.count / Math.abs(stats.loss.total / stats.loss.count))}</h2>
          </div>
          <div>
            <h3>Trading Expectancy</h3>
            <h2>{formatCurrency(stats.count && stats.pnl / stats.count)}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
