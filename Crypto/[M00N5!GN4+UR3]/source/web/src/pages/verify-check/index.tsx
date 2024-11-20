import { FormEvent, useCallback, useState } from 'react';
import cx from 'classnames';
import { Button, Icon, Input } from '../../components';
import { useAPI } from '../../api';
import s from './index.css';

type State = 'success' | 'fail' | 'error';

interface Data {
    state: State;
    flag?: string;
}

export const VerifyCheck = () => {
    const api = useAPI();
    const [data, setData] = useState<Data | undefined>();

    const handleSubmit = useCallback(async (event: FormEvent) => {
        event.preventDefault();
        setData(undefined);

        const form = event.target as HTMLFormElement;
        const sig = form.sig.value;

        const res = await api.post<Data>('/api/verify', { sig });

        if (res.data) setData(res.data);
        else setData({ state: 'error' });
    }, []);

    return (
        <>
            <form className={s.form} onSubmit={handleSubmit}>
                <div>Подпись</div>
                <Input autoFocus name='sig' placeholder='Подпись чека' required />
                <div />
                <div>
                    <Button type='submit'>Проверить</Button>
                </div>

                {data && (
                    <>
                        <div />
                        <div
                            className={cx(s.message, {
                                [s.green]: data.state === 'success',
                                [s.red]: data.state === 'fail' || data.state === 'error'
                            })}
                        >
                            <div className={s.icon}>
                                <Icon
                                    name={data.state === 'success' ? 'check' : 'times'}
                                    size={20}
                                />
                            </div>

                            {data.state === 'success' && (
                                <div>
                                    Чек действителен. <br /> Вы можете обналичить его в любом
                                    отделении банка.
                                    {data.flag && (
                                        <>
                                            <br />
                                            Flag: {data.flag}
                                        </>
                                    )}
                                </div>
                            )}
                            {data.state === 'fail' && <div>Чек недействителен</div>}
                            {data.state === 'error' && (
                                <div>Что-то пошло не так. Попробуйте повторить позднее.</div>
                            )}
                        </div>
                    </>
                )}
            </form>
        </>
    );
};
