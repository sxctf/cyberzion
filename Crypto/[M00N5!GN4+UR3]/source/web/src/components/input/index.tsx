import { ChangeEvent, FC, InputHTMLAttributes, useCallback } from 'react';
import s from './index.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: (value: string | number) => void;
}

export const Input: FC<InputProps> = ({ onChange, ...props }) => {
    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange?.(event.target.value);
        },
        [onChange]
    );

    return (
        <input
            autoCapitalize='off'
            autoComplete='off'
            className={s.container}
            min={1}
            spellCheck={false}
            type='text'
            onChange={handleChange}
            {...props}
        />
    );
};
