import logo from '../../../public/favicon.png';
import s from './index.css';

export const Logo = () => {
    return (
        <div className={s.logo}>
            <img src={logo} alt='Logo' width={32} /> Super Bank
        </div>
    );
};
