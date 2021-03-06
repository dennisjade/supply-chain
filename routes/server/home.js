(function() {

  var commonHelpers = require('../../helpers/common')

  module.exports =  function(app){

    showHome = function(req, res) {
      if ( commonHelpers.parseCookies(req.headers.cookie)['username'] ){
        var username = commonHelpers.capitalizeFirstLetter(commonHelpers.parseCookies(req.headers.cookie)['username'].replace("'",''))
        var json = {page: 'home', username: username, isFirstTime: req.session.isFirstTime}

        req.session.isFirstTime = false
        return res.render('home.jade', json)
      }else{
        res.redirect('/')
      }
    }

    app.get('/home', showHome)
  }
}).call(this);