(function() {

  var config = require('../config')

  module.exports.getOrdinal = function(n){
   var s=["th","st","nd","rd"],
       v=n%100;
   return n+(s[(v-20)%10]||s[v]||s[0]);
  }
  module.exports.getYesNoMsg = function(classType, partNumber, data){
    switch (classType){
      case 'ppm':
         var yesnoMsg= config.yesnoPPMMsg;
            yesnoMsg = yesnoMsg.replace(/\n/g, '<br/>')
            yesnoMsg = yesnoMsg.replace('#{classType}', '<span class="yesno-text">'+classType.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{partNumber}', '<span class="yesno-text">'+partNumber.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{trend1}', '<span class="yesno-text">'+(data[0]?data[0].PPM_FLAG_TEXT:'')+'</span>')
            yesnoMsg = yesnoMsg.replace('#{trend2}', '<span class="yesno-text">'+(data[0]?data[0].TREND_TEXT:'')+'</span>')
            yesnoMsg = yesnoMsg.replace('#{alertsCount}', '<span class="yesno-text">'+(data[1]?data[1].ALERTS_SUMMARY:'')+'</span>')
        break;
      case 'arr':
        var yesnoMsg= config.yesnoARRMsg;
            yesnoMsg = yesnoMsg.replace(/\n/g, '<br/>')
            yesnoMsg = yesnoMsg.replace('#{classType}', '<span class="yesno-text">'+classType.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{partNumber}', '<span class="yesno-text">'+partNumber.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{alertsCount}', '<span class="yesno-text">'+(data[1]?data[1].ALERTS_SUMMARY:'')+'</span>')
            yesnoMsg = yesnoMsg.replace('#{qualityIndex}', '<span class="yesno-text">'+(data[1]?data[1].QUALITY_INDEX.toFixed(2):'')+'</span>')
            yesnoMsg = yesnoMsg.replace('#{rank}', '<span class="yesno-text">'+(data[1]?module.exports.getOrdinal(data[1].RANK):'')+'</span>')
        break;
      case 'tco':
        var yesnoMsg= config.yesnoTCOMsg;
            yesnoMsg = yesnoMsg.replace(/\n/g, '<br/>')
            yesnoMsg = yesnoMsg.replace('#{classType}', '<span class="yesno-text">'+classType.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{partNumber}', '<span class="yesno-text">'+partNumber.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{bucketDesc}', '<span class="yesno-text">'+(data[0]?data[0].TCO_BUCKET_DESC:'')+'</span>')
            yesnoMsg = yesnoMsg.replace('#{flagDesc}', '<span class="yesno-text">'+(data[0]?data[0].TCO_FLAG_DESC:'')+'</span>')
        break
    }
    return yesnoMsg
  }

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
