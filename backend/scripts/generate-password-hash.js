const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Bcrypt hash for "password123":');
  console.log(hash);
}

generateHash();
