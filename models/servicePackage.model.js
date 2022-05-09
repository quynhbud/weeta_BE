const mongoose = require('mongoose');

const ServicePackageSchema = mongoose.Schema({
    serviceName: {
        type: String,
    },
    price: Number,
});

const ServicePackage = mongoose.model('ServicePackage', ServicePackageSchema);
module.exports = ServicePackage;
