const util = require('util');
export default (AppConfig) => {
  return {
    post: function(req, res) {
      try{
        const body = req.body;
        let u = new AppConfig.models.User(body)
        u.save();
        res.json({response: util.inspect(u)});
      } catch (err){
        res.status(500).send(err);
      }
    }
  }
}