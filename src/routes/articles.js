
// routes/admin/accounts.js
module.exports = async function (AppConfig) {
    AppConfig.app.get('/articles', function (req, res) {
      AppConfig.handlers.Users.get(req, res)
    });
  
    AppConfig.app.post('/articles', async function (req, res) {
      AppConfig.handlers.Users.post(req, res)
    });
  }