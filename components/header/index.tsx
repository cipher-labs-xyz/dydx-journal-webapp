import { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import { Logo, Copy } from "../../svgs";
import { UserResponseObject } from "@dydxprotocol/v3-client";
import styles from "./Header.module.css";
import { clearApiKeyCredentials } from "../../helpers/util";
import { Router, useRouter } from "next/router";

type UserResponseWithMissingFields = UserResponseObject & {
  // Opened PR to fix this https://github.com/dydxprotocol/v3-client/pull/213
  publicId: string;
  hedgiesHeld: number[];
};

type Props = {
  user?: UserResponseWithMissingFields;
};

const Header = ({ user }: Props) => {
  const router = useRouter();
  const [copied, setCopied] = useState<boolean>(false);
  if (!user)
    return (
      <div className={styles.header}>
        <Logo className={styles.logo} width={40} height={40} />
      </div>
    );
  return (
    <div className={styles.header}>
      <Logo className={styles.logo} width={40} height={40} />
      <h2>{user.username || `${user.ethereumAddress.slice(0, 6)}····${user.ethereumAddress.slice(-4)}`}</h2>
      <div className={styles.badge}>
        <span>You</span>
      </div>
      <Tooltip title={copied ? "Copied!" : "Copy profile link"} arrow>
        <div
          className={`${styles.badge} ${styles.copy}`}
          onClick={() => {
            navigator.clipboard.writeText(`https://trade.dydx.exchange/u/${user.publicId}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <Copy src="/icons/copy.svg" alt="Copy profile link" width={18} height={18} />
        </div>
      </Tooltip>
      <span
        style={{
          marginLeft: "auto",
          cursor: "pointer",
          color: "var(--color-text-light)",
          backgroundColor: "var(--color-layer-lighter)",
          padding: "10px 15px",
          borderRadius: "20px"
        }}
        onClick={() => {
          clearApiKeyCredentials();
          router.push("/login");
        }}
      >
        Logout
      </span>
    </div>
  );
};

export default Header;
