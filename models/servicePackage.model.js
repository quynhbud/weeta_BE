const mongoose = require('mongoose');

const ServicePackageSchema = mongoose.Schema({
    serviceName: {
        type: String,
    },
    price: Number,
});

const ServicePackage = mongoose.model('service-packages', ServicePackageSchema);
module.exports = ServicePackage;
