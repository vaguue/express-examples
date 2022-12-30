const { hash, compare } = require('bcrypt');
const prisma = require('@/lib/prisma');

const { validate: isValidEmail } = require('email-validator');
const { isValidPhoneNumber } = require('libphonenumber-js')


const rounds = 10;

async function createUser(obj) {
  if (typeof obj != 'object') {
    throw Error('expected-object');
  }
  const { password, id } = obj;
  const validEmail = isValidEmail(id);
  const validPhone = isValidPhoneNumber(id);
  const valid = validEmail || validPhone;
  if (!valid) {
    throw Error('invalid-id');
  }
  const idType = validEmail ? 'EMAIL' : 'PHONE';
  const data = {
    id,
    password: await hash(password, rounds), 
    idType,
  };
  const exists = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (exists) {
    throw Error('user-id-exists');
  }
  return prisma.user.create({ data });
}

async function verifyUser(obj) {
  if (typeof obj != 'object') {
    throw Error('expected-object');
  }
  const { id, password } = obj;
  if (!id || !password) {
    throw Error('not-enough-credentials');
  }
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user || !(await compare(password, user.password))) {
    throw Error('invalid-credentials');
  }
  return user;
}

module.exports = { createUser, verifyUser };
