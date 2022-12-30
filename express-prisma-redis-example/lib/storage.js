const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const destination = process.env.STORAGE_DIR || path.resolve(__dirname, '..', 'storage');

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    if (req.hasOwnProperty('destinationFilename')) {
      cb(null, req.destinationFilename);
    }
    else {
      cb(null, uuidv4());
    }
  }
});

const tryParse = (str, defaultValue) => {
  const res = parseInt(str);
  return Number.isNaN(res) ? defaultValue : res;
};

module.exports = {
  storage: multer({ 
    storage,
    limits: {
      fileSize: tryParse(process.env.MAX_FILE_SIZE, 52428800), //default 50MB
    },
  }),
  unlink: (fn) => fs.unlinkSync(path.join(destination, fn)),
  createReadStream: (fn) => fs.createReadStream(path.join(destination, fn)),
};
