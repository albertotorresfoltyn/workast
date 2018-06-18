const util = require('util');
export default (AppConfig) => {
  return {
    post: function(req, res) {
      try{
        const body = req.body;
        let a = new AppConfig.models.Article(body)
        a.save();
        res.json({response: util.inspect(a)});
      } catch (err){
        res.status(500).send(err);
      }
    }
  }
}