/*var Now = new Date();
var NowTime = Now.getFullYear();
NowTime += '-' + leadingZeros((Now.getMonth() + 1), 2);
NowTime += '-' + leadingZeros(Now.getDate(), 2);
NowTime += ' ' + leadingZeros(Now.getHours(), 2);
NowTime += ':' + leadingZeros(Now.getMinutes(), 2);
NowTime += ':' + leadingZeros(Now.getSeconds(), 2);*/

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
var tDay, tHour, tMinute, tSecond = 0;
var fromDate = "240000";

function updateClock() {
    var now = moment();
    var eventTime = moment(fromDate, "hhmmss");

    var diffT = eventTime - now;
    tDay = Math.floor(diffT / (1000 * 60 * 60 * 24));
    tHour = Math.floor(diffT % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    tMinute = Math.floor(diffT % (1000 * 60 * 60) / (1000 * 60));
    tSecond = Math.floor((diffT % (1000 * 60) / 1000));

    console.log("현재" + now);
    console.log("이벤트" + eventTime);
    console.log("카운트다운 데이" + leadingZeros(tDay, 2));
    console.log("카운트다운 시간" + leadingZeros(tHour, 2));
    console.log("카운트다운 분" + leadingZeros(tMinute, 2));
    console.log("카운트다운 초" + leadingZeros(tSecond, 2));
    var mSecond = parseInt($.trim(now).substr(10, 1));
    var mSecondTemp;
    switch (mSecond) {
        case 1 :
            mSecondTemp = 9;
            break;
        case 2 :
            mSecondTemp = 8;
            break;
        case 3 :
            mSecondTemp = 7;
            break;
        case 4 :
            mSecondTemp = 6;
            break;
        case 5 :
            mSecondTemp = 5;
            break;
        case 6 :
            mSecondTemp = 4;
            break;
        case 7 :
            mSecondTemp = 3;
            break;
        case 8 :
            mSecondTemp = 2;
            break;
        case 9 :
            mSecondTemp = 1;
            break;
        default :
            mSecondTemp = 0;
            break;
    }
    console.log("카운트다운 밀리" + mSecondTemp);
    /*
    days = distance / (1000 * 60 * 60 * 24)
    hours = distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)
    minutes = distance % (1000 * 60 * 60) / (1000 * 60)
    seconds = distance % (1000 * 60) / 1000)
    */
}

/*var clear = setInterval(function () {
    updateClock();
    if (tHour <= 0 && tMinute <= 0 && tSecond <= 0) {
        clearInterval(clear);
        console.log("카운트다운 없음");
    }
}, 100);*/


/*
*==================================================================
*  다음주 일요일 구하기 날짜 구하기
*==================================================================
*/
week = ['일', '월', '화', '수', '목', '금', '토'];

for (var i = 0; i < 7; i++) {
    var Now = new Date();
    var B = new Date(Now.setDate(Now.getDate() + 7 + i)).getDay();
    if (B == 0) {
        var NowC = new Date();
        var C = new Date(NowC.setDate(NowC.getDate() + 7 + i)).getDate();
        break;
    }
}
var NowT;
NowT = Now.getFullYear();
NowT += '-' + (Now.getMonth() + 1);
NowT += '-' + C;
console.log("다음주 일요일은 " + NowT);


NowT = Now.getFullYear();
NowT += '-' + leadingZeros((Now.getMonth() + 1), 2);
NowT += '-' + leadingZeros(C, 2);
console.log("다음주 일요일은 " + NowT);


/*
*==================================================================
*  다음주 일요일 구하기 요일 구하기
*==================================================================
*/
week = ['일', '월', '화', '수', '목', '금', '토'];
for (var i = 0; i < 7; i++) {
    var Now = new Date();
    var B = new Date(Now.setDate(Now.getDate() + 7 + i)).getDay();
    if (B == 0) {
        break;
    }
}
console.log(B);
console.log(week[B]);

function dateSeparation() {
    var str = "2018-11-13T17:29:50.000+09:00 ";
    var strArry = str.split('-');
    var strT =  strArry[2].split('T');
    var strC = strT[1].split(':');
    var strD = strC[2].split('.');
    var total = strArry[0];
    total += '-' + strArry[1];
    total += '-' + strArry[1];
    total += ' ' + strT[0];
    total += ':' + strC[0];
    total += ':' + strC[1];
    total += ':' + strD[0];
    console.log(total);
}


function dateSeparation2() {

    /*
    https://momentjs.com
    저는 모먼트 JS 이용하고 있는데 이것도 참고하세요 :)
    */
    var moment22 =  moment("2018-11-13T17:29:50.000+09:00").format('YYYY-MM-DD hh:mm:ss');
    console.log(moment22);
    alert(moment22);
}

function dateSeparation3() {
    let datestring = '2018-11-13T17:29:50.000+09:00';

    let date = new Date(datestring);
    [date.getFullYear(), date.getMonth()+1,date.getDate()].join('-') +' ' +
    [date.getHours(), date.getMinutes(), date.getSeconds()].join(':')
    console.log(date);
}