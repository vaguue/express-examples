const mockSession = {
  entityId: 'token',
  exp: -1,
  id: 'id@mail.ru',
  idType: 'EMAIL',
  innerId: 1,
  bump() {

  },
  expired() {
    return false;
  },
};

const sessionRepository = {
  createAndSave() {
    return mockSession;
  },
  remove() {

  },
  search() {
    return {
      where() {
        return {
          equals() {
            return {
              'return': {
                all() {
                  return mockSession;
                }
              }
            }
          }
        }
      }
    }
  },
  fetch() {
    return mockSession;
  },
  save() {

  }
};

module.exports = () => sessionRepository;
