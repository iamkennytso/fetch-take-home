import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './TextInput.module.scss';

interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
  isDisabled?: boolean;
  type?: string;
  onFocus?: () => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  className,
  error,
  isDisabled = false,
  type = 'text',
  onFocus,
  placeholder = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleOnFocus = () => {
    setIsFocused(true)
    onFocus && onFocus()
  }

  return (
    <div className={classNames(styles.textInputContainer, className)}>
      <div className={styles.textInputWrapper}>
        {label && (
          <label
            className={classNames(styles.textInputLabel, {
              [styles.textInputLabelFocused]: isFocused || value,
            })}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={classNames(styles.textInputField, { [styles.textInputError]: error })}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleOnFocus}
          onBlur={() => setIsFocused(false)}
          disabled={isDisabled}
          placeholder={placeholder}
        />
      </div>
      {error && <span className={styles.textInputErrorMessage}>{error}</span>}
    </div>
  );
};

export default TextInput;