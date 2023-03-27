import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import { CSVLink } from "react-csv";
import {
  DydxClient,
  TradingRewardsResponseObject,
  UserResponseObject,
  PositionResponseObject,
  ProfilePrivateResponseObject,
  AccountResponseObject,
} from "@dydxprotocol/v3-client";

import Card from "../components/card";
import Hedgie from "../components/hedgie";
import Header from "../components/header";
import Trades from "../components/trades";
import Stats from "../components/stats";
import processPositions, { Position, sortPositions, Stats as TStats } from "../helpers/dataProcessing";
import { defaultStats, defaultMarkets, csvHeaders, Filters as TFilters } from "../config/defaults";
import MenuStats from "../components/stats/menu-stats";
import { getLimits, getApiKeyCredentials } from "../helpers/util";
import Chart from "../components/chart";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button"
import { Download } from "../svgs";
import { formatNumber } from "../helpers/formatting";
import Share from "../components/share";
import Filters from "../components/filters";
import HedgieCard from "../components/card/HedgieCard";
import MetaTags from "../components/metatags";
import Modal from "../components/modal";
const HTTP_HOST = "https://api.dydx.exchange";

type UserResponseWithMissingFields = UserResponseObject & {
  // Opened PR to fix this https://github.com/dydxprotocol/v3-client/pull/213
  publicId: string;
  hedgiesHeld: number[];
};

export default function Home() {
  const router = useRouter();
  const client = useRef<DydxClient | undefined>();
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState(defaultMarkets);
  const [positions, setPositions] = useState<Position[] | undefined>();
  const [stats, setStats] = useState<TStats>(defaultStats);
  const [tradingRewards, setTradingRewards] = useState<TradingRewardsResponseObject | undefined>();
  const [user, setUser] = useState<UserResponseWithMissingFields | undefined>();
  const [profile, setProfile] = useState<ProfilePrivateResponseObject | undefined>();
  const [accounts, setAccounts] = useState<AccountResponseObject[]>([]);
  const [referenced, setReferenced] = useState<Position>();
  const [filters, setFilters] = useState<TFilters>({ period: 7 });

  const tooltipRef = useRef<HTMLDivElement>(null);

  // TODO: Massive block due to API's not returning positions in chronological order.
  const fetchPositions = async (time: Date) => {
    if (!client.current) return [];
    let { start, end } = getLimits(time, filters.period);
    const fetchedPositions: PositionResponseObject[] = [];
    while (true) {
      const { positions } = await client.current.private.getPositions({
        market: filters.market,
        createdBeforeOrAt: start,
      });
      const withinPeriod = positions
        .filter((a) => a.createdAt >= end)
        .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
      if (filters.position) fetchedPositions.unshift(...withinPeriod.filter((p) => p.side == filters.position));
      else fetchedPositions.unshift(...withinPeriod);

      if (withinPeriod.length < 100) break;
      const removed = withinPeriod.shift()!;
      start = removed.createdAt;
    }
    return fetchedPositions.sort(sortPositions);
  };

  useEffect(() => {
    const apiKeyCredentials = getApiKeyCredentials();
    if (!apiKeyCredentials) {
      router.push("/login");
      return;
    }
    client.current = new DydxClient(HTTP_HOST, {
      apiKeyCredentials,
    });
    client.current.private.getTradingRewards({}).then(setTradingRewards);
    client.current.private.getUser().then(({ user }) => setUser(user as UserResponseWithMissingFields));
    client.current.public.getMarkets().then(
      ({ markets: ms }) =>
        Object.keys(ms).length == markets.length ||
        setMarkets(
          Object.values(ms)
            .map((m) => m.market)
            .sort((a, b) => (a > b ? 1 : -1))
        )
    );

    client.current.private.getAccounts().then(({ accounts }) => setAccounts(accounts));

    client.current.private.getProfilePrivate().then(setProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const time = new Date();
    setLoading(true);
    fetchPositions(time).then((positions) => {
      const { stats, enhancedPositions } = processPositions(positions);
      setPositions(enhancedPositions);
      setStats(stats);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <>
      <Head>
        <title>Trading Journal | dYdX</title>
        <MetaTags />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/fonts/CircularStd-Medium.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </Head>
      <Header user={user} />
      <main className="container" style={{ paddingBottom: "50px" }}>
        <Modal show={loading} setShow={setLoading} ><CircularProgress sx={{ color: "var(--color-text-base)" }}/></Modal>
        <div className={styles.profile}>
          <Hedgie hedgies={profile?.hedgiesHeld} fit />
          <div className={styles.cards}>
            <Card
              title="Wallet Balance"
              sub="currently held"
              value={formatNumber(profile?.DYDXHoldings ? parseFloat(profile.DYDXHoldings) : 0)}
              icon="logo"
            />
            <Card
              title="Estimated Rewards"
              sub="for this epoch"
              value={formatNumber(tradingRewards ? parseFloat(tradingRewards.estimatedRewards) : 0)}
              icon="logo"
            />
            <HedgieCard hedgies={user?.hedgiesHeld} />
            <Card
              title="Equity"
              sub="current balance"
              value={formatNumber(
                accounts.reduce((p: number, c: AccountResponseObject) => p + parseFloat(c.equity), 0)
              )}
              icon="coin"
            />
            <Card
              title="Fees Paid"
              sub="in this epoch"
              value={formatNumber(tradingRewards ? parseFloat(tradingRewards.fees.feesPaid) : 0)}
              icon="coin"
            />
            <Card
              title="Affiliate Commissions"
              sub="earnt this epoch"
              value={formatNumber(profile ? parseFloat(profile.affiliateStatistics.currentEpoch.revenue) : 0)}
              icon="coin"
            />
          </div>
        </div>
        <div className={styles.gridwrapper}>
          <div className={styles.pnl} ref={tooltipRef} />
          <MenuStats count={stats.count} wins={stats.win.count} losses={stats.loss.count} />
          <Filters filters={filters} setFilters={setFilters} markets={markets} />
          <Chart data={positions || []} period={filters.period} tooltipRef={tooltipRef} referenced={referenced} />
          <div className={styles.data}>
            <Stats stats={stats} />
            <div className={styles.tradesmenu}>
              <h2 style={{ margin: "0", flexGrow: "1" }}>Trades ({positions?.length || 0})</h2>
              {positions && (
                <div className={styles.menu} style={{ padding: 0 }}>
                  {profile && (
                    <Share
                      stats={stats}
                      username={profile.username}
                      hedgies={profile.hedgiesHeld}
                      affiliateLinks={profile.affiliateLinks}
                      filters={filters}
                    />
                  )}
                  <CSVLink
                    data={positions}
                    headers={csvHeaders}
                    filename={`${new Date().toISOString().split("T")[0]}_dYdX_Trades_History_${
                      user?.ethereumAddress
                    }.csv`}
                  >
                    <Button variant="contained" style={{ gap: "10px" }}>
                      <Download />
                      <span>Export</span>
                    </Button>
                  </CSVLink>
                </div>
              )}
            </div>
            <Trades positions={positions} setReferenced={setReferenced} />
          </div>
        </div>
      </main>
    </>
  );
}
