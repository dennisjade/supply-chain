(function(){

  module.exports =  function(app){

    var config = require('../../config')
    //var ppmModel = require('../../model/ppm')

    searchResult = function(req, res){
      var classType = req.query.classType?req.query.classType.toLowerCase():''
      var partNumber = req.query.partNumber
      var vintage = req.query.vintage
      var json = {classType:classType, partNumber:partNumber, vintage: vintage}

      switch(classType){
        case 'ppm' :
          var jadeFile = 'search-ppm.jade';
          break;
        case 'tco':
          var jadeFile= 'search-tco.jade'
          break;
        case 'weibull':
          var jadeFile = 'search-weibull.jade'
          break;
        case 'arr' :
          var jadeFile = 'search-arr.jade'
          break;
        case 'overall':
          var jadeFile = 'search-overall.jade'
          break
        default:
          var jadeFile = 'home.jade'
      }
      return res.render(jadeFile, json)
    }

    app.get('/search-result',searchResult);
  }
   
}).call(this)