import sqlite3 from 'sqlite3';

const open = () => {
  return new sqlite3.Database('./db.sqlite');
}

export default {
  open,
}
