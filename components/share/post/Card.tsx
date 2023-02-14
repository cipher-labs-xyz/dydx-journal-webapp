import Image from "next/image";
import { AffiliateLinkData, Market } from "@dydxprotocol/v3-client";
import { FC } from "react";
import QRCode from "react-qr-code";
import { Period, periods, TPosition } from "../../../config/defaults";
import { formatDiscount } from "../../../helpers/formatting";
import { DyDxFull } from "../../../svgs";
import MenuStats from "../../stats/menu-stats";
import styles from "./Post.module.css";
import { InfoProps } from "..";

type FiltersProps = {
  period: Period;
  market?: Market;
  position?: TPosition;
};

type Props = {
  showQR: boolean;
  affiliateLink: AffiliateLinkData | undefined;
} & Omit<InfoProps, "affiliateLinks" | "hedgies">;

const Filters: FC<FiltersProps> = ({ period, market, position }) => (
  <div className={styles.filters}>
    <div style={{ paddingLeft: 0 }}>
      <span>Time Frame</span>
      <h2>{periods[period]}</h2>
    </div>
    <div>
      <span>Pair</span>
        <h2>
        {market && (
          <Image
            style={{ marginBottom: "-4px", marginRight: "10px" }}
            src={`/images/currencies/${market.split("-")[0].toLowerCase()}.png`}
            alt="Market icon"
            width={24}
            height={24}
            unoptimized
          />
        )}
        <span>{market || "ALL"}</span></h2>
    </div>
    <div>
      <span>Positions</span>
      <h2 className={position && styles[position]}>{position || "ALL"}</h2>
    </div>
  </div>
);

const Card: FC<Props> = ({ showQR, affiliateLink, filters, username, stats }) => {
  if (showQR && affiliateLink)
    return (
      <div className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "10px" }}>
          <div>
            <span>Trader Profile</span>
            <h2>{username}</h2>
          </div>
          <div>
            <MenuStats count={stats.count} wins={stats.win.count} losses={stats.loss.count} noPadding/>
          </div>
          <div style={{ textAlign: "right" }}>
            <DyDxFull width={108} height={33} />
            <p>
              dydx.exchange/r/<span style={{ color: "var(--color-text-light)" }}>{affiliateLink.link}</span>
            </p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-end" }}>
          <Filters {...filters} />
          <div style={{ background: "white", padding: "10px", borderRadius: "10px", display: "inline-flex" }}>
            <QRCode value={`https://dydx.exchange/r/${affiliateLink.link}`} size={80} level="L" />
          </div>
        </div>
        <hr style={{ margin: "30px -30px" }} />
        <span style={{ color: "var(--color-text-dark)" }}>Join DYDX with my referral link above to get a</span>
        <span>&nbsp;bonus {formatDiscount(affiliateLink.discountRate)}% discount&nbsp;</span>
        <span style={{ color: "var(--color-text-dark)" }}>off your fees</span>
      </div>
    );
  return (
    <div className={`${styles.card} ${styles.compact}`}>
      <div style={{ display: "flex", gap: "40px" }}>
        <div>
          <span>Trader Profile</span>
          <h2>KAGAN</h2>
        </div>
        <div>
          <MenuStats count={100} wins={35} losses={65} noPadding/>
        </div>
      </div>
      <Filters {...filters} />
    </div>
  );
};

export default Card;
