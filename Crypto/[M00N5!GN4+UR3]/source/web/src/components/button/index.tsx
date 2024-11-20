import { ButtonHTMLAttributes, FC } from 'react';
import s from './index.css';

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = props => {
    return <button className={s.container} type='button' {...props} />;
};
