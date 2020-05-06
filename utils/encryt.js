const Base64 = require('js-base64').Base64;
const mySalt = 'N2FjMTJkN2I3NzIw';

export const myEncode = function (data) {
  const length = data.length;
  const index = Math.abs(length / 2);
  let token = Base64.encode(data);
  token = token.slice(0, index) + mySalt + token.slice(index);
  token = Base64.encode(token);

  return token;
};

export const myDecode = function (data) {
  let token = Base64.decode(data);
  token = token.replace(mySalt, '');
  token = Base64.decode(token);

  return token;
};

export const saveLocal = function (key, value) {
  if (value) {
    localStorage.setItem(key, Base64.encode(JSON.stringify(value)));
    return true;
  }
  return false;
};

export const getLocal = function (key) {
  const value = localStorage.getItem(key);
  if (value) { return JSON.parse(Base64.decode(value)); }
  return false;
};

export const clearLocal = function () {
  localStorage.clear();
};

export const removeKeyLocal = function (key) {
  localStorage.removeItem(key);
};
