import s from './index.css';

export const Info = () => {
    return (
        <div>
            <h3>Реквизиты банка</h3>
            <div className={s.table}>
                <b>Лицензия</b>
                <div>Генеральная лицензия на осуществление банковских операций №31337</div>
                <b>Наименование</b>
                <div>Super Bank</div>
                <b>Кор. счет</b>
                <div>SB:FFFFFFFF</div>
            </div>
        </div>
    );
};
