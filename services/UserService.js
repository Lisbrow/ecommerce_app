const createError = require('http-errors');
const UserModel = require('../models/user');
const UserModelInstance = new UserModel();

module.exports = class UserService {

  async get(data) {

    const { id } = data;

    try {
      // Check if user already exists
      const user = await UserModelInstance.findOneById(id);

      // If user doesn't exist, reject
      if (!user) {
        throw createError(404, 'User record not found');
      }

      return user;

    } catch(err) {
      throw err;
    }

  };

  async update(data) {

    try {
      // Check if user already exists
      const user = await UserModelInstance.update(data);

      return user;

    } catch(err) {
      throw err;
    }

  };

  async delete(data) {

    const { id } = data;

    try {
      // Check if user exists
      const user = await UserModelInstance.findOneById(id);

      // If user doesn't exist, reject
      if (!user) {
        throw createError(404, 'User record not found');
      }

      // Delete the user
      const deletedUser = await UserModelInstance.delete(id);

      return deletedUser;

    } catch(err) {
      throw err;
    }

  };

}