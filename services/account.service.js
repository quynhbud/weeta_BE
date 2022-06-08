const httpStatus = require('http-status');
const { Account, User, Lessor } = require('../models/index');
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
    if (await Account.isEmailTaken(accountBody.email)) {
        return {
            status: 400,
            message: 'Email already exists',
        };
    }
    if (await Account.usernameExists(accountBody.username)) {
        return {
            status: 400,
            message: 'Username already exists',
        };
    }
    if (await Account.isPhoneTaken(accountBody.phoneNumber)) {
        return {
            status: 400,
            message: 'Phone number already exists',
        };
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
    return Account.findOne({ email: email });
};

const getAccount = async () => {
    return Account.find();
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateAccountById = async (accountId, updateBody) => {
    const account = await getUserById(accountId);
    if (!account) {
        throw new AppError(httpStatus.NOT_FOUND, 'Account not found');
    }
    if (
        updateBody.email &&
        (await Account.isEmailTaken(updateBody.email, accountId))
    ) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    if (await Account.usernameExists(updateBody.username, accountId)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Username already exists');
    }
    if (await Account.isPhoneTaken(updateBody.phoneNumber, accountId)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Phone number already exists'
        );
    }
    Object.assign(account, updateBody);
    await account.save();
    return account;
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
const updateAvatar = async (id, avatar) => {
    await Account.updateOne({ _id: id }, { avatar: avatar });
    const account = await Account.findById(id);
    return account;
};
const updateIDCard = async (id, IDCard) => {
    await Account.updateOne({ _id: id }, { IDCard: IDCard });
    const account = await Account.findById(id);
    await Lessor.updateOne({account: id},{isNeedAutoApproved: true})
    return account;
};

const getProfile = async (data) => {
    data.password = undefined;
    if (data.role === 'lessor') {
        const lessor = await Lessor.findOne({ account: data._id });
        delete lessor.account;
        return {
            lessorId: lessor._id,
            ...lessor._doc,
            ...data._doc,
        };
    }
    return data;
};
const saveArticle = async (articleId, accountId) => {
    try {
        const account = await Account.findById(accountId);
        const saveArticle = account.saveArticle.map((item) => item.toString());
        const checkExist = saveArticle.some((item) => item === articleId);
        if (checkExist) {
            const newSaveArticle = saveArticle.filter(
                (item) => item !== articleId
            );
            await Account.updateOne(
                { _id: accountId },
                { saveArticle: newSaveArticle }
            );
            const updateAccount = await getAccountById(accountId);
            return {
                status: 200,
                data: updateAccount,
                message: 'Bỏ lưu tin thành công',
            };
        } else {
            const newSaveArticle = [...saveArticle, articleId];
            await Account.updateOne(
                { _id: accountId },
                { saveArticle: newSaveArticle }
            );
            const updateAccount = await getAccountById(accountId);
            return {
                status: 200,
                data: updateAccount,
                message: 'Lưu tin thành công',
            };
        }
    } catch (err) {
        return {
            status: 400,
            message: err,
        };
    }
};

module.exports = {
    getAccount,
    createAccount,
    queryAccounts,
    getAccountById,
    getAccountByEmail,
    updateAccountById,
    updateAvatar,
    updateAccountAvatarById,
    deleteAccountById,
    checkVerifyEmail,
    checkIsActive,
    updateAccountAccess,
    updateIDCard,
    getProfile,
    saveArticle,
};
