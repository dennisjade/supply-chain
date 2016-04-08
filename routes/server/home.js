(function() {

  module.exports =  function(app){

    showHome = function(req, res) {
      var json = {page: 'home'}
      return res.render('home.jade', json)
    }

    app.get('/home', showHome)
  }
}).call(this);