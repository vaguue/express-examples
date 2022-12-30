const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const api = axios.create({
  baseURL: 'YOUR_ADDR',
});

async function main() {
  const id = `${uuidv4()}@mail.ru`;
  const token = await api.post('/signup', { id, password: 'password' }).then(resp => resp.data);
  console.log(await api.get('/info', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }).then(resp => resp.data));
  console.log(await api.get('/phrase', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }).then(resp => resp.data));
}

main().catch(console.error);
