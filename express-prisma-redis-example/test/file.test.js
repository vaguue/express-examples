const sessionHelpers = require('@/lib/session');
jest.mock('@/lib/session');
const multer = require('multer');
jest.mock('multer');

const fs = require('fs');
const prisma = require('@/lib/prisma');
const app = require('@/root/app');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const { Readable } = require('stream');


const mockFile = {
  id: 1,
  storageName: uuidv4(),
  name: 'myfile',
  ext: '.txt',
  mimetype: 'text/plain',
  size: 20,
  dateCreate: new Date(Date.now()),
  userId: 1,
};

const listSize = 20;
const page = 1;

prisma.file.create = jest.fn().mockResolvedValue(mockFile);
prisma.file.findMany = jest.fn().mockResolvedValue(Array.from({ length: listSize }, (_, i) => ({ ...mockFile, id: i + 1 })));
prisma.file.findUniqueOrThrow = jest.fn().mockResolvedValue(mockFile);
prisma.user.update = jest.fn().mockResolvedValue(mockFile);
prisma.file.findUniqueOrThrow = jest.fn().mockResolvedValue(mockFile);

class MockReadable extends Readable {
  constructor() {
    super();
    this.counter = 1;
  }
  _read () {
    if (this.counter-- > 0 ){
      this.push('mock');
    }
    else {
      this.push(null);
    }
  }
};

fs.unlinkSync = jest.fn().mockImplementation(() => {
  console.log('unlinkSync');
})

fs.createReadStream = jest.fn().mockImplementation((fn, ...args) => new MockReadable());

fs.mkdirSync = jest.fn().mockImplementation((...args) => {
  console.log('mkdirSync');
});

const token = 'Bearer token';

describe('file routes', () => {
  it('/upload', async () => {
    await expect(
      request(app).post('/file/upload').set('Authorization', token).attach('file', Buffer.from('some-file-data'), 'myfile.txt').then(res => res.body)
    ).resolves.toEqual(1);
  });

  it('/list', async () => {
    await expect(
      request(app).get(`/file/list?list_size=${listSize}&page=${page}`).set('Authorization', token).then(res => res.body.length)
    ).resolves.toEqual(listSize);
  });

  it('/delete/:id', async () => {
    await expect(
      request(app).delete(`/file/delete/${mockFile.id}`).set('Authorization', token).then(res => res.body.message)
    ).resolves.toEqual('ok');
  });

  it('/:id', async () => {
    await expect(
      request(app).get(`/file/${mockFile.id}`).set('Authorization', token).then(res => res.body.id)
    ).resolves.toEqual(mockFile.id);
  });

  it('/download/:id', async () => {
    await expect(
      request(app).get(`/file/download/${mockFile.id}`).set('Authorization', token).then(res => res.headers['content-type'])
    ).resolves.toEqual(mockFile.mimetype);
  });

  it('/update/:id', async () => {
    await expect(
      request(app).put(`/file/update/${mockFile.id}`).set('Authorization', token).then(res => res.body.message)
    ).resolves.toEqual('ok');
  });
});
