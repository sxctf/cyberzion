import { ChangeEvent, InputHTMLAttributes, useCallback } from 'react';
import s from './input.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: (val: string) => void;
}

export const Input: React.FC<InputProps> = ({ onChange, ...rest }) => {
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
            autoCorrect='off'
            className={s.container}
            spellCheck={false}
            type='text'
            onChange={handleChange}
            {...rest}
        />
    );
};
