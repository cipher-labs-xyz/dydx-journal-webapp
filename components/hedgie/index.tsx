import Image from "next/image";
import styles from "./Hedgie.module.css"

type Props = {
  hedgies: number[] | undefined;
  dimensions?: number;
  fit?: boolean
};

const Hedgie = ({ hedgies, dimensions = 300, fit = false }: Props) => {
  if (hedgies == undefined || !hedgies.length)
    return (
      <Image
        src="/images/hedgie-placeholder.png"
        alt="Hedgie Placeholder"
        width={dimensions}
        height={dimensions}
        className={`${styles.hedgie} ${fit && styles.fit}`}
        priority
      />
    );
  return (
    <Image
      src={`https://media.dydx.exchange/hedgies/${hedgies[0]}.png`}
      alt={`Hedgie ${hedgies[0]}`}
      width={dimensions}
      height={dimensions}
      className={`${styles.hedgie} ${fit && styles.fit}`}
      unoptimized
    />
  );
};

export default Hedgie;
