const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

const api = axios.create({
  baseURL: 'YOUR_ADDRESS',
});

async function checkFs() {
  const id = `${uuidv4()}@mail.ru`;
  const tokens = await api.post('/signup', { id, password: 'password' }).then(resp => resp.data).catch(resp => resp.data);
  const form = new FormData();
  form.append('file', Buffer.from('my-buffer'), 'my-file.txt');
  const resp = await api.post('/file/upload', form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${tokens.token}`,
    },
  }).then(resp => resp.data).catch(resp => resp.data);
  console.log(resp);

  const fileData = await api.get(`/file/${resp}`, {
    headers: {
      Authorization: `Bearer ${tokens.token}`,
    },
  }).then(resp => resp.data).catch(resp => resp.data);

  console.log(fileData);
}

async function checkInfo(token) {
  const resp = await api.get('/info', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(resp => resp.data).catch(resp => resp.data);
  console.log('/info:', resp);
}

async function checkLatency(token) {
  const resp = await api.get('/latency', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(resp => resp.data).catch(resp => resp.data);
  console.log('/latency:', resp);
}

async function checkAuth() {
  const id = `${uuidv4()}@mail.ru`;
  const tokens = await api.post('/signup', { id, password: 'password' }).then(resp => resp.data).catch(resp => resp.data);
  console.log(tokens);
  await checkInfo(tokens.token);
  await checkLatency(tokens.token);
  const newTokens = await api.post('/signin/new_token', { refreshToken: tokens.refreshToken }).then(resp => resp.data).catch(resp => resp.data);
  console.log(tokens.token == newTokens.token);
  await checkInfo(tokens.token);
  await checkInfo(newTokens.token);
  const error = await api.post('/signin/new_token', { refreshToken: tokens.refreshToken }).then(resp => resp.data).catch(resp => resp.status);
  console.log('error', error);
  const errorLogoutResp = await api.get('/logout', {
    headers: {
      Authorization: `Bearer ${tokens.token}`,
    },
  }).then(res => res.data).catch(resp => resp.data);
  console.log('errorLogoutResp', errorLogoutResp);
  const logoutResp = await api.get('/logout', {
    headers: {
      Authorization: `Bearer ${newTokens.token}`,
    },
  }).then(res => res.data).catch(resp => resp.data);
  console.log('logoutResp', logoutResp);
  await checkInfo(tokens.token);
  await checkInfo(newTokens.token);
}

async function main() {
  await checkFs();
  await checkAuth();
}

main().catch(console.error);
