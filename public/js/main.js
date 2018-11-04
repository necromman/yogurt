$(function () {

    /*
    *==================================================================
    *  current time zero add
    *==================================================================
    */
    var Now = new Date();
    var NowTime = Now.getFullYear();
    NowTime += '-' + leadingZeros((Now.getMonth() + 1), 2);
    NowTime += '-' + leadingZeros(Now.getDate(), 2);
    NowTime += ' ' + leadingZeros(Now.getHours(), 2);
    NowTime += ':' + leadingZeros(Now.getMinutes(), 2);
    NowTime += ':' + leadingZeros(Now.getSeconds(), 2);


    function leadingZeros(n, digits) {
        var zero = '';
        n = n.toString();

        if (n.length < digits) {
            for (var i = 0; i < digits - n.length; i++)
                zero += '0';
        }
        return zero + n;
    }


    var auth = firebase.auth();
    var database = firebase.database();
    var authProvider = new firebase.auth.GoogleAuthProvider();
    var userInfo;
    auth.onAuthStateChanged(function (user) {
        if (user) {
            userInfo = user;
            if (!$("#chat-history").text()) {
                get_text_list1()
            }
            get_food_list();
            get_menu_list_changed();
            swiper_func();
        } else {
            firebase.auth().signInAnonymously(); // 익명로그인
        }
    })
    var divUtc = $('#divUTC');
    var divLocal = $('#divLocal');
    var localTime;
    // =========== moment.js 스크립트 시작
    setInterval(function () {
        divUtc.text(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
        localTime = moment.utc(divUtc.text()).toDate();
        localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
        divLocal.text(localTime);
    }, 1000);

    // =========== moment.js 스크립트 끝

    function get_food_list() {
        /* 음식점 목록 한세트 */
        var publicGetKeyIn = firebase.database().ref('/음식점/' + "food");
        publicGetKeyIn.on('child_added', food_on_child_added);

    }

    function food_on_child_added(data) {
        var key = data.key;
        var sData = data.val();
        var fname = sData.name;
        var fcat = sData.cat;
        var fclosed = sData.closed;
        var fnumber = sData.number;
        var fdelivery = sData.delivery;

        /*범위지정 랜덤*/
        var ranJ = Math.floor((Math.random() * 3) + 1);
        var ranBack;
        switch (ranJ) {
            case 1 :
                ranBack = "/img/1.jpg";
                break;
            case 2 :
                ranBack = "/img/2.jpg";
                break;
            case 3 :
                ranBack = "/img/3.jpg";
                break;
        }

        var fhtml = "<div id='" + key + "' class=\"swiper-slide\">" +
            "              <div class=\"owl-item\">" +
            "                  <div class=\"round-element\" style='background-image: url(" + ranBack + ")'>" +
            "                      <div class=\"above-overlay\">" +
            "                          <h2>" + fname + "</h2>" +
            "                          <p>휴무일 : " + fclosed + "</p>" +
            "                          <p>배달여부 : " + fdelivery + "</p>" +
            "                          <p><a href='tel:" + fnumber + "'>" + fnumber + "</a></p>" +
            "                      </div>" +
            "                      <div class=\"overlay-gradient-large\"></div>" +
            "                  </div>" +
            "              </div>" +
            "          </div>";
        $("#j-swiper-wrapper").prepend(fhtml);
    }

    /* 음식점 목록  한세트 */


    /* 메뉴 목록 한세트 */
    var shopId;
    var cartThis;
    $('#j-swiper-wrapper').on('click', 'div.swiper-slide', function () {

        shopId = $(this).attr("id");
        // shopId = $(this).closest(".swiper-slide").attr("id");
        $("#s_card_wrap").empty();
        get_menu_list();
        $("#s_menu_list").css({
            'left': '0%'
        });
        $('.close_list').css("display", "block");
        $('.close_list').on('click', function () {
            $(this).css("display", "none");
            $("#s_menu_list").css({
                'left': '-100%'
            });
        });
    });

    $(document).on('click', '.sc-add-to-cart', function () {
        cartThis = $(this);
        pushMenu();
    });
    //AJAX사용 후 불러온 엘리먼트의 이벤트가 작동 하지 않을때

    /*푸시메뉴*/
    var dataMenu;
    var dataOrder;
    function pushMenu() {
        var dataShop = cartThis.attr("data-shop");
        dataMenu = cartThis.attr("data-name");
        var dataPrice = cartThis.attr("data-price");
        dataOrder = parseInt(cartThis.attr("data-order"));

        var publicKeyIn = database.ref('/음식점/' + "/food/" + "/" + shopId + "/" + "/menu/" + dataMenu);
        var chatKeyIn = database.ref('/채팅/' + "퍼블릭채팅");
        publicKeyIn.update({
            order: dataOrder + 1
        });
        var keyword = "<h3>" + dataMenu + "</h3><p>가격:" + dataPrice + "<br>상호:" + sName + "</p>"
        chatKeyIn.push({
            keyword: keyword,
            date: localTime,
            shopname: sName,
            mmenu: dataMenu,
            mprice: dataPrice,
            user: userInfo.uid
        });
        // cartThis.attr("data-order", dataOrder + 1);
        // cartThis.parent().parent().children(".c_order").children("span").text(dataOrder + 1);
    }
    /*푸시메뉴*/

    function get_menu_list_changed() {
        var shopGetKeyIn = firebase.database().ref('/음식점/' + "/food/");
        shopGetKeyIn.on('child_changed', order_on_changed);
    }

    function order_on_changed() {
        cartThis.parent().parent().children(".c_order").children("span").text(dataOrder + 1);
    }

    function get_menu_list() {
        var shopGetKeyIn = firebase.database().ref('/음식점/' + "/food/");
        shopGetKeyIn.on('child_added', shop_on_child_added);
    }


    var sName;
    var menu_GetKeyIn;
    function shop_on_child_added(data) {
        var key = data.key; // 메뉴이름
        var sData = data.val();
        if (key == shopId) {
            sName = sData.name;
            // menu_GetKeyIn = firebase.database().ref('/음식점/' + "/food/" + "/" + shopId + "/" + "menu").orderByChild('order');
            menu_GetKeyIn = firebase.database().ref('/음식점/' + "/food/" + "/" + shopId + "/" + "menu");
            menu_GetKeyIn.on('child_added', menu_on_child_added);
            setRanColor();
        }
    }

    function menu_on_child_added(data) {
        var key = data.key; // 메뉴이름
        var sData = data.val();
        var mprice = sData.price;
        var morder = sData.order;
        var mgrade = sData.grade;

        var mhtml = "<div class=\"card\">" +
            "              <span class=\"c_img\"><span>" + sName.substr(0, 2) + "</span></span>" +
            "              <span class=\"c_name\">" + key + "</span>" +
            "              <span class=\"c_price\">￦" + mprice + "</span>" +
            "              <span class=\"c_order\">주문횟수 : <span>" + morder + "</span></span>" +
            "              <span class=\"c_like\">좋아요 : " + mgrade + "개</span>" +
            "              <span><button class=\"sc-add-to-cart\" data-shop='" + shopId + "' data-name='" + key + "' data-price='" + mprice + "' data-order='" + morder + "'>이걸로하죠</button></span>" +
            "          </div>"
        // if(morder > 0){$("#s_card_wrap").prepend(mhtml);}else{$("#s_card_wrap").append(mhtml);}
        $("#s_card_wrap").append(mhtml);
    }

    /* 메뉴 목록  한세트 */


    /* 채팅 한세트 */
    function get_text_list1() {
        var publicGetKeyIn = firebase.database().ref('/채팅/' + "퍼블릭채팅");
        publicGetKeyIn.on('child_added', public_on_child_added);

    }

    function public_on_child_added(data) {
        var key = data.key;
        var sData = data.val();
        var Kword = sData.keyword;
        var Kdate = sData.date;
        var jUser = sData.user;
        var mPrice = sData.mprice;

        var html2 =
            "<div id='" + jUser + "'><div id='" + key + "' class='timeline-item' data-price='" + mPrice + "'>" + Kword + "<span>" + Kdate + "</span>" + "</div></div>";

        $("#chat-history").prepend(html2);
        $('#' + userInfo.uid).addClass("bonin");
    }

    /* 채팅 한세트 */


    function goSearch() {
        var keyword = $("#chat-text").val();
        if (!keyword == "") {
            // =========== 파이어베이스 입력 시작
            var publicKeyIn = database.ref('/채팅/' + "퍼블릭채팅");
            publicKeyIn.push({
                keyword: keyword,
                date: localTime,
                user: userInfo.uid
            });
            // =========== 파이어베이스 입력 끝
        } else {
            alert("입력값이 없어요")
        }
    }


    var psearch = $("#p-search");
    $("input[name=p-search]").keydown(function (key) {
        if (key.keyCode == 13) { //키가 13이면 실행 (엔터는 13)
            goSearch();
            $("#chat-text").val("");
        }
    });
    psearch.click(function () {
        goSearch();
        $("#chat-text").val("");
    });


});