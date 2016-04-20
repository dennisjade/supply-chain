(function() {

  module.exports =  function(app){
    //PPM = require('../../models/ppm')

    showIndex = function(req, res) {
      if (req.session.isFirstTime){
        var json = {page: 'index'};
        return res.render('index.jade', json);
      }else
        res.redirect('/home')
    }

    app.get('/', showIndex)
  }
}).call(this);