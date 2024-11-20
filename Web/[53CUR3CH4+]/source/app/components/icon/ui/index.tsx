import { FC } from 'react';
import { iconsDir } from '../lib';
import { IconName } from '../types';
import s from './styles.css';

export interface IconProps {
    /**
     * Name of the icon to display
     */
    name: IconName;
    /**
     * Icon size
     */
    size?: number;
}

/**
 * Component for displaying small vector icons
 */
export const Icon: FC<IconProps> = ({ name, size = 24 }) => {
    if (!iconsDir[name]) return null;

    return (
        <i
            className={s.container}
            style={{
                width: `${size}px`,
                height: `${size}px`
            }}
        >
            <svg
                width={size}
                height={size}
                className={s.svg}
                viewBox={iconsDir[name].viewBox}
            >
                <use xlinkHref={`#${name}`} />
            </svg>
        </i>
    );
};
