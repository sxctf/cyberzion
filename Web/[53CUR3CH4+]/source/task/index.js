"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _express = _interopRequireDefault(require("express"));
var _expressWs = _interopRequireDefault(require("express-ws"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _uuid = require("uuid");
var bot = _interopRequireWildcard(require("./bot"));
var _lib = require("./lib");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const app = (0, _express.default)();
const port = process.env.PORT || 8080;
let db;
const resetDB = () => {
  db = {
    sessions: new Map(),
    sockets: new Map()
  };
};
resetDB();
(0, _expressWs.default)(app);
app.use(_bodyParser.default.json());
app.use((0, _cookieParser.default)());
app.use('*', (req, res, next) => {
  res.set({
    'Content-Security-Policy': "default-src 'self'; style-src 'self' *.github.io; img-src *"
  });
  next();
});
app.get('/', (req, res) => {
  const {
    flag
  } = req.cookies;
  const file = _lib.dev ? '../task/public/index.html' : './public/index.html';
  _nodeFs.default.readFile(_nodePath.default.resolve(__dirname, file), (err, data) => {
    if (err) res.sendStatus(404);else {
      const value = flag || "nah... you don't have any secrets";
      res.send(data.toString().replace('$SECRET$', value));
    }
  });
});
const staticDir = _lib.dev ? '../task/public' : 'public';
app.use(_express.default.static(_nodePath.default.resolve(__dirname, staticDir)));
const broadcastRooms = ws => {
  const list = [...db.sessions.values()];
  (ws ? [ws] : [...db.sockets.values()]).forEach(ws => {
    ws.send(JSON.stringify({
      type: 'rooms',
      value: list
    }));
  });
};
app.post('/api/login', _bodyParser.default.json(), (req, res) => {
  const uuid = (0, _uuid.v4)();
  const session = (0, _uuid.v4)();
  const name = req.body.name;
  db.sessions.set(session, {
    uuid,
    name: String(name) || '-'
  });
  res.cookie('session', session, {
    httpOnly: true
  }).send({
    uuid: uuid
  });
  broadcastRooms();
});
app.post('/api/logout', (req, res) => {
  const {
    session
  } = req.cookies;
  const success = db.sessions.delete(session);
  if (success) broadcastRooms();
  res.send('Ok');
});
app.get('/api/me', (req, res) => {
  const {
    session
  } = req.cookies;
  const user = db.sessions.get(session);
  if (user) res.send(user);else res.status(403).send('Forbidden');
});
app.ws('/ws/:uuid', (ws, req) => {
  const {
    uuid
  } = req.params;
  const {
    session
  } = req.cookies;
  db.sockets.set(uuid, ws);
  broadcastRooms(ws);
  ws.on('message', async msg => {
    try {
      const data = JSON.parse(msg);
      if (data.type === 'send') {
        if (db.sessions.get(session)?.uuid === data.from && data.message) {
          (0, _lib.debug)('incoming message', data);
          const link = data.message.match(/https?:\/\/[\w./?=%&:-]{2,}/)?.[0];
          if (link) (0, _lib.debug)('link found', link);
          const res = {
            type: 'message',
            author: data.from,
            text: data.message || ''
          };
          if (link) {
            const meta = await bot.inspect(link);
            if (meta) {
              res.link = {
                ...(meta || {}),
                href: link
              };
            }
          }
          db.sockets.get(data.from)?.send(JSON.stringify({
            ...res,
            room: data.to
          }));
          db.sockets.get(data.to)?.send(JSON.stringify({
            ...res,
            room: data.from
          }));
        } else {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Forbidden'
          }));
        }
      }
    } catch {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Unknown'
      }));
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