export default (mongoose) => {
    const ArticleSchema = mongoose.Schema({
      userid:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      title: String,
      text: String,
      tags: [{type: String}],
    }, {timestamps: true});
  
    return mongoose.model('Article', ArticleSchema);
  };