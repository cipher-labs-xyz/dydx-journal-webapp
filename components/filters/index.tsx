import Image from "next/image";
import styles from "./Filters.module.css";
import { Dispatch, FC, SetStateAction } from "react";
import { Period, periods, Filters as TFilters, TPosition } from "../../config/defaults";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Market } from "@dydxprotocol/v3-client";

type Props = {
  filters: TFilters;
  setFilters: Dispatch<SetStateAction<TFilters>>;
  markets: Market[];
};

const Filters: FC<Props> = ({ markets, filters, setFilters }) => {
  return (
    <div className={styles.filters}>
      <Select
        value={filters.market || "ALL"}
        variant="filled"
        disableUnderline
        onChange={(e) =>
          setFilters((f) => ({
            ...f,
            market: e.target.value == "ALL" ? undefined : (e.target.value as Market),
          }))
        }
      >
        <MenuItem value={"ALL"}>{"ALL PAIRS"}</MenuItem>
        {markets.map((m) => (
          <MenuItem value={m} key={m} style={{ gap: "10px" }}>
            <Image
              className={styles.micon}
              src={`/images/currencies/${m.split("-")[0].toLowerCase()}.png`}
              alt="Market icon"
              width={24}
              height={24}
              unoptimized
            />
            <span>{m}</span>
          </MenuItem>
        ))}
      </Select>
      <Select
        value={filters.position || "ALL"}
        variant="filled"
        disableUnderline
        onChange={(e) =>
          setFilters((f) => ({
            ...f,
            position: e.target.value == "ALL" ? undefined : (e.target.value as TPosition),
          }))
        }
      >
        <MenuItem value={"ALL"}>{"ALL POSITIONS"}</MenuItem>
        <MenuItem value={"LONG"}>LONG</MenuItem>
        <MenuItem value={"SHORT"}>SHORT</MenuItem>
      </Select>
      <Select
        value={filters.period}
        onChange={(e) => setFilters((f) => ({ ...f, period: e.target.value as Period }))}
        variant="filled"
        disableUnderline
      >
        <MenuItem value={1}>{periods[1]}</MenuItem>
        <MenuItem value={7}>{periods[7]}</MenuItem>
        <MenuItem value={30}>{periods[30]}</MenuItem>
        <MenuItem value={90}>{periods[90]}</MenuItem>
      </Select>
    </div>
  );
};

export default Filters;
