'use strict';

const controller = require('./controller');

module.exports = function(app) {
   app.route('/sendmessage')
       .post(controller.sendmessage);
   app.route('/readmessages')
       .post(controller.readmessages);
   app.route('/messagedetail')
       .post(controller.messagedetail);
   app.route('/userdetails')
       .post(controller.userdetails);
   app.route('/searchdetails')
       .post(controller.searchdetails);
   app.route('/searchusers')
       .post(controller.searchusers);
};