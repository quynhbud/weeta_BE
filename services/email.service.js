const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const htmlEmailConfirm = require('../constant/confirmEmail');
const htmlResetPassword = require('../constant/resetPassEmail');
const htlmRejectArticle = require('../constant/rejectArticleEmail');
const htlmAcceptArticle = require('../constant/acceptArticleEmail');
const htmlWelcome = require('../constant/welcomeEmail');
//const htmlReject = require('../constant/rejectEmail');
const htmlApprove = require('../constant/approveEmail');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch((e) =>
            logger.warn(
                'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
                e
            )
        );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text = '', html = '') => {
    const msg = { from: config.email.from, to, subject, text, html };
    await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Lấy lại mật khẩu';
    const resetPasswordUrl = `${config.frontEndUrl}/lay-lai-mat-khau?token=${token}`;
    const html = htmlResetPassword(resetPasswordUrl);
    await sendEmail(to, subject, '', html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
    const subject = 'Xác thực tài khoản';
    const verificationEmailUrl = `${config.frontEndUrl}/xac-thuc?token=${token}`;
    const html = htmlEmailConfirm(verificationEmailUrl);
    await sendEmail(to, subject, '', html);
};

/**
 * Send welcome business email
 * @param {string} to
 * @returns {Promise}
 */
const sendWelcomeBusinessEmail = async (to) => {
    const subject = 'Thông báo đăng ký doanh nghiệp';
    const html = htmlWelcome();
    await sendEmail(to, subject, '', html);
};

/**
 * Send approve business email
 * @param {string} to
 * @returns {Promise}
 */
const sendApproveBusinessEmail = async (to, token, username) => {
    const subject = 'Thông báo hợp tác';
    const accountBusiness = `${config.frontEndUrl}/xac-thuc?token=${token}`;
    const html = htmlApprove(accountBusiness, username);
    await sendEmail(to, subject, '', html);
};

/**
 * Send reject business email
 * @param {string} to
 * @returns {Promise}
 */
const sendRejectBusinessEmail = async (to) => {
    const subject = 'Thông báo hợp tác';
    const html = htmlReject();
    await sendEmail(to, subject, '', html);
};
/**
 * Send reject article email
 * @param {string} to
 * @param {string} reasonReject
 * @param {string} id
 * @returns {Promise}
 */
 const sendRejectArticleEmail = async (to, id, reasonReject) => {
    const subject = 'Từ chối bài viết';
    const articleUrl = `${config.frontEndUrl}bai-dang/${id}`;
    const html = htlmRejectArticle(articleUrl, reasonReject);
    await sendEmail(to, subject, '', html);
};
/**
 * Send accept article email
 * @param {string} to
 * @param {string} id
 * @returns {Promise}
 */
 const sendAcceptArticleEmail = async (to, id) => {
    const subject = 'Duyệt bài viết';
    const articleUrl = `${config.frontEndUrl}bai-dang/${id}`;
    const html = htlmAcceptArticle(articleUrl);
    await sendEmail(to, subject, '', html);
};
module.exports = {
    transport,
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
    sendWelcomeBusinessEmail,
    sendApproveBusinessEmail,
    sendRejectBusinessEmail,
    sendRejectArticleEmail,
    sendAcceptArticleEmail,
};
