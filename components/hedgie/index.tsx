import Image from "next/image";
import styles from "./Hedgie.module.css"
import sources from "./sources";

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
      src={`https://ipfs.io/ipfs/${sources[hedgies[0]]}`}
      alt={`Hedgie ${hedgies[0]}`}
      width={dimensions}
      height={dimensions}
      className={`${styles.hedgie} ${fit && styles.fit}`}
      unoptimized
      priority
    />
  );
};

export default Hedgie;
