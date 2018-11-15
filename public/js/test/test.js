var Now = new Date();
var NowTime = Now.getFullYear();
NowTime += '-' + leadingZeros((Now.getMonth() + 1), 2);
NowTime += '-' + leadingZeros(Now.getDate(), 2);
NowTime += ' ' + leadingZeros(Now.getHours(), 2);
NowTime += ':' + leadingZeros(Now.getMinutes(), 2);
NowTime += ':' + leadingZeros(Now.getSeconds(), 2);

/*
*==================================================================
*  current time zero add
*==================================================================
*/
function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

/*
*==================================================================
*  moment js countdown
*==================================================================
*/
var tHour,tMinute,tSecond = 0;

function updateClock() {
    var now = moment();
    var eventTime = moment("154110", "hhmmss");

    var diffT = eventTime - now;
    tHour = Math.floor(diffT % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    tMinute = Math.floor(diffT % (1000 * 60 * 60) / (1000 * 60));
    tSecond = Math.floor((diffT % (1000 * 60) / 1000));

    console.log("현재" + now);
    console.log("이벤트" + eventTime);
    console.log("카운트다운 시간" + leadingZeros(tHour, 2));
    console.log("카운트다운 분" + leadingZeros(tMinute, 2));
    console.log("카운트다운 초" + leadingZeros(tSecond, 2));

    /*
    days = distance / (1000 * 60 * 60 * 24)
    hours = distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)
    minutes = distance % (1000 * 60 * 60) / (1000 * 60)
    seconds = distance % (1000 * 60) / 1000)
    */
}

var clear = setInterval(function () {
    updateClock();
    if(tHour == 0 && tMinute==0 && tSecond==0){
        clearInterval(clear);
    }
}, 1000);



