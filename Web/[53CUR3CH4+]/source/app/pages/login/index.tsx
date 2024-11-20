import { useCallback } from 'react';
import { Button, Input } from '../../components';
import { useAPI } from '../../hooks';
import s from './login.css';

export const LoginPage = () => {
    const api = useAPI();

    const login = useCallback(async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        const $target = event.target as typeof event.target & {
            name: { value: string };
        };

        const res = await api.post('/login', { name: $target.name.value });

        if (res.data.uuid) {
            localStorage.setItem('uuid', res.data.uuid);
            localStorage.setItem('name', $target.name.value);
            window.location.reload();
        }
    }, []);

    return (
        <div className={s.page}>
            <form className={s.form} onSubmit={login}>
                <h2>
                    <center>Вход в чат</center>
                </h2>
                <Input name='name' placeholder='Введите никнейм' required />
                <Button type='submit'>Войти</Button>
            </form>
        </div>
    );
};
