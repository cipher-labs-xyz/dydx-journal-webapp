import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Login.module.css";

import { DydxClient } from "@dydxprotocol/v3-client";
import { setApiKeyCredentials } from "../helpers/util";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Arrow, Discord, DyDxFull, Logo, Twitter } from "../svgs";
import MetaTags from "../components/metatags";

const HTTP_HOST = "https://api.dydx.exchange";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Force top of page on load
    window.history.scrollRestoration = "manual";
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Get form values
    const form = e.currentTarget;
    const {
      key: { value: key },
      passphrase: { value: passphrase },
      secret: { value: secret },
      remember: { checked: remember },
    } = form.elements as typeof form.elements & {
      key: HTMLInputElement;
      passphrase: HTMLInputElement;
      secret: HTMLInputElement;
      remember: HTMLInputElement;
    };

    // Validate Login
    const client = new DydxClient(HTTP_HOST, {
      apiKeyCredentials: { key, passphrase, secret },
    });
    client.private
      .getUser()
      .then(() => {
        setApiKeyCredentials(key, passphrase, secret, remember);
        router.push("/");
      })
      .catch(() => {
        alert("Incorrect API credentials entered, please try again.");
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>dYdX Profiles</title>
        <MetaTags />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/fonts/CircularStd-Medium.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/CircularStd-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </Head>
      <div className={styles.header}>
        <a
          href="https://dydx.exchange/r/PFNCPKKA"
          target="_blank"
          rel="noreferrer"
        >
          <Logo src="/logo.svg" alt="dYdX Logo" width={40} height={40} />
        </a>
        <a
          href="https://dydx.exchange/r/PFNCPKKA"
          target="_blank"
          rel="noreferrer"
          style={{
          }}
        >
          <button style={{ minWidth: "initial", padding: "10px 15px" }}>Trade</button>
        </a>
      </div>
      <main className={styles.main}>
        <Image src="/images/grid-background.svg" alt="" width={1300} height={916} className={styles.bgimg} />
        <div className={styles.banner}>
          <Image
            src="/images/hedgie-placeholder.png"
            alt="Hedgie Placeholder"
            width={215}
            height={215}
            style={{
              borderRadius: "50%",
              minHeight: "125px",
              maxHeight: "215px",
              height: "22vh",
              maxWidth: "100%",
              objectFit: "contain",
              width: "fit-content",
              position: "relative",
              zIndex: "1000"
            }}
            priority
          />
          <h1>Trading Journal</h1>
          <p>Unlock your trading potential with stats and performance data to help you improve your trading.</p>
          <form className={styles.apikeyform} onSubmit={handleLogin} autoComplete="off">
            <p style={{ marginBottom: "20px" }}>API Credentials</p>
            <input type="text" name="key" placeholder="Key" required />
            <input type="text" name="passphrase" placeholder="Passphrase" required />
            <input type="text" name="secret" placeholder="Secret" required />

            <div className={styles.submit}>
              <a
                href="https://www.youtube.com/watch?v=M1Ugq22EHao"
                target="blank"
                rel="noreferrer"
                style={{ fontSize: "0.8em", textAlign: "left" }}
              >
                How to find my API Key?
              </a>
              <div>
                <button disabled={loading} style={{ fontSize: "18px", maxWidth: "100px" }}>
                  {loading ? <CircularProgress size={14} color="inherit" /> : "Enter"}
                </button>
              </div>
              <label style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                <small style={{ verticalAlign: "text-bottom" }}>Remember me</small>
                <input type="checkbox" name="remember" style={{ margin: "0 0 0 10px" }} defaultChecked />
              </label>
            </div>
          </form>
          <div className={styles.more}>
            <Arrow />
          </div>
        </div>
        <div className={styles.feature} style={{ position: "relative", height: "42vw" }}>
          <Image fill style={{ objectFit: "cover" }} src="/images/hedgie-banner.jpg" alt="Hedgie Banner" />
        </div>
        <div className="container" style={{ marginTop: "80px" }}>
          <div className={styles.info}>
            <div>
              <h1>Profile summary</h1>
              <p>
                The profile summary provides a quick and easy way to see where you are for the epoch regarding your
                fees, wallet balance, affiliate commissions and estimated rewards.
              </p>
            </div>
            <Image
              width={589}
              height={393}
              className={styles.screenshot}
              src="/images/profile.png"
              alt="Profile Summary"
            />
          </div>
          <div className={`${styles.info} ${styles.middle}`}>
            <Image width={589} height={393} className={styles.screenshot} src="/images/stats.png" alt="Stats" />
            <div>
              <h1>Trade statistics</h1>
              <p>
                Now you can see helpful stats on all your trades and quickly discover what&apos;s working and what
                isn&apos;t. Do you know what your most profitable trading session is? Find out today!
              </p>
            </div>
          </div>
          <div className={styles.info}>
            <div>
              <h1>Made with love</h1>
              <p>
                This trading journal was made possible through DYDX grants and built by a talented team of passionate
                tech entrepreneurs based out of Sydney, Australia.
              </p>
            </div>
            <div className={styles.team}>
              <a href="https://www.linkedin.com/in/kagan-powell-236a3914/" target="_blank" rel="noreferrer">
                <Image width={130} height={130} src="/images/kagan.jpg" alt="Kagan Powell" />
                <p>Kagan Powell</p>
                <span>
                  Product
                  <br />
                  Development
                </span>
              </a>
              <a href="https://www.linkedin.com/in/barrett-ovens-610a8534/" target="_blank" rel="noreferrer">
                <Image width={130} height={130} src="/images/barrett.jpg" alt="Kagan Powell" />
                <p>Barrett Ovens</p>
                <span>
                  Project
                  <br />
                  Management
                </span>
              </a>
              <a href="https://www.linkedin.com/in/amir-harambasic/" target="_blank" rel="noreferrer">
                <Image width={130} height={130} src="/images/amir.jpg" alt="Kagan Powell" />
                <p>Amir Harambasic</p>
                <span>Engineering</span>
              </a>
            </div>
          </div>
          <div className={styles.faq}>
            <Accordion elevation={0} square>
              <AccordionSummary expandIcon={<Arrow />}>Why do I need to enter my API key?</AccordionSummary>
              <AccordionDetails>
                API keys are unique identifiers that allow secure communication between different systems. Your API key
                grants access to view your dYdX account information and trades.
              </AccordionDetails>
            </Accordion>
            <Accordion elevation={0} square>
              <AccordionSummary expandIcon={<Arrow />}>What is a trading journal?</AccordionSummary>
              <AccordionDetails>
                A trading journal is a record of a trader&apos;s past trades, including details such as the coin traded,
                the entry and exit points, the type of the trade, and the outcome. It is used for self-reflection and
                analysis to improve future trading decisions.
              </AccordionDetails>
            </Accordion>
            <Accordion elevation={0} square>
              <AccordionSummary expandIcon={<Arrow />}>
                What are the benefits of using a trading journal?
              </AccordionSummary>
              <AccordionDetails>
                <ul style={{ margin: 0, paddingInlineStart: "inherit" }}>
                  <li>Allows traders to track their performance and identify patterns in their trading.</li>
                  <li>Helps traders to reflect on their past decisions and learn from their mistakes.</li>
                  <li>Allows traders to identify and overcome any emotional biases impacting their trading.</li>
                  <li>Can also be used as a tool for risk management and to develop a more structured trading plan.</li>
                </ul>
              </AccordionDetails>
            </Accordion>
            <Accordion elevation={0} square>
              <AccordionSummary expandIcon={<Arrow />}>Is a trading journal effective?</AccordionSummary>
              <AccordionDetails>
                A trading journal can be a very effective tool for traders serious about improving their performance. By
                keeping track of their trades, traders can identify patterns in their behaviour and make adjustments to
                improve their results. Additionally, a trading journal can help traders to manage risk and make more
                informed decisions. However, it&apos;s important to note that a trading journal will only be practical
                if the trader consistently uses it and reflects on the information recorded in it.
              </AccordionDetails>
            </Accordion>
            <Accordion elevation={0} square>
              <AccordionSummary expandIcon={<Arrow />}>What statistics will I see?</AccordionSummary>
              <AccordionDetails>
                Largest winning trade | Largest losing trade | Average winning trade | Average losing trade | Average
                holding time | Maximum drawdown | Trading expectancy | Payoff ratio | Average holding time/winners |
                Average holding time/losers | Most profitable session | Most profitable day | Largest number of
                consecutive wins | Largest number of consecutive losses | Average number of consecutive wins | Average
                number of consecutive losses
              </AccordionDetails>
            </Accordion>
          </div>
          <div className={styles.footer}>
            <div style={{ flexGrow: "1", display: "flex", gap: "40px" }}>
              <a href="https://twitter.com/dydx" target="_blank" rel="noreferrer">
                <Twitter />
              </a>
              <a href="https://discord.gg/Tuze6tY" target="_blank" rel="noreferrer">
                <Discord />
              </a>
            </div>
            <a href="https://dydx.exchange/r/PFNCPKKA" target="_blank" rel="noreferrer">
              <DyDxFull width="72" height="22" />
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
