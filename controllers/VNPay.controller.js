
 const {VNPayReturn} = require("../services/VNPay.service");

 const  handleVnpayReturn = async(
   req,
   res,
   next,
 )=> {
   try {
     const body = req.query;
   //   const vnpayServices: VnpayServices = new VnpayServices();
     const result = await VNPayReturn(body);
     if (result.success) {
       res.render("success", { code: "00" });
     } else {
       res.render("success", { code: "97" });
     }
   } catch (e) {
     console.log(e);
     res.json({
         'message':{
             "ENG":"Payment fail",
             "VN":"Thanh toán thành công"
         },
         'status':200,
         'data':'Thanh toán thất bại'
     });
   }
}
module.exports = {
  handleVnpayReturn,
}


