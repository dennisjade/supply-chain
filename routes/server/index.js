(function() {

  module.exports =  function(app){

    showIndex = function(req, res) {
      var json = {page: 'index'};
      return res.render('index.jade', json);
    }

    app.get('/', showIndex)
  }
}).call(this);