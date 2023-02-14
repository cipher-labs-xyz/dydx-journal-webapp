import Image from "next/image";
import styles from "./Card.module.css";

type Props = {
  hedgies: number[] | undefined;
};

const HedgieCard = ({ hedgies = [] }: Props) => {
  return (
    <div>
      <div className={styles.card}>
        <h2 className={styles.heading}>Hedgies</h2>
        <div className={styles.hedgies}>
          {hedgies.length ? (
            hedgies.map((i) => <Image
            src={`https://media.dydx.exchange/hedgies/${i}.png`}
            alt={`Hedgie ${i}`}
            width={28}
            height={28}
            style={{ borderRadius: "50%", marginRight: "-10px" }}
            unoptimized
            key={i}
          />)
          ) : (
            <Image
              src="/images/hedgie-placeholder.png"
              alt="Hedgie"
              width={28}
              height={28}
              style={{ borderRadius: "50%" }}
            />
          )}
        </div>
        <p className={styles.description}>currently held</p>
      </div>
    </div>
  );
};

export default HedgieCard;
