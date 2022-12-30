const { v4: uuidv4 } = require('uuid');
const multer = jest.createMockFromModule('multer');

module.exports = () => ({
  single: () => ((req, res, next) => {
    req.file = {
      originalname: 'myfile.txt',
      filename: uuidv4(),
      mimetype: 'text/plain',
      size: 14,
    }
    next();
  }),
});

module.exports.diskStorage = () => {};
