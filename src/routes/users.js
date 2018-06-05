
// routes/admin/accounts.js
module.exports = async function (AppConfig) {
  AppConfig.app.get('/users', function (req, res) {
    AppConfig.handlers.Users.post(req, res)
  });

  AppConfig.app.post('/users', async function (req, res) {
    AppConfig.handlers.Users.post(req, res)
  });
}