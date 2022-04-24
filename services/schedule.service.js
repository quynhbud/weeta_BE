var Cron = require('node-cron');
const Article = require('../models/article.model');
const moment = require('moment');
 

// @Cron(CronExpression.  
Cron.schedule('*/1 * * * *', async () =>  {
  console.log(1);
  const currentTime = new Date();
  const articles = await Article.find({servicePackageId: '623d885d3d13700751208a7d'});
  console.log("articles", articles)
  console.log(moment(currentTime).date());
  // articles.map(async (itm) => {
  //   if( moment(itm.endDateService).date() === moment(currentTime).date()) {
  //     console.log(itm._id);
  //     console.log(moment(itm.endDateService).date(), moment(currentTime).date());
  //     await Article.updateOne({_id:itm._id},{
  //       title: "abc",
  //       endDateService: itm.endDate,
  //       servicePackageId: '623d886f3d13700751208a7f',
  //     })
  //   }
  // })
});
