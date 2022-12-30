const user = jest.createMockFromModule('@/lib/user');

const mockUser = {
  innerId: 1,
  id: 'id',
  password: 'password',
};

user.createUser = (obj) => {
  return obj;
}

user.verifyUser = (obj) => {
  if (typeof obj != 'object') {
    throw Error('expected-object');
  }
  const { id, password } = obj;
  if (!id || !password) {
    throw Error('not-enough-credentials');
  }
  if (id != mockUser.id || password != mockUser.password) {
    throw Error('invalid-credentials');
  }
  return mockUser;
}

module.exports = user;
