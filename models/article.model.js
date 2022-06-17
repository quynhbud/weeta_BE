const mongoose = require('mongoose');
const { TYPE_USER, PLACES } = require('../constant/base.constant');

/**
 * facilities: {
 *  electronic: 0 = Free
 *  water: 0 = Free
 *  wifi: 0 = Free
 *  limitTime: '' = Free
 * }
 */
const ArticleSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        district: Number,
        ward: Number,
        street: String,
        image: [String],
        price: Number,
        area: Number,
        location: {
            latitude: Number,
            longitude: Number,
        },
        description: {
            type: String,
            trim: true,
        },
        lessor: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Account',
        },
        facilities: {
            typeUser: {
                type: [Number],
                enum: TYPE_USER,
                default: [],
            },
            electric: {
                price: {
                    type: Number,
                    default: 0,
                },
                unit: {
                    type: String,
                    enum: ['kWh'],
                    default: 'kWh',
                },
            },
            water: {
                price: {
                    type: Number,
                    default: 0,
                },
                unit: {
                    type: String,
                    enum: ['perCapita', 'block'],
                    default: 'block',
                },
            },
            wifi: {
                price: {
                    type: Number,
                    default: 0,
                },
                unit: {
                    type: String,
                    enum: ['perCapita'],
                    default: 'perCapita',
                },
            },
            places_around: {
                type: [Number],
                enum: PLACES,
                default: [],
            },
            limitTime: {
                type: String,
                default: '',
            },
            parking: {
                type: Boolean,
            },
            liveWithOwner: {
                type: Boolean,
            },
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        startDateService: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        servicePackageId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'ServicePackage',
        },
        servicePackage: {
            type: String,
            enum: ['COMMON', 'UP', 'TOP'],
            default: 'COMMON',
        },
        endDateService: {
            type: Date,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
ArticleSchema.index({ title: 'text' });
ArticleSchema.virtual('aboutCreated').get(function () {
    const timeAgoMilisecond = Date.now() - this.createdAt;
    const timeAgoSecond = timeAgoMilisecond / 1000;
    var timeResult = null;
    if (timeAgoSecond < 60) {
        timeResult = timeAgoSecond.toFixed(0) + ' seconds ago';
    } else if (timeAgoSecond < 3600) {
        timeResult = (timeAgoSecond / 60).toFixed(0) + ' minutes ago';
    } else if (timeAgoSecond < 86400) {
        timeResult = (timeAgoSecond / 3600).toFixed(0) + ' hours ago';
    } else {
        timeResult = (timeAgoSecond / 86400).toFixed(0) + ' days ago';
    }
    return timeResult;
});
ArticleSchema.virtual('isExpired').get(function () {
    return this.endDate <= Date.now() ? true : false;
});
const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;
