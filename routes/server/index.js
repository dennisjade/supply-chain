(function() {

  module.exports =  function(app){
    PPM = require('../../models/ppm')

    showIndex = function(req, res) {
      var json = {page: 'index'};
      return res.render('index.jade', json);
    }

    app.get('/', showIndex)
  }
}).call(this);