import { FormEvent, useCallback, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Icon, Input, Logo } from '../../components';
import { useAPI } from '../../api';
import s from './index.css';

interface CheckData {
    name: string;
    account: string;
    amount: number;
    sig: string;
}

const getDate = () => {
    return new Intl.DateTimeFormat('ru', {
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(Date.now());
};

export const WriteCheck = () => {
    const api = useAPI();
    const [data, setData] = useState<CheckData | null>(null);
    const [error, setError] = useState(false);

    const handleSubmit = useCallback(async (event: FormEvent) => {
        event.preventDefault();
        setError(false);

        const form = event.target as HTMLFormElement;
        const account = localStorage.getItem('account')!;

        const res = await api.post('/api/sign', {
            account_from: account,
            amount: form.amount.value
        });

        if (res.data) {
            setData({
                name: form.sender.value,
                account,
                amount: form.amount.value,
                sig: res.data
            });
        }

        if (res.error) setError(true);
    }, []);

    const handleReset = useCallback(() => {
        setData(null);
    }, []);

    if (data)
        return (
            <>
                <div className={s.check}>
                    <div className={s.row}>
                        <Logo />
                        <div className={s.gap} />
                        <div>Дата</div>
                        <div className={s.date}>{getDate()}</div>
                    </div>
                    <div className={s.row}>
                        <div>Имя</div>
                        <div className={s.handwritten}>{data.name}</div>
                    </div>
                    <div className={s.row}>
                        <div>Счет списания</div>
                        <div className={s.value}>{data.account}</div>
                    </div>
                    <div className={s.row}>
                        <div>Сумма, ₽</div>
                        <div className={s.value}>{data.amount}</div>
                    </div>
                    <div className={s.row}>
                        <div>Подпись</div>
                        <div className={s.sig}>{data.sig}</div>
                        <CopyToClipboard text={data.sig}>
                            <div className={s.copy}>
                                <Icon name='copy' size={16} />
                            </div>
                        </CopyToClipboard>
                    </div>
                </div>
                <br />
                <Button onClick={handleReset}>Выписать новый чек</Button>
            </>
        );

    return (
        <form className={s.form} onSubmit={handleSubmit}>
            <div>Имя</div>
            <Input autoFocus name='sender' placeholder='Иван Иванов' required />
            <div>Сумма, ₽</div>
            <Input name='amount' placeholder='123' required type='number' />
            <div />
            <div>
                <Button type='submit'>Отправить на подпись</Button>
            </div>
            {error && (
                <>
                    <div />
                    <div className={s.message}>
                        <div className={s.icon}>
                            <Icon name='times' size={20} />
                        </div>
                        Ошибка при выполнении запроса
                    </div>
                </>
            )}
        </form>
    );
};
