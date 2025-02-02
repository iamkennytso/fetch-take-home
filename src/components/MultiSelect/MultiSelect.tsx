import { useState, useRef, useEffect, ChangeEvent } from 'react';
import styles from './MultiSelect.module.scss';
import { TextInput } from '../TextInput';
import { Button } from '../Button';

export interface MultiSelectProps<T> {
  options: T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  getOptionLabel?: (option: T) => string;
  placeholder?: string;
}

export default function MultiSelect<T>({
  options,
  selected,
  onChange,
  getOptionLabel = (option: T) => String(option),
  placeholder = 'Select options...'
}: MultiSelectProps<T>): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (option: T) => {
    onChange([...selected, option]);
    setSearchTerm('');
  };

  const handleRemoveOption = (option: T) => {
    onChange(selected.filter((item) => item !== option));
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setDropdownVisible(false);
    }
  };

  const filteredOptions = options.filter(
    (option) =>
      getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selected.includes(option)
  );

  return (
    <div ref={containerRef} className={styles.container}>
      <div
        className={styles.inputContainer}
        // onClick={() => setDropdownVisible(true)}
      >
        <TextInput
          type="text"
          className={styles.input}
          value={searchTerm}
          onChange={(newVal) => {
            setSearchTerm(newVal);
            setDropdownVisible(true);
          }}
          onFocus={() => setDropdownVisible(true)}
          placeholder={placeholder}
        />
        {isDropdownVisible && filteredOptions.length > 0 && (
          <ul className={styles.dropdown}>
            {filteredOptions.map(option => (
              <li
                key={String(option)}
                className={styles.dropdownItem}
                onClick={() => handleSelectOption(option)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {getOptionLabel(option)}
              </li>
            ))}
          </ul>
        )}
        <div className={styles.chipsContainer}>
          {selected.map((option, index) => (
            <div key={index} className={styles.chip}>
              <span
                className={styles.chipRemove}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveOption(option);
                }}
              >
                &times;
              </span>
              <span>{getOptionLabel(option)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
