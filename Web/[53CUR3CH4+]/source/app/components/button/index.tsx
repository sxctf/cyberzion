import { ButtonHTMLAttributes } from 'react';
import s from './button.css';

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ ...rest }) => {
    return <button className={s.container} {...rest} />;
};
