import { FormEvent, useCallback, useEffect } from 'react';
import { ImageUpload } from './components';
import s from './index.css';

let url = '';

export const App = () => {
    const handleSubmit = useCallback(async (event: FormEvent) => {
        event.preventDefault();

        URL.revokeObjectURL(url);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: new FormData(event.target as HTMLFormElement)
        });

        const blob = await res.blob();
        url = URL.createObjectURL(blob);
        window.open(url);
    }, []);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(url);
        };
    }, []);

    return (
        <div className={s.content}>
            <h2>Super Watermark App</h2>
            <div className={s.slug}>
                Protect your copyright &copy; — add a watermark <br /> to your photo right now!
            </div>
            <form className={s.form} onSubmit={handleSubmit}>
                <ImageUpload name='background' label='Your image' />
                <ImageUpload name='overlay' label='Watermark image' />
                <button type='submit' className={s.submit}>
                    Add watermark
                </button>
            </form>
        </div>
    );
};
