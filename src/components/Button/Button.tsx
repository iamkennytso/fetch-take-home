import classNames from "classnames";
import styles from './Button.module.scss'

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  isDisabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className, isDisabled = false }) => {
  return (
    <button
      className={classNames(styles.button, className, { [styles.disabled]: isDisabled })}
      onClick={onClick}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};

export default Button;
