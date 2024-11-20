import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Logo } from './components';
import { Nav } from './nav';
import { WriteCheck } from './pages/write-check';
import { VerifyCheck } from './pages/verify-check';
import { Info } from './pages/info';
import s from './index.css';

let acc = localStorage.getItem('account');

if (!acc) {
    acc =
        'SB:' +
        Math.floor(Math.random() * 2 ** 31 + 1)
            .toString(16)
            .padStart(8, '0')
            .toUpperCase();
    localStorage.setItem('account', acc);
}

export const App = () => {
    return (
        <div className={s.app}>
            <BrowserRouter>
                <div className={s.header}>
                    <Link to='/'>
                        <Logo />
                    </Link>
                </div>
                <Nav />
                <Routes>
                    <Route path='/write' element={<WriteCheck />} />
                    <Route path='/verify' element={<VerifyCheck />} />
                    <Route path='/info' element={<Info />} />
                    <Route
                        path='*'
                        element={
                            <div>
                                <h1>Добро пожаловать в наш банк</h1>
                                Вы можете выписывать и проверять чеки
                            </div>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
};
