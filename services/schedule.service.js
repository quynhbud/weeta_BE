var Cron = require('node-cron');
const Article = require('../models/article.model');
const moment = require('moment');
 

// @Cron(CronExpression.  
Cron.schedule('*/1 * * * *', async () =>  {
  console.log(1);
  const currentTime = new Date();
  const articles = await Article.find("622c60f583c9655d836b6f22");
  console.log("articles", articles)
  // console.log(moment(currentTime).date());
  console.log((articles.endDateService))
  articles.map(async (itm) => {
    if( moment(itm.endDateService).date() === moment(currentTime).date()) {
      console.log(itm)
      // console.log( moment(itm.endDateService).date() === moment(currentTime).date())
      // console.log(itm._id);
      // await Article.updateOne({_id:itm._id},{
      //   title: "abc",
      //   endDateService: itm.endDate,
      //   servicePackageId: '623d886f3d13700751208a7f',
      // })
    }
  })
});
