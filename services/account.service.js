const httpStatus = require('http-status');
const { Account } = require('../models/index');
const AppError = require('../utils/appError');

/**
 * Create a user
 * @param {Object} accountBody
 * @returns {Promise<Account>}
 */

 const getUserById = async (id) => {
  return Account.findById(id);
};

const createAccount = async (accountBody) => {
  console.log(accountBody);
  if (await Account.isEmailTaken(accountBody.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await Account.usernameExists(accountBody.username)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Username already exists');
  }
  if (await Account.isPhoneTaken(accountBody.phoneNumber)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Phone number already exists');
  }
  return Account.create(accountBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAccounts = async (filter, options) => {
  const users = await Account.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getAccountById = async (id) => {
  return Account.findById(id);
};

const checkVerifyEmail = async (id) => {
  const user = await getUserById(id);
  const { isEmailVerified } = user;
  return isEmailVerified;
};

const checkIsActive = async (id) => {
  const user = await getUserById(id);
  const { isActive } = user;
  return isActive;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getAccountByEmail = async (email) => {
  return Account.findOne({ $or: [{ email: email }, { username: email }] });
};

const getAccount = async() => {
  return Account.find();
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateAccountById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await Account.isEmailTaken(updateBody.email, userId))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await Account.usernameExists(updateBody.username, userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Username already exists');
  }
  if (await Account.isPhoneTaken(updateBody.phoneNumber, userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Phone number already exists');
  }
  if (updateBody.dayOfBirth) {
    const { dayOfBirth } = updateBody;
    const day = ('0' + dayOfBirth.getDate()).slice(-2);
    const month = ('0' + (dayOfBirth.getMonth() + 1)).slice(-2);
    const today = dayOfBirth.getFullYear() + '-' + month + '-' + day;
    updateBody.dayOfBirth = today;
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const updateAccountAccess = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
  }
  Object.assign(user, { isActive: !user.isActive });
  await user.save();
  return user;
};

const updateAccountAvatarById = async (userId, avatar) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.avatar = avatar;
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteAccountById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  getAccount,
  createAccount,
  queryAccounts,
  getAccountById,
  getAccountByEmail,
  updateAccountById,
  updateAccountAvatarById,
  deleteAccountById,
  checkVerifyEmail,
  checkIsActive,
  updateAccountAccess,
};
