import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import expressWs from 'express-ws';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import * as bot from './bot';
import { dev, debug } from './lib';

const app = express();
const port = process.env.PORT || 8080;

let db;
const resetDB = () => {
    db = {
        sessions: new Map(),
        sockets: new Map()
    };
};
resetDB();

expressWs(app);
app.use(bodyParser.json());
app.use(cookieParser());

app.use('*', (req, res, next) => {
    res.set({
        'Content-Security-Policy': "default-src 'self'; style-src 'self' *.github.io; img-src *"
    });
    next();
});

app.get('/', (req, res) => {
    const { flag } = req.cookies;
    const file = dev ? '../task/public/index.html' : './public/index.html';

    fs.readFile(path.resolve(__dirname, file), (err, data) => {
        if (err) res.sendStatus(404);
        else {
            const value = flag || "nah... you don't have any secrets";
            res.send(data.toString().replace('$SECRET$', value));
        }
    });
});

const staticDir = dev ? '../task/public' : 'public';
app.use(express.static(path.resolve(__dirname, staticDir)));

const broadcastRooms = ws => {
    const list = [...db.sessions.values()];

    (ws ? [ws] : [...db.sockets.values()]).forEach(ws => {
        ws.send(
            JSON.stringify({
                type: 'rooms',
                value: list
            })
        );
    });
};

app.post('/api/login', bodyParser.json(), (req, res) => {
    const uuid = uuidv4();
    const session = uuidv4();
    const name = req.body.name;

    db.sessions.set(session, { uuid, name: String(name) || '-' });
    res.cookie('session', session, { httpOnly: true }).send({ uuid: uuid });
    broadcastRooms();
});

app.post('/api/logout', (req, res) => {
    const { session } = req.cookies;

    const success = db.sessions.delete(session);
    if (success) broadcastRooms();

    res.send('Ok');
});

app.get('/api/me', (req, res) => {
    const { session } = req.cookies;
    const user = db.sessions.get(session);

    if (user) res.send(user);
    else res.status(403).send('Forbidden');
});

app.ws('/ws/:uuid', (ws, req) => {
    const { uuid } = req.params;
    const { session } = req.cookies;

    db.sockets.set(uuid, ws);

    broadcastRooms(ws);

    ws.on('message', async msg => {
        try {
            const data = JSON.parse(msg);

            if (data.type === 'send') {
                if (db.sessions.get(session)?.uuid === data.from && data.message) {
                    debug('incoming message', data);

                    const link = data.message.match(/https?:\/\/[\w./?=%&:-]{2,}/)?.[0];

                    if (link) debug('link found', link);

                    const res = {
                        type: 'message',
                        author: data.from,
                        text: data.message || ''
                    };

                    if (link) {
                        const meta = await bot.inspect(link);
                        if (meta) {
                            res.link = { ...(meta || {}), href: link };
                        }
                    }

                    db.sockets.get(data.from)?.send(JSON.stringify({ ...res, room: data.to }));
                    db.sockets.get(data.to)?.send(JSON.stringify({ ...res, room: data.from }));
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Forbidden' }));
                }
            }
        } catch {
            ws.send(JSON.stringify({ type: 'error', message: 'Unknown' }));
        }
    });

    ws.on('close', () => {
        db.sockets.delete(uuid);
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);

    // reset DB every 10 minutes
    // setInterval(resetDB, 10 * 60 * 1000);
});
