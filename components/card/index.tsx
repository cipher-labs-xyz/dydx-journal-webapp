import Image from "next/image";
import styles from "./Card.module.css";
import { Coin, RoundLogo } from "../../svgs";

type Icon = "coin" | "logo" | "hedgie";

const HedgieIcon = ({ width, height }: { width: number; height: number }) => (
  <Image
    src="/images/hedgie-placeholder.png"
    alt="Hedgie"
    width={width}
    height={height}
    style={{ borderRadius: "50%" }}
  />
);

const icons: Record<Icon, any> = {
  coin: Coin,
  logo: RoundLogo,
  hedgie: HedgieIcon,
};

type Props = {
  title: string;
  sub: string;
  value: string | number | undefined;
  icon: Icon;
};

const Card = ({ title, sub, value, icon }: Props) => {
  const Icon = icons[icon];
  return (
    <div >
      <div className={styles.card}>
        <h2 className={styles.heading}>{title}</h2>
        <div>
          <Icon width={28} height={28} />
          <h1 className={styles.value}>{value || 0}</h1>
        </div>
        <p className={styles.description}>{sub}</p>
      </div>
    </div>
  );
};

export default Card;
