const bcrypt = require('bcrypt');

class TestRepository {
  create = (password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);

    console.log({ hashedPassword });

    return hashedPassword;
  };
}

module.exports = {
  TestRepository,
};
