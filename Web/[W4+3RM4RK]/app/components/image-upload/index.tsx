import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { Icon } from '../icon';
import s from './file-upload.css';

interface ImageUploadProps {
    label: string;
    name: string;
}

const whitelist = ['image/png', 'image/jpeg', 'image/jpg'];

export const ImageUpload: FC<ImageUploadProps> = ({ label, name }) => {
    const [url, setURL] = useState<string>();

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const blob = new Blob([file]);
            const newURL = URL.createObjectURL(blob);
            setURL(newURL);
        } else {
            setURL('');
        }
    }, []);

    useEffect(() => {
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [url]);

    return (
        <label className={s.container}>
            <input
                accept={whitelist.join(',')}
                className={s.input}
                name={name}
                required
                type='file'
                onChange={handleChange}
            />
            <div className={s.label}>{label}</div>
            <div className={cx(s.preview, url && s.filled)}>
                {url && <img src={url} alt='Pic' className={s.image} />}
                {!url && <Icon name='image' size={24} />}
            </div>
        </label>
    );
};
