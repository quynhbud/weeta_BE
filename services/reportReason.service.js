const httpStatus = require('http-status');
const { ReportReason } = require('../models');

const createReason = async (data) => {
    try {
        const reason = await ReportReason.create(data);
        return {
            status: 200,
            data: reason,
            message: 'Tạo lý do báo cáo mới thành công',
        };
    } catch {
        return {
            status: 500,
            message: 'Tạo lý do thất bại',
        };
    }
};

const updateReason = async (data) => {
    try {
        const { reasonId, ...rest } = data;
        const reason = await ReportReason.findById(reasonId);
        if (!reason) throw new Error('Không tìm thấy lý do');
        const result = Object.assign(reason, rest);
        await result.save();
        return {
            status: 200,
            data: result,
            message: 'Cập nhật lý do thành công',
        };
    } catch {
        return {
            status: 500,
            message: 'Cập nhật lý do thất bại',
        };
    }
};

const deleteReason = async (id) => {
    try {
        const reason = await ReportReason.findById(id);
        if (!reason) throw new Error('Không tìm thấy lý do');
        await reason.remove();
        return {
            status: 200,
            data: {},
            message: 'Xóa lý do thành công',
        };
    } catch {
        return {
            status: 500,
            message: 'Xóa lý do thất bại',
        };
    }
};

const getListReason = async (params) => {
    try {
        const reasons = await ReportReason.find({ ...params });
        const total = await ReportReason.find({ ...params }).count();
        return {
            status: 200,
            data: { reasons, total },
            message: 'Lấy danh sách lý do thành công',
        };
    } catch {
        return {
            status: 500,
            message: 'Lấy danh sách lý do thất bại',
        };
    }
};

module.exports = {
    createReason,
    updateReason,
    deleteReason,
    getListReason,
};
