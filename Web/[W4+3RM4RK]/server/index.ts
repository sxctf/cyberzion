import path from 'node:path';
import child_process from 'node:child_process';
import express from 'express';
import multer from 'multer';
import mmm from 'mmmagic';

const app = express();
const port = process.env.PORT || 8080;
const uploadsDir = path.resolve(__dirname, 'uploads');
const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);

const exec = async (cmd: string) => {
    return new Promise((resolve, reject) => {
        console.log(cmd);

        child_process.exec(cmd, { cwd: uploadsDir }, (err, stdout, stderr) => {
            if (err || stderr) reject(err?.message || stderr);
            else resolve(stdout);
        });
    });
};

const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req: Express.Request, file: Express.Multer.File, cb) => {
        cb(null, file.originalname);
    }
});

const whitelist = ['image/png', 'image/jpeg', 'image/jpg'];

const upload = multer({
    storage,
    limits: {
        files: 2,
        fieldNameSize: 50,
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        if (whitelist.includes(file.mimetype)) cb(null, true);
        else cb(new Error('File is not allowed'));
    }
});

const checkFile = (path: string) =>
    new Promise(resolve => {
        magic.detectFile(path, function (err, result) {
            if (err || !whitelist.includes(result)) resolve(false);
            else resolve(true);
        });
    });

app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/api/upload', upload.any(), async (req, res) => {
    try {
        if (!Array.isArray(req.files)) {
            res.status(400).send('Bad request');
            return;
        }

        const overlay = req.files.find(item => item.fieldname === 'overlay');
        const background = req.files.find(item => item.fieldname === 'background');

        if (!overlay || !background) {
            res.status(400).send('Bad request: Overlay and background are required');
            return;
        }

        const checks = await Promise.all([checkFile(overlay.path), checkFile(background.path)]);

        if (!checks[0] || !checks[1]) {
            res.status(400).send('Bad request: File is not allowed');
            return;
        }

        const result = `res-${Math.random().toString().substring(2)}.png`;
        let cmd = '';

        cmd = `magick composite ${overlay.originalname} ${background.originalname} -gravity SouthEast ${result}`;
        await exec(cmd);

        cmd = `magick ${result} -set comment "Powered by Super Watermark App / ${new Date().toISOString()}" ${result}`;
        await exec(cmd);

        res.download(path.resolve(__dirname, uploadsDir, result));
    } catch (err) {
        // For debug purposes
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
