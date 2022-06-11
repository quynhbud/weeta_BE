const {
    Article,
    ServicePackage,
    Lessor,
    Account,
    ServicePackageTransaction,
    MemberPackageTransaction,
    MemberPackage,
} = require('../models/index');
const VNPayService = require('./VNPay.service');
const moment = require('moment');
const https = require('https');
const crypto = require('crypto');
const config = require('../config/config');

const paymentPackage = async (req, lessorId, data) => {
    let resultPayment = {};
    if (data.type === 'MEMBERPACKAGE') {
        const saveData = {
            lessorId: lessorId,
            memberPackageName: data.memberPackageName,
            transactionAmount: data.prices,
            paymentMethod: data.paymentMethod,
            status: 'WAITFORPAYMENT',
        };
        const transaction = await MemberPackageTransaction.create(saveData);
        const orderDescription = `${data.type}-${data.memberPackageName}-${transaction._id}-${lessorId}`;
        const transactionData = {
            typeOrders: 'payment',
            amount: `${~~data.prices}`,
            bankCode: 'NCB',
            orderDescription: orderDescription,
            language: 'vn',
            typeCart: 'CLIENT',
            //servicePackage: data.servicePackageId,
            lessor: lessorId,
        };
        resultPayment = await VNPayService.payment(req, transactionData);
    }
    if (data.type === 'SERVICEPACKAGE') {
        const saveData = {
            lessorId: lessorId,
            articleId: data.articleId,
            servicePackageName: data.servicePackageName,
            transactionAmount: data.prices,
            paymentMethod: data.paymentMethod,
            numOfDate: data.numOfDate,
            status: 'WAITFORPAYMENT',
        };
        const transaction = await ServicePackageTransaction.create(saveData);
        const orderDescription = `${data.type}-${data.servicePackageName}-${data.numOfDate}-${lessorId}-${transaction.transactionId}-${data.articleId}`;
        const transactionData = {
            typeOrders: 'payment',
            amount: `${~~data.prices}`,
            bankCode: 'NCB',
            orderDescription: orderDescription,
            language: 'vn',
            typeCart: 'CLIENT',
            //servicePackage: data.servicePackageId,
            lessor: lessorId,
        };
        resultPayment = await VNPayService.payment(req, transactionData);
    }

    if (resultPayment.success) {
        return {
            success: true,
            message: 'Thanh toán thành công',
            data: resultPayment.data.url,
            status: 200,
        };
    } else {
        return {
            success: false,
            message: 'Thanh toán thất bại',
            data: resultPayment.data.url,
            status: 200,
        };
    }
};

const savePaymentResult = async (data) => {
    try {
        let vnp_Params = {
            vnp_Amount: data.vnp_Amount,
            vnp_BankCode: data.vnp_BankCode,
            vnp_BankTranNo: data.vnp_BankTranNo,
            vnp_CardType: data.vnp_CardType,
            vnp_OrderInfo: data.vnp_OrderInfo,
            vnp_PayDate: data.vnp_PayDate,
            vnp_ResponseCode: data.vnp_ResponseCode,
            vnp_TmnCode: data.vnp_TmnCode,
            vnp_TransactionNo: data.vnp_TransactionNo,
            vnp_TransactionStatus: data.vnp_TransactionStatus,
            vnp_TxnRef: data.vnp_TxnRef,
            vnp_SecureHashType: data.vnp_SecureHashType,
            vnp_SecureHash: data.vnp_SecureHash,
        };
        const type = vnp_Params.vnp_OrderInfo.split('-')[0];
        if (type === 'MEMBERPACKAGE') {
            const memberPackageName = vnp_Params.vnp_OrderInfo.split('-')[1];
            const transactionId = vnp_Params.vnp_OrderInfo.split('-')[2];
            const accountId = vnp_Params.vnp_OrderInfo.split('-')[3];
            const memberPackage = await MemberPackage.findOne({
                memberPackageName: memberPackageName,
            });
            const reqData = {
                memberPackage: memberPackageName,
                transactionId,
                accountId,
            };
            if (Number(vnp_Params.vnp_TransactionStatus) === 0) {
                const updateLessor = await updateMemberPackage(reqData);
                const updateTransaction =
                    await MemberPackageTransaction.updateOne(
                        { _id: transactionId },
                        { status: 'SUCCESS' }
                    );
                return {
                    success: true,
                    type: 'MEMBERPACKAGE',
                    paymentId: transactionId,
                    data: updateLessor.data,
                    message: 'Thanh toán thành công',
                    status: 200,
                };
            }
            return {
                success: false,
                message: 'Thanh toán thất bại',
                status: 300,
            };
        }
        if (type === 'SERVICEPACKAGE') {
            const servicePackageName = vnp_Params.vnp_OrderInfo.split('-')[1];
            const numOfDate = vnp_Params.vnp_OrderInfo.split('-')[2];
            //const lessorId = vnp_Params.vnp_OrderInfo.split('-')[2];
            const transactionId = vnp_Params.vnp_OrderInfo.split('-')[4];
            const articleId = vnp_Params.vnp_OrderInfo.split('-')[5];
            const reqData = {
                numOfDate,
                servicePackageName,
                articleId,
            };
            if (Number(vnp_Params.vnp_TransactionStatus) === 0) {
                const updateArticle = await updateServicePackage(reqData);
                const updateTransaction =
                    await ServicePackageTransaction.updateOne(
                        { transactionId: transactionId },
                        { status: 'SUCCESS' }
                    );
                const transaction = await ServicePackageTransaction.findOne({
                    transactionId: transactionId,
                });
                return {
                    success: true,
                    type: 'SERVICEPACKAGE',
                    paymentId: transaction._id,
                    articleId: articleId,
                    data: updateArticle.data,
                    message: 'Thanh toán thành công',
                    status: 200,
                };
            }
            return {
                success: false,
                message: 'Thanh toán thất bại',
                status: 300,
            };
        }
    } catch {
        return {
            success: false,
            message: 'Thanh toán thất bại',
            status: 500,
        };
    }
};
const updateMemberPackage = async (data) => {
    const memberPackage = await MemberPackage.findOne(data.memberPackageName);
    const updateData = {
        memberPackage: memberPackage.memberPackageName,
        articleTotal: memberPackage.articlePerMonth,
        articleUsed: 0,
    };
    await Lessor.updateOne({ account: data.accountId }, updateData);
    const updateLessor = await Lessor.findOne({ account: data.accountId });
    return {
        data: updateLessor,
        message: 'Cập nhật gói thành viên người cho thuê thành công',
    };
};
const updateServicePackage = async (data) => {
    const currentTime = new Date();
    const article = await Article.findOne({ _id: data.articleId });
    const numOfDate = moment(article.endDate)
        .endOf('day')
        .diff(moment(currentTime).startOf('day'), 'day');
    if (data.numOfDate > numOfDate) {
        return {
            data: [],
            message:
                'Vui lòng chọn số ngày gói dịch vụ nhỏ hơn số ngày còn lại của bài đăng',
        };
    }
    const servicePackage = await ServicePackage.findOne({
        serviceName: data.servicePackageName,
    });
    const updateData = {
        startDateService: currentTime,
        endDateService: moment(currentTime).add(data.numOfDate, 'day').format(),
        servicePackageId: servicePackage._id,
        isPublished: true,
    };
    await Article.updateOne({ _id: data.articleId }, updateData);
    const updatedArticle = await Article.findById(data.articleId);
    return {
        data: updatedArticle,
        message: 'Cập nhật gói dịch vụ cho bài đăng thành công',
    };
};

//payment with momo
const paymentWithMomo = async (data, lessorId) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    try {
        let orderRef = '';
        if (data.type === 'MEMBERPACKAGE') {
            const saveData = {
                lessorId: lessorId,
                memberPackageName: data.memberPackageName,
                transactionAmount: data.prices,
                paymentMethod: data.paymentMethod,
                status: 'WAITFORPAYMENT',
            };
            const transaction = await MemberPackageTransaction.create(saveData);
            orderRef = `${data.type}-${data.memberPackageName}-${transaction._id}-${lessorId}`;
        }
        if (data.type === 'SERVICEPACKAGE') {
            const saveData = {
                lessorId: lessorId,
                articleId: data.articleId,
                servicePackageName: data.servicePackageName,
                transactionAmount: data.prices,
                paymentMethod: data.paymentMethod,
                numOfDate: data.numOfDate,
                status: 'WAITFORPAYMENT',
            };
            const transaction = await ServicePackageTransaction.create(
                saveData
            );
            orderRef = `${data.type}-${data.servicePackageName}-${data.numOfDate}-${lessorId}-${transaction.transactionId}-${data.articleId}`;
        }
        var partnerCode = 'MOMO5J4720220527';
        var accessKey = '1blLSTSnxiWGuWq8';
        var secretkey = 'GUkWgoNWTsA86OrgekdHYV4duZnu8vf7';
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = orderRef;
        var redirectUrl = 'http:localhost:5000/api/payment/save-payment-momo';
        var ipnUrl = 'https://callback.url/notify';
        // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
        var amount = data.prices;
        var requestType = 'captureWallet';
        var extraData = ''; //pass empty value if your merchant does not have stores

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature =
            'accessKey=' +
            accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            extraData +
            '&ipnUrl=' +
            ipnUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderRef +
            '&partnerCode=' +
            partnerCode +
            '&redirectUrl=' +
            redirectUrl +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType;
        //puts raw signature
        console.log('--------------------RAW SIGNATURE----------------');
        console.log(rawSignature);
        //signature
        var signature = crypto
            .createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
        console.log('--------------------SIGNATURE----------------');
        console.log(signature);

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'en',
        });
        console.log('requestBody', requestBody);
        //Create the HTTPS objects
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
        };
        console.log('options', options);
        //Send the request and get the response
        const req = https.request(options, (res) => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Headers: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (body) => {
                console.log('Body: ');
                console.log(body);
                console.log('payUrl: ');
                console.log(JSON.parse(body).payUrl);
            });
            console.log(res.body);
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        // write data to request body
        console.log('Sending....');
        req.write(requestBody);
        req.end();
    } catch {
        return {
            status: 500,
            message: 'Gửi yêu cầu thanh toán thất bại',
        };
    }
};

const savePaymentMomo = async (data) => {
    try {
        const params = {
            partnerCode: data.partnerCode,
            orderId: data.orderId,
            requestId: data.requestId,
            amount: data.amount,
            orderInfo: data.orderInfo,
            orderType: data.orderType,
            transId: data.transId,
            resultCode: data.resultCode,
            message: data.message,
            payType: data.payType,
            responseTime: data.responseTime,
            extraData: '',
            signature: data.signature,
        };
        const type = params.orderInfo.split('-')[0];
        if (params.resultCode === '0') {
            if (type === 'MEMBERPACKAGE') {
                const memberPackageName = params.orderInfo.split('-')[1];
                const transactionId = params.orderInfo.split('-')[2];
                const accountId = params.orderInfo.split('-')[3];
                const memberPackage = await MemberPackage.findOne({
                    memberPackageName,
                });
                const reqData = {
                    memberPackage: memberPackageName,
                    transactionId,
                    accountId,
                };
                const updateLessor = await updateMemberPackage(reqData);
                await MemberPackageTransaction.updateOne(
                    { _id: transactionId },
                    { status: 'SUCCESS' }
                );
                return {
                    success: true,
                    type: 'MEMBERPACKAGE',
                    paymentId: transactionId,
                    data: updateLessor.data,
                    message: 'Thanh toán thành công',
                    status: 200,
                };
            }
            if (type === 'SERVICEPACKAGE') {
                const servicePackageName = params.orderInfo.split('-')[1];
                const numOfDate = params.orderInfo.split('-')[2];
                //const lessorId = params.orderInfo.split('-')[2];
                const transactionId = params.orderInfo.split('-')[4];
                const articleId = params.orderInfo.split('-')[5];
                const reqData = {
                    numOfDate,
                    servicePackageName,
                    articleId,
                };
                const updateArticle = await updateServicePackage(reqData);
                await ServicePackageTransaction.updateOne(
                    { transactionId: transactionId },
                    { status: 'SUCCESS' }
                );
                const transaction = await ServicePackageTransaction.findOne({
                    transactionId: transactionId,
                });
                return {
                    success: true,
                    type: 'SERVICEPACKAGE',
                    paymentId: transaction._id,
                    articleId: articleId,
                    data: updateArticle.data,
                    message: 'Thanh toán thành công',
                    status: 200,
                };
            }
        }
        return {
            status: 500,
            message: 'Thanh toán thất bại',
        };
    } catch {
        return {
            status: 500,
            message: 'Thanh toán thất bại',
        };
    }
};

module.exports = {
    paymentPackage,
    savePaymentResult,
    updateMemberPackage,
    updateServicePackage,
    paymentWithMomo,
    savePaymentMomo,
};
