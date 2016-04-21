(function() {

  module.exports =  function(app){
    //PPM = require('../../models/ppm')

    showIndex = function(req, res) {
      console.log('aaaaaa',req.session.isFirstTime, typeof req.session.isFirstTime == 'undefined', req.session.isFirstTime==true)
      if (req.session.isFirstTime==true || typeof req.session.isFirstTime == 'undefined'){
        var json = {page: 'index'};
        return res.render('index.jade', json);
      }else
        res.redirect('/home')
    }

    app.get('/', showIndex)
  }
}).call(this);