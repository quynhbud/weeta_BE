const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('./return.controller');
const {
    authService,
    tokenService,
    emailService,
    accountService,
    imageService,
} = require('../services');
const { generateFromEmail } = require('unique-username-generator');

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(
        email,
        password
    );
    if (user.status === 400) {
        return sendError(res, user.status, user.msg);
    }
    const token = await tokenService.generateAuthTokens(user);
    const { role } = user;
    sendSuccess(res, { token, role }, httpStatus.OK, 'Đăng nhập thành công');
});

const checkAccountExists = catchAsync(async (req, res) => {
    const { email } = req.params;
    const user = await accountService.getOneAccount({
        email,
        accountType: 'normal',
    });
    if (user) {
        return sendSuccess(
            res,
            { isExist: true },
            httpStatus.OK,
            'Tài khoản đã tồn tại'
        );
    }
    return sendSuccess(
        res,
        { isExist: false },
        httpStatus.OK,
        'Tài khoản chưa tồn tại'
    );
});

const loginWithGoogle = catchAsync(async (req, res) => {
    const { email, fullname, avatar } = req.body;
    const user = await accountService.getAccountByEmail(email);
    if (!!user) {
        if (user.accountType && user.accountType !== 'google') {
            await accountService.updateAccountById(user._id, {
                accountType: 'google',
                fullname,
                avatar,
            });
        }
        const token = await tokenService.generateAuthTokens(user);
        const { role } = user;
        return sendSuccess(
            res,
            { token, role },
            httpStatus.OK,
            'Đăng nhập thành công'
        );
    }
    const username = generateFromEmail(email, 3);
    const newUser = await accountService.createAccount({
        email,
        fullname,
        avatar,
        username,
        password: '123456.abc',
        phoneNumber: `09${new Date().getTime().toString().slice(5)}`,
        accountType: 'google',
    });
    const token = await tokenService.generateAuthTokens(newUser);
    const { role } = newUser;
    return sendSuccess(
        res,
        { token, role },
        httpStatus.OK,
        'Đăng nhập google thành công'
    );
});

const loginWithFacebook = catchAsync(async (req, res) => {
    const { email, fullname, avatar } = req.body;
    const user = await accountService.getAccountByEmail(email);
    if (!!user) {
        if (user.accountType && user.accountType !== 'facebook') {
            await accountService.updateAccountById(user._id, {
                accountType: 'facebook',
                fullname,
                avatar,
            });
        }
        const token = await tokenService.generateAuthTokens(user);
        const { role } = user;
        return sendSuccess(
            res,
            { token, role },
            httpStatus.OK,
            'Đăng nhập thành công'
        );
    }
    const username = generateFromEmail(email, 3);
    const newUser = await accountService.createAccount({
        email,
        fullname,
        avatar,
        username,
        password: '123456.abc',
        phoneNumber: `09${new Date().getTime().toString().slice(5)}`,
        accountType: 'facebook',
    });
    console.log(`newUser`, newUser);
    const token = await tokenService.generateAuthTokens(newUser);
    const { role } = newUser;
    return sendSuccess(
        res,
        { token, role },
        httpStatus.OK,
        'Đăng nhập facebook thành công'
    );
});

const forgotPassword = catchAsync(async (req, res) => {
    const email = req.params.email;
    const resetPasswordToken = await tokenService.generateResetPasswordToken(
        email
    );
    await emailService.sendResetPasswordEmail(email, resetPasswordToken);
    sendSuccess(
        res,
        { token: resetPasswordToken },
        httpStatus.OK,
        'Reset email sent'
    );
});

const resetPassword = catchAsync(async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.password);
    sendSuccess(res, {}, httpStatus.OK, 'Password reset');
});

const changePassword = catchAsync(async (req, res) => {
    await authService.changePassword(req.user._id, req.body);
    sendSuccess(res, {}, httpStatus.OK, 'Cập nhật thành công');
});
const getProfile = catchAsync(async (req, res) => {
    const user = req.user;
    const profile = await accountService.getProfile(user);
    sendSuccess(res, profile, httpStatus.OK, 'Lấy thông tin thành công');
});
const updateProfile = catchAsync(async (req, res) => {
    const account = await accountService.updateAccountById(
        req.user._id,
        req.body
    );
    sendSuccess(res, account, httpStatus.OK, 'Cập nhật thành công');
});
const updateAvatar = catchAsync(async (req, res) => {
    const id = req.user._id;
    const image = await imageService.addImage(req.file);
    const account = await accountService.updateAvatar(id, image.data);
    sendSuccess(res, account, httpStatus.OK, 'Cập nhật thành công');
});
const sendVerificationEmail = catchAsync(async (req, res) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
        req.user
    );
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(httpStatus.OK).send();
});

const verifyEmail = catchAsync(async (req, res) => {
    await authService.verifyEmail(req.query.token);
    sendSuccess(res, {}, httpStatus.OK, 'Email confirmed');
});
module.exports = {
    login,
    updateProfile,
    updateAvatar,
    changePassword,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
    getProfile,
    checkAccountExists,
    loginWithGoogle,
    loginWithFacebook,
};
