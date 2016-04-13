(function(){

  module.exports =  function(app){

    var config = require('../../config')
    //var ppmModel = require('../../model/ppm')

    searchResult = function(req, res){
      var classType = req.query.classType?req.query.classType.toLowerCase():''
      var partNumber = req.query.partNumber
      var json = {classType:classType, partNumber:partNumber}

      switch(classType){
        case 'ppm' :
        case 'tco':
        case 'weibull':
          var jadeFile = 'search-ppm.jade'
          break;
        case 'arr' :
          var jadeFile = 'search-arr.jade'
          break;
        default:
          var jadeFile = 'home.jade'
      }
      return res.render(jadeFile, json)
    }

    app.get('/search-result',searchResult);
  }
   
}).call(this)