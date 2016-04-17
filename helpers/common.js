(function() {

  var config = require('../config')
  var _ = require('underscore')

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
      case 'weibull':
        var yesnoMsg= config.yesnoWEIBULLMsg;
            yesnoMsg = yesnoMsg.replace(/\n/g, '<br/>')
            yesnoMsg = yesnoMsg.replace('#{classType}', '<span class="yesno-text">'+classType.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{partNumber}', '<span class="yesno-text">'+partNumber.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{vintageNumber}', '<span class="yesno-text">'+(data[0]?data[0].BUILT_YEAR_MONTH:'')+'</span>')
            var prediction = ((data[0]?data[0].Prediction:0) * 100).toFixed(2) + '%'
            yesnoMsg = yesnoMsg.replace('#{prediction}', '<span class="yesno-text">'+prediction+'</span>')
        break;
      case 'overall':
        var yesnoMsg= config.yesnoOVERALLMsg;
            yesnoMsg = yesnoMsg.replace(/\n/g, '<br/>')
            yesnoMsg = yesnoMsg.replace('#{classType}', '<span class="yesno-text">'+classType.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{partNumber}', '<span class="yesno-text">'+partNumber.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{vintageNumber}', '<span class="yesno-text">'+(data[0]?data[0].BUILT_YEAR_MONTH:'')+'</span>')
            yesnoMsg = yesnoMsg.replace('#{summaryRemarks}', '<span class="yesno-text">'+(data[0]?data[0].SUMMARY_REMARKS:'')+'</span>')
            yesnoMsg = yesnoMsg.replace('#{arrDesc}', '<span class="yesno-text">'+(data[0]?data[0].ARR_DESC:'')+'</span>')
            yesnoMsg = yesnoMsg.replace('#{ppmDesc}', '<span class="yesno-text">'+(data[0]?data[0].PPM_DESC:'')+'</span>')
            
            var tcoBucketDesc = data[0]?data[0].TCO_BUCKET_DESC:''
            var tcoFlagDesc = data[0]?data[0].TCO_FLAG_DESC:''
            yesnoMsg = yesnoMsg.replace('#{tcoBucketDescAndFlag}', '<span class="yesno-text">'+(tcoBucketDesc + ' ' + tcoFlagDesc)+'</span>')

            var fiveYrBucketDesc = data[0]?data[0]['5YR-FR_BUCKET_DESC']:''
            var prediction = ((data[0]?data[0].Prediction:0) * 100).toFixed(2) + '%'
            yesnoMsg = yesnoMsg.replace('#{fiveYrBucketDesc}', '<span class="yesno-text">'+(fiveYrBucketDesc+' ('+prediction+')')+'</span>')
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

  module.exports.parseVintage = function(text){
    var vintage = null;
    var YRLEN = 4;

    if (text) {
        var arr = text.toUpperCase().split(/BUILD|BUILT|BUILT.?ON|BUILD.?ON{0,1}/gi);
        vintage = arr[arr.length - 1].trim().split(/\s|\-/g)
        //pn = (arr[arr.length - 1]).replace(/[^a-zA-Z0-9]/g, "");
        console.log(arr,vintage)
        var monthTemp = vintage[0].toLowerCase()
        var monthNamesShort = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        var monthNamesLong = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        month = monthTemp.length>3? monthNamesLong.indexOf(monthTemp) : monthNamesShort.indexOf(monthTemp) 
        if (month>=0){
          month += 1
          month = module.exports.padZero(month,2)
        }
        console.log('month', month)

        var year = null
        if (vintage.length>1){
          console.log('aaaa', vintage[1].length, isNaN(vintage[1]))
          var year = vintage[1].length==YRLEN && !isNaN(vintage[1])?vintage[1]:null  
        }
        vintage = year==null||month==-1?null:year+'_'+month
        console.log('vintage',vintage)
        //vintage = ((vintage.length != YRLEN) ? null : vintage);
    }
    return vintage;
  }

  module.exports.padZero = function (n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

}).call(this)
