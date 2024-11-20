import { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { Button, Input } from '../../components';
import { useAPI } from '../../hooks';
import config from '../../../config.json';
import s from './chat.css';

interface User {
    uuid: string;
    name: string;
}

interface Link {
    href: string;
    title: string;
    description: string;
}

interface Message {
    ts: number;
    author: string;
    text: string;
    link?: Link;
}

const uuid = localStorage.getItem('uuid');
let ws: WebSocket | null = null;
let chats = new Map<string, Message[]>();

const reset = () => {
    localStorage.clear();
    window.location.reload();
};

export const ChatPage = () => {
    const api = useAPI();
    const [rooms, setRooms] = useState<User[]>([]);
    const [selected, setSelected] = useState<string>('');
    const [, refresh] = useState(0);

    const messages = chats.get(selected) || [];
    const room = rooms.find(item => item.uuid === selected);

    const init = async () => {
        const list = await api.get('/me');
        if (!list.data) reset();
    };

    const send = useCallback(
        async (event: React.ChangeEvent<HTMLFormElement>) => {
            event.preventDefault();

            const $target = event.target as typeof event.target & {
                msg: { value: string };
            };

            ws?.send(
                JSON.stringify({
                    type: 'send',
                    from: uuid,
                    to: selected,
                    message: $target.msg.value
                })
            );

            $target.reset();
        },
        [selected]
    );

    const logout = useCallback(async () => {
        await api.post('/logout', { uuid });
        reset();
    }, []);

    useEffect(() => {
        if (selected && !room) setSelected('');
    }, [selected, room]);

    useEffect(() => {
        void init();

        ws = new WebSocket(config.ws_url + '/' + uuid);

        ws.addEventListener('message', msg => {
            try {
                const data = JSON.parse(msg.data);

                if (data.type === 'rooms') setRooms(data.value?.filter(item => item.uuid !== uuid));

                if (data.type === 'message') {
                    if (!chats.has(data.room)) chats.set(data.room, []);

                    const chat = chats.get(data.room);
                    const message = { ts: Date.now(), ...data };
                    delete message.type;
                    delete message.room;
                    chat?.push(message);

                    refresh(Math.random());
                    window.setTimeout(() => {
                        document.getElementById('chat-end')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            } catch {
                /**/
            }
        });

        return () => {
            ws?.close();
            ws = null;
            chats = new Map();
        };
    }, []);

    return (
        <div className={s.page}>
            <div className={s.sidebar}>
                {rooms.map(user => (
                    <div
                        key={user.uuid}
                        className={cx(s.user, {
                            [s.selected]: selected === user.uuid
                        })}
                        onClick={() => setSelected(user.uuid)}
                    >
                        {user.name}
                    </div>
                ))}
            </div>
            <div className={s.chat}>
                {messages.map(item => (
                    <div key={item.ts} className={s.message}>
                        <div
                            className={cx(s.author, {
                                [s.red]: room?.uuid === item.author,
                                [s.blue]: room?.uuid !== item.author
                            })}
                        >
                            {room?.uuid === item.author ? room?.name : 'You'}:
                        </div>
                        <div>{item.text}</div>
                        {item.link && (
                            <a
                                className={s.link}
                                href={item.link.href}
                                target='_blank'
                                rel='noreferrer noopener'
                            >
                                <div className={s.title}>🔗 {item.link.title}</div>
                                {item.link.description}
                            </a>
                        )}
                    </div>
                ))}
                <div id='chat-end' />
            </div>
            <div className={s.panel}>
                <Button onClick={logout}>Выйти</Button>
            </div>
            <form className={s.input} onSubmit={send}>
                <Input
                    autoFocus
                    disabled={!selected}
                    name='msg'
                    placeholder='Напишите сообщение...'
                    required
                />
            </form>
        </div>
    );
};
