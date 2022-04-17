const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('./return.controller');
const {Location} = require('./../models');
const { keyBy } = require('lodash')


const getDistricts = catchAsync(async (req, res) => {
  const province = await Location.findOne({code: 79});
  const district = province.districts.map((district) => {
    return {
      name: district.name,
      code: district.code,
    }
  })
  sendSuccess(res, district, 200, 'get list districts successfully');
});

const getWards = catchAsync(async (req, res) => {
  const code = req.params.codeDistrict;
  const province = await Location.findOne({code: 79});
  const objDistrict = keyBy(province.districts, 'code');
  const district = objDistrict[code] || {};
  const wards = district.wards.map((ward) => {
    return {
      name: ward.name,
      code: ward.code,
    }
  })
  sendSuccess(res, wards, 200, 'get list wards successfully');
})

module.exports = {
  getDistricts,
  getWards
}