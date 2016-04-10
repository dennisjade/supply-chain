(function(){
  module.exports =  function(app){

    searchResult = function(req, res){
      var classType = req.query.classType?req.query.classType.toLowerCase():''
      var json = {classType:classType}

      switch(classType){
        case 'ppm' :
          var jadeFile = 'search-ppm.jade'
          break;
        case 'arr' :
          var jadeFile = 'search-arr.jade'
          break;
        default :
          var jadeFile = 'home.jade'
          break;
      }
      return res.render(jadeFile, json)
    }

    app.get('/search-result',searchResult)
  
  }
   
}).call(this)