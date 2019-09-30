function loadPage(){
  init();
  setInterval("init()",3000);
}



function getHour(){
  var label;
  var timeAdjust=1278950400;
  var timeGame=144;
  var timeEarth=7;
  var s = (new Date()).getTime();
  var timeEorzea = Math.round((s / 1000 - timeAdjust) * timeGame / timeEarth);
  timeEorzea = Math.round(timeEorzea / 10) * 10;

  var h = Math.floor(timeEorzea % 86400 / 3600);
  var m = Math.floor(timeEorzea % 3600 / 60);

  var sh , sm;
  if (h<10) {
    sh = "0"+h;
  }else {
    sh = h;
  }
  if (m<10) {
    sm = "0"+m;
  }else {
    sm = m;
  }
  // label=document.getElementById("current_time");
  // label.innerText = "<h1>当前艾欧泽亚时间 <small>"+h+":"+m+"</small></h1>";
  $("#current_time").empty();
  $("#current_time").append("<h2 style='color:white'>艾欧泽亚时间</h2> <h1 style='color:white;font-size:75px'>"+sh+" : "+sm+"</h1>");
  return h;
}

function getMinute(){
  var label;
  var timeAdjust=1278950400;
  var timeGame=144;
  var timeEarth=7;
  var s = (new Date()).getTime();
  var timeEorzea = Math.round((s / 1000 - timeAdjust) * timeGame / timeEarth);
  timeEorzea = Math.round(timeEorzea / 10) * 10;
  var m = Math.floor(timeEorzea % 3600 / 60);
  return m;
}

function getWeatherVar(timeMillis) {
    var unixSeconds = parseInt(timeMillis / 1000);
    var bell = unixSeconds / 175;
    console.log(bell);
    var h = bell / 3600 % 24;
    var m = bell % 60;
    console.log(m);
    var increment = (bell + 8 - (bell % 8)) % 24;
    var totalDays = unixSeconds / 4200;
    totalDays = (totalDays << 32) >>> 0;
    var calcBase = totalDays * 100 + increment;
    var step1 = ((calcBase << 11) ^ calcBase) >>> 0;
    var step2 = ((step1 >>> 8) ^ step1) >>> 0;h
    return step2 % 100;
}

function init(){

  var rs = "无";
  var canDo = false;
  var h = getHour();
  var ws = getWeatherVar((new Date()).getTime());
  console.log("现在ET小时："+h);
  $('#List').append("<h4>当前可达成的2.0探索笔记有：</h4></br>");
  //遍历探索笔记所有项
  $('#rrr').empty();
  for (var i in note) {
    var serial = note[i];
    var map,weather,startTime,endTime,place,emotion;
    //遍历每一条探索笔记数据
    for (var j =0;j <serial.length;j++) {
      if (j == 0) {
        map = serial[j];
      }else if (j == 1) {
        weather = serial[j];
      }else if (j == 2) {
        startTime = Number(serial[j]);
      }else if (j == 3) {
        endTime = Number(serial[j]);
      }else if (j == 4) {
        place = serial[j];
      }else {
        emotion = serial[j]
      }
    }

    var rates = zoneRates[map];

    //地图天气序列
    var wsOrder = 0;
    for (var k = 0; k < rates.length -1; k++) {
      if (ws >= rates[k]) {
        wsOrder++;
      }else {
        break;
      }
    }
    var zoneWeather = zoneWeathers[map];
    var weatherRs = zoneWeather[wsOrder];



    if (weather == weatherRs && checkTime(h,startTime,endTime)) {
      if (!canDo) {
        canDo = true;
        rs = "";
      }
      place = place.replace("_",",");
      rs="探索笔记["+i+"]："+map+" | 坐标："+place+" | 时间："+startTime+":00-"+(endTime-1)+":59 | 天气:"+weather+" | 情感动作："+emotion+"\r";
      $('#rrr').append("<div class='alert alert-success' role='alert'>"+rs+"</div>");
      var m = getMinute();
      var nowTime = h + m/(60);
      var per = getPerTime(nowTime,startTime,endTime);
      $('#rrr').append(
        "<div class='progress'><div class='progress-bar progress-bar-success progress-bar-striped active' role='progressbar' aria-valuenow='"+per+"' aria-valuemin='0' aria-valuemax='100' style='width: "+per+"%'>"+
        ""+per+"% passed</div></div>"
      );
      $('#rrr').append("<div class='row' style='margin-bottom: 20px;'><div class='col-xs-2'></div><div class='col-xs-8' style='background-color:#5B5A5B;height:2px;'></div></div>");
    }
  }
}


function checkTime(now,start,end){
  if (start < end) {
    if (now>=start&&now < end) {
      return true;
    }else {
      return false;
    }
  }else {
    if (now >= start) {
      return true;
    }else if (now < end) {
      return true;
    }else {
      return false;
    }
  }
}

function getPerTime(now,start,end){
  var rs
  if (start < end) {
    var all = end - start;
    rs =  (now-start)/all*100;
  }else {
    var all = 24-start+end;
    if (now>start) {
      rs = (now-start)/all*100;
    }else {
      rs = (all-end+now)/all*100;
    }
  }
  return Math.round(rs);
}
