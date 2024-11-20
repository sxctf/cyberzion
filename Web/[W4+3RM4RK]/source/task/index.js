"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = __importDefault(require("node:path"));
var node_child_process_1 = __importDefault(require("node:child_process"));
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var mmmagic_1 = __importDefault(require("mmmagic"));
var app = (0, express_1.default)();
var port = process.env.PORT || 8080;
var uploadsDir = node_path_1.default.resolve(__dirname, 'uploads');
var magic = new mmmagic_1.default.Magic(mmmagic_1.default.MAGIC_MIME_TYPE);
var exec = function (cmd) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                console.log(cmd);
                node_child_process_1.default.exec(cmd, { cwd: uploadsDir }, function (err, stdout, stderr) {
                    if (err || stderr)
                        reject((err === null || err === void 0 ? void 0 : err.message) || stderr);
                    else
                        resolve(stdout);
                });
            })];
    });
}); };
var storage = multer_1.default.diskStorage({
    destination: uploadsDir,
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var whitelist = ['image/png', 'image/jpeg', 'image/jpg'];
var upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        files: 2,
        fieldNameSize: 50,
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        if (whitelist.includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error('File is not allowed'));
    }
});
var checkFile = function (path) {
    return new Promise(function (resolve) {
        magic.detectFile(path, function (err, result) {
            if (err || !whitelist.includes(result))
                resolve(false);
            else
                resolve(true);
        });
    });
};
app.use(express_1.default.static(node_path_1.default.resolve(__dirname, 'public')));
app.post('/api/upload', upload.any(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var overlay, background, checks, result, cmd, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!Array.isArray(req.files)) {
                    res.status(400).send('Bad request');
                    return [2 /*return*/];
                }
                overlay = req.files.find(function (item) { return item.fieldname === 'overlay'; });
                background = req.files.find(function (item) { return item.fieldname === 'background'; });
                if (!overlay || !background) {
                    res.status(400).send('Bad request: Overlay and background are required');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Promise.all([checkFile(overlay.path), checkFile(background.path)])];
            case 1:
                checks = _a.sent();
                if (!checks[0] || !checks[1]) {
                    res.status(400).send('Bad request: File is not allowed');
                    return [2 /*return*/];
                }
                result = "res-".concat(Math.random().toString().substring(2), ".png");
                cmd = '';
                cmd = "magick composite ".concat(overlay.originalname, " ").concat(background.originalname, " -gravity SouthEast ").concat(result);
                return [4 /*yield*/, exec(cmd)];
            case 2:
                _a.sent();
                cmd = "magick ".concat(result, " -set comment \"Powered by Super Watermark App / ").concat(new Date().toISOString(), "\" ").concat(result);
                return [4 /*yield*/, exec(cmd)];
            case 3:
                _a.sent();
                res.download(node_path_1.default.resolve(__dirname, uploadsDir, result));
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                // For debug purposes
                res.status(500).send(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("App listening on port ".concat(port));
});
