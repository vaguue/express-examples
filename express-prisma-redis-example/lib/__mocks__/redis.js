const keys = new Set();

const redis = {
  exists: (key) => {
    return keys.has(key);
  },
  set: (key) => {
    //keys.add(key);
  }
};

module.exports = async () => {
  return redis;
}
