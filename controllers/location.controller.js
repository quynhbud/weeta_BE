const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('./return.controller');
const {Location} = require('./../models');


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

// const getWard = catchAsync(async (req, res) => {
//   const code = req.params.code;
//   const province = await Location.findOne({code: 79});
//   const codeWard = keyBy(province.districts, 'code')
//   sendSuccess(res, district, 200, 'get list districts successfully');
// })

module.exports = {
  getDistricts
}