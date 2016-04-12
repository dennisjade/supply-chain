(function() {

  module.exports.parsePartNumber = function(text){
    var partNumber = ''

    var arr = text.split(' ');
    var counter = 0;

    while(counter<arr.length){
      if (arr[counter].toLowerCase().indexOf('pn')>=0){
        if (arr[counter].length < 6 && (counter+1) < arr.length)
          partNumber= arr[counter+1]
        else
          partNumber= arr[counter].toLowerCase().replace('pn','')
        break;
      }
      counter++;
    }

    return partNumber
  }

  module.exports.parsePN = function(text){
    var pn = null;
    var PNLEN = 7;

    if (text) {
        var arr = text.toUpperCase().split(/PN|PART.?NUMBER|PART.?NO{0,1}/g);
        console.log('arr',arr)
        pn = arr[arr.length - 1].trim().split(/\s/g)[0]
        //pn = (arr[arr.length - 1]).replace(/[^a-zA-Z0-9]/g, "");
        console.log('pn',pn)
        pn = ((pn.length != PNLEN) ? null : pn);
    }
    return pn;
  }

}).call(this)
