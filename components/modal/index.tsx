import { Dispatch, FC, SetStateAction } from "react";
import styles from "./Modal.module.css";

type Props = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
};

const Modal: FC<Props> = ({ show, setShow, children }) =>
  show ? (
    <div className={styles.modal} onClick={() => setShow(false)}>
      <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  ) : (
    <></>
  );

export default Modal;
