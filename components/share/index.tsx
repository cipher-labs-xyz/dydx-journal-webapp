import Image from "next/image";
import { FC, useState } from "react";
import Button from "@mui/material/Button";
import { Download, DyDxFull, Share as Icon } from "../../svgs";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import styles from "./Share.module.css";
import Modal from "../modal";
import Post from "./post";
import { Option } from "./post";
import { Period, TPosition } from "../../config/defaults";
import { AffiliateLinkData, Market } from "@dydxprotocol/v3-client";
import CircularProgress from "@mui/material/CircularProgress";

const renderOptions: Record<Option, { width: number; height: number }> = {
  twitter: {
    width: 1200,
    height: 625,
  },
  "insta-post": {
    width: 1080,
    height: 1080,
  },
  "insta-story": {
    width: 1080,
    height: 1920,
  },
};

export type InfoProps = {
  stats: {
    win: {
      count: number;
      total: number;
      largest: number;
    };
    loss: {
      count: number;
    }
    count: number;
    pnl: number;
  };
  username: string | null;
  hedgies: number[] | undefined;
  filters: {
    period: Period;
    market?: Market;
    position?: TPosition;
  };
  affiliateLinks: AffiliateLinkData[];
};

const Share: FC<InfoProps> = (props) => {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(false);
  const [option, setOption] = useState<Option>("twitter");
  const [blob, setBlob] = useState<Blob | null>(null);

  const closeModal = () => {
    setModal(false);
    setSelected(false);
  };

  if (!modal)
    return (
      <Button variant="contained" onClick={() => setModal(true)} style={{ gap: "10px" }}>
        <Icon />
        <span>Share</span>
      </Button>
    );

  if (!selected)
    return (
      <Modal setShow={closeModal} show={modal}>
        <div className={`${styles.select} ${styles.modal}`}>
          <DyDxFull width={144} height={44} />
          <p style={{ margin: "50px 0" }}>How would you like to share your profile card?</p>
          <RadioGroup
            name="option"
            value={option}
            row
            style={{ justifyContent: "center", margin: "50px 0", gap: "20px" }}
            onChange={(_, v) => setOption(v as Option)}
          >
            <FormControlLabel control={<Radio icon={<></>} checkedIcon={<></>} />} value="twitter" label="Twitter" />
            <FormControlLabel control={<Radio icon={<></>} checkedIcon={<></>} />} value="insta-story" label="Instagram Story" />
            <FormControlLabel control={<Radio icon={<></>} checkedIcon={<></>} />} value="insta-post" label="Instagram Post" />
          </RadioGroup>
          <hr />
          <button style={{ marginTop: "50px" }} onClick={() => setSelected(true)}>
            Continue
          </button>
        </div>
      </Modal>
    );

  const src = blob ? URL.createObjectURL(blob) : undefined;

  const shareData = blob
    ? {
        title: "DYDX Trader Stats",
        files: [
          new File([blob], `dYdX-${option}.png`, {
            type: blob.type,
          }),
        ],
      }
    : undefined;

  return (
    <Modal setShow={closeModal} show={modal}>
      <div className={styles.modal} style={{ width: "max-content", textAlign: "center" }}>
        {src ? <Image src={src} alt="Profile Card" unoptimized {...renderOptions[option]} /> : <CircularProgress />}
        <hr />
        <div style={{ display: "flex", padding: "40px", gap: "20px", justifyContent: "end" }}>
          <button style={{ backgroundColor: "var(--color-loading-bar-shine)" }} onClick={closeModal}>
            Cancel
          </button>
          <a href={src} download={`dYdX-${option}.png`}>
            <Button variant="contained" color="info" onClick={closeModal}>
              <Download />
              &nbsp; Download
            </Button>
          </a>
          {navigator.canShare && navigator.canShare(shareData) && (
            <Button variant="contained" color="info" onClick={() => navigator.share(shareData).then(closeModal)}>
              <Icon />
              &nbsp; Share
            </Button>
          )}
        </div>
      </div>
      <Post type={option} setBlob={setBlob} {...renderOptions[option]} {...props} />
    </Modal>
  );
};

export default Share;
