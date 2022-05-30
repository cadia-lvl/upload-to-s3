import { express } from '../express/server';
import multer from 'multer';

import Bucket from '../database/bucket';
import {
    getLocalSessions,
    downloadLocalSession,
} from '../utilities/filesystem';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createRestRouter = (isProduction: boolean) => {
    const bucket = isProduction ? new Bucket() : undefined;
    const restRouter = express.Router();

    // TODO: store each show in a different folder
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, '../uploads/');
        },
        filename: (req, file, cb) => {
            const id = decodeURIComponent(req.headers.id as string);
            const show = decodeURIComponent(req.headers.show as string);
            if (file.fieldname == 'script') {
                cb(null, id);
                console.log('uploading file: ' + id);
            } else if (file.fieldname == 'metadata') {
                cb(null, 'metadata-' + id + '.json');
            }
        },
    });

    const upload = multer({ storage: storage }).fields([
        { name: 'script', maxCount: 100 },
        { name: 'metadata' },
    ]);

    restRouter.post('/:id', upload, (req, res) => {
        // If in production
        if (bucket) {
            bucket.uploadScript(req);
        }
        return res.status(200).send('Success');
    });

    restRouter.get('/sessions', async (req, res) => {
        const showPartial =
            req.query.partial && req.query.partial === 'true' ? true : false;
        if (bucket) {
            try {
                const sessions = await bucket.getSessions(showPartial);
                return res.status(200).json(sessions);
            } catch (error) {
                return res.status(500).send(error);
            }
        } else {
            try {
                const sessions = getLocalSessions(showPartial);
                return res.status(200).json(sessions);
            } catch (error) {
                return res
                    .status(500)
                    .send(
                        'Not running in production mode. ' +
                            'No local sessions found'
                    );
            }
        }
    });

    restRouter.get('/sessions/:id', async (req, res) => {
        if (bucket) {
            return bucket.downloadSession(req, res);
        } else {
            return downloadLocalSession(req, res);
        }
    });

    return restRouter;
};

export default createRestRouter;
