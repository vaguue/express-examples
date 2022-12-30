const _ = require('lodash');
const path = require('path');
const express = require('express');
const log4js = require('log4js');
const prisma = require('@/lib/prisma');
const { storage, unlink, createReadStream } = require('@/lib/storage');
const { filterAuth } = require('@/lib/session');

const logger = log4js.getLogger('config');
logger.level = 'debug';
const router = express.Router();

const dev = process.env.NODE_ENV != 'production';

/*TODO in prod project these functions would be moved to another module */
function reqToFileData(req) {
  if (!req.hasOwnProperty('file') || !req.file) {
    throw Error('no-file');
  }
  const { file } = req;
  const { ext, name } = path.parse(file.originalname);
  const { filename: storageName, mimetype, size } = file;
  return { storageName, name, ext, mimetype, size };
}

function getIntFromQuery(q) {
  const res = parseInt(q);
  if (!Number.isNaN(res) && res > 0) {
    return res;
  }
  throw Error('invalid-number-in-query');
}

function viewFileRecord(rec) {
  return _.pick(rec, 'id', 'name', 'ext', 'mimetype', 'size', 'dateCreate');
}

router.post('/upload', filterAuth(), storage.single('file'), async function(req, res, next) {
  try {
    const { id: userId } = req.session; 
    const data = { ...reqToFileData(req), userId };
    const rec = await prisma.file.create({ data });
    return res.json(rec.id);
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.get('/list', filterAuth(), async function(req, res, next) {
  try {
    const { id: userId } = req.session; 
    const { list_size = 10, page = 1 } = _.mapValues(req.query, getIntFromQuery);
    const files = await prisma.file.findMany({ //TODO maybe use cursor?
      skip: list_size*(page - 1),
      take: list_size,
      where: {
        user: {
          innerId: userId,
        },
      },
    });
    return res.json(files.map(viewFileRecord));
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.delete('/delete/:id', filterAuth(), async function(req, res, next) {
  try {
    const { id: innerId } = req.session; 
    const { id } = _.mapValues(req.params, getIntFromQuery);
    const fileToDelete = await prisma.file.findUniqueOrThrow({
      where: {
        id,
      }
    });
    if (fileToDelete.userId != innerId) {
      throw Error('access-error'); //not showing this error to the client
    }
    await prisma.user.update({
      where: {
        innerId,
      },
      data: {
        files: {
          delete: {
            id,
          }
        }
      }
    });
    await unlink(fileToDelete.storageName); //using await in case unlink is an async function
    return res.json({
      message: 'ok', 
    });
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.get('/:id', filterAuth(), async function(req, res, next) {
  try {
    const { id: innerId } = req.session; 
    const { id } = _.mapValues(req.params, getIntFromQuery);
    const file = await prisma.file.findUniqueOrThrow({ 
      where: {
        id
      },
    });
    if (file.userId != innerId) {
      throw Error('access-error'); //not showing this error to the client
    }
    return res.json(viewFileRecord(file));
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.get('/download/:id', filterAuth(), async function(req, res, next) {
  try {
    const { id: innerId } = req.session; 
    const { id } = _.mapValues(req.params, getIntFromQuery);
    const { storageName, name, ext, mimetype, userId } = await prisma.file.findUniqueOrThrow({
      where: {
        id,
      },
    });
    if (userId != innerId) {
      throw Error('access-error'); //not showing this error to the client
    }
    res.writeHead(200, {
      'Content-Disposition': `attachment;filename=${name}${ext}`,
      'Content-Type': mimetype,
    });
    return createReadStream(storageName).pipe(res);
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

//Upload to new desination, because we dont want to break possible existing download
router.put('/update/:id', filterAuth(), storage.single('file'), async function (req, res, next) {
  try {
    const { id: innerId } = req.session; 
    const { id } = _.mapValues(req.params, getIntFromQuery);
    const data = reqToFileData(req);
    const updateFile = await prisma.user.update({
      where: {
        innerId,
      },
      data: {
        files: {
          update: {
            data,
            where: {
              id,
            }
          }
        }
      }
    });
    return res.json({
      message: 'ok', 
    });
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

module.exports = router;
