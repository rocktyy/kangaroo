'use strict';

class HomeController extends Controller {

  async index() {
    const users = await this.app.mysql.select('user');
    const user = users && users[0] || {};
    this.ctx.body = {
      data: 'Hello! ' + user.name
    };
  }

}

module.exports = HomeController;
