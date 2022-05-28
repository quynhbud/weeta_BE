var Cron = require('node-cron');
const Article = require('../models/article.model');
const moment = require('moment');


// @Cron(CronExpression.  
Cron.schedule("*/10 * * * * *", async () => {
  console.log(1);
  const currentTime = new Date();
  const startDate = moment(currentTime).startOf('day').toDate();
  const endDate = moment(currentTime).endOf('day').toDate();
  const articles = await Article.find({ endDateService: { $gte: startDate , $lte: endDate }});
  articles.map(async (itm) => {
    // console.log(itm._id);
    await Article.updateOne({_id: itm._id}, {
      servicePackageId: "623d886f3d13700751208a7f",
      endDateService : itm.endDate,
    })
  })
});
