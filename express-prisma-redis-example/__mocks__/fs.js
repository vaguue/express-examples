//TODO breaks bcrypt module
const path = require('path');
const { Readable } = require('stream');

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

const fs = jest.createMockFromModule('fs');

fs.unlinkSync = (...args) => {
  console.log('unlinkSync');
};

fs.createReadStream = (fn, ...args) => new MockReadable();

fs.mkdirSync = (...args) => {
  console.log('mkdirSync');
};

module.exports = fs;
