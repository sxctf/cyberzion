import { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import cx from 'classnames';
import s from './index.css';

export const Link: FC<NavLinkProps> = ({ children, to }) => {
    return (
        <NavLink to={to} className={({ isActive }) => cx(s.link, isActive && s.active)}>
            {children}
        </NavLink>
    );
};
