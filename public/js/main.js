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
            // if (!$("#chat-history").text()) {
            //
            // }
            get_text_list1();
            del_text_msg();
            get_food_list();
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
        $(".lds-heart").hide();
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
    var cartThisSpan;
    $('#j-swiper-wrapper').on('click', 'div.swiper-slide', function () {
        shopId = $(this).attr("id");
        // shopId = $(this).closest(".swiper-slide").attr("id");
        // $("#s_card_wrap").empty();
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
        cartThisSpan = cartThis.parent().parent().children(".c_order").children("span");
        pushMenu();
    });
    //AJAX사용 후 불러온 엘리먼트의 이벤트가 작동 하지 않을때

    /*푸시메뉴*/
    var dataMenu;
    var dataOrder;
    var totalPrice = 0;

    function pushMenu() {
        var dataShop = cartThis.attr("data-shop");
        dataMenu = cartThis.closest("div").attr("id");
        var dataMenuName = cartThis.attr("data-name");
        var dataPrice = cartThis.attr("data-price");
        dataOrder = parseInt(cartThis.attr("data-order"));

        var publicKeyIn = database.ref('/음식점/' + "/food/" + "/" + shopId + "/" + "/menu/" + dataMenu);
        var chatKeyIn = database.ref('/채팅/' + "퍼블릭채팅");
        publicKeyIn.update({
            order: dataOrder + 1
        });
        var keyword = "<h3 data-id='" + dataMenu + "' data-order='"+ dataOrder +"' class='" + shopId + "'>" + dataMenuName + "</h3><p>가격:<span class='mt-price'>" + dataPrice + "</span><br>상호:<span class='mt-sname'>" + sName + "</span></p>"
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

    function get_menu_list() {
        $("#s_card_wrap").empty();
        var shopGetKeyIn = firebase.database().ref('/음식점/' + "/food/");
        shopGetKeyIn.on('child_added', shop_on_child_added);
        // shopGetKeyIn.on('child_changed', shop_on_child_added);
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
            menu_GetKeyIn.on('child_changed', menu_on_child_added2);
            setRanColor();
        }
    }

    function menu_on_child_added(data) {
        var key = data.key; // 메뉴이름
        var sData = data.val();
        var mprice = sData.price;
        var menuname = sData.menuname;
        var morder = sData.order;
        var mgrade = sData.grade;

        var mhtml = "<div id='" + key + "' class=\"card\">" +
            "              <span class=\"c_img\"><span>" + sName.substr(0, 2) + "</span></span>" +
            "              <span class=\"c_name\">" + menuname + "</span>" +
            "              <span class=\"c_price\">￦" + mprice + "</span>" +
            "              <span class=\"c_order\">주문횟수 : <span>" + morder + "</span></span>" +
            "              <span class=\"c_like\">좋아요 : " + mgrade + "개</span>" +
            "              <span><button class=\"sc-add-to-cart\" data-shop='" + shopId + "' data-name='" + menuname + "' data-price='" + mprice + "' data-order='" + morder + "'>이걸로하죠</button></span>" +
            "          </div>"
        // if(morder > 0){$("#s_card_wrap").prepend(mhtml);}else{$("#s_card_wrap").append(mhtml);}
        $("#s_card_wrap").append(mhtml);
    }

    function menu_on_child_added2(data) {
        var key = data.key; // 메뉴이름
        var sData = data.val();
        var mprice = sData.price;
        var morder = sData.order;
        var mgrade = sData.grade;
        $("#" + key + " .c_order span").text(morder);
        $("#" + key + " .sc-add-to-cart").attr("data-order", morder);
        $("." + shopId).attr("data-order", morder);
        /*체인지*/
        totalMenuCalc();
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


        var dateStr = Kdate;
        var a = dateStr.split(" ");
        var d = a[0].split("-");
        var t = a[1].split(":");
        var rKdate = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);


        // var start = new Date(Kdate),
        var end = new Date(),
            diff = new Date(end - rKdate),
            days = diff / 1000 / 60 / 60 / 24;

        if (days < 1) {
            Kdate = "오늘";
        }
        var html2 =
            "<div id='" + jUser + "'><div id='" + key + "' class='timeline-item' data-price='" + mPrice + "'>" + Kword + "<span>" + Kdate + "</span>" + "<button class='samsam'>나도 같은걸로</button></div></div>";

        $("#chat-history").prepend(html2);
        $('#' + userInfo.uid).addClass("bonin");
        if (jUser == userInfo.uid) {
            $('#' + userInfo.uid).append("<button class='msgDel'>삭제</button>");
            $('#' + userInfo.uid).find(".samsam").hide();
        }
        /*애드*/
        totalMenuCalc();

    }

    /*나도 같은걸로*/
    var samThis;
    $(document).on('click', '.samsam', function () {
        samThis = $(this);
        var price = samThis.prevAll("p").children(".mt-price").text();
        var dataId = samThis.prevAll("h3").attr("data-id");
        var shopId2 = samThis.prevAll("h3").attr("class");
        var dataMeuName = samThis.prevAll("h3").text();
        var sName2 = samThis.prevAll("p").children(".mt-sname").text();
        var menuKey = samThis.prevAll("h3").attr("data-id");
        var dataOrder2 = samThis.prevAll("h3").attr("data-order");

        var publicKeyIn = database.ref('/음식점/' + "/food/" + "/" + shopId2 + "/" + "/menu/" + menuKey);
        publicKeyIn.update({
            order: dataOrder2 + 1
        });

        var chatKeyIn = database.ref('/채팅/' + "퍼블릭채팅");
        var keyword = "<h3 data-id='" + dataId + "' data-order='' class='" + shopId2 + "'>" + dataMeuName + "</h3><p>가격:<span class='mt-price'>" + price + "</span><br>상호:" + sName2 + "</p>"
        chatKeyIn.push({
            keyword: keyword,
            date: localTime,
            shopname: sName2,
            mmenu: dataMeuName,
            mprice: price,
            user: userInfo.uid
        });

    });

    /*나도 같은걸로*/

    /* 채팅 한세트 */

    /*본인 메세지 삭제*/
    var delMenu;
    var delShop;
    var delOrder;
    $(document).on('click', '.msgDel', function () {
        var delBtnThis = $(this);
        var delKey = delBtnThis.prev("div").attr("id");
        delShop = delBtnThis.prev("div").children("h3").attr("class");
        delMenu = delBtnThis.prev("div").children("h3").attr("data-id");
        // var delOrder = delBtnThis.prev("div").children("h3").attr("data-order");
        var publicGetKeyIn = firebase.database().ref('/채팅/' + "/퍼블릭채팅/" + delKey);
        publicGetKeyIn.remove();
        update_order_action();
    });

    function update_order_action() {
        var publicKeyIn = database.ref('/음식점/' + "/food/" + "/" + delShop + "/" + "menu");
        publicKeyIn.on('child_added', update_order_delete_child);
    }

    function update_order_delete_child(data) {
        var key = data.key;
        var dataTem = data.val();
        var dataOrderTem = dataTem.order;
        if (key == delMenu) {
            var publicKeyIn = database.ref('/음식점/' + "/food/" + "/" + delShop + "/" + "/menu/" + delMenu);
            publicKeyIn.update({
                order: dataOrderTem - 1
            });
        }
    }

    function del_text_msg() {
        var publicGetKeyIn = firebase.database().ref('/채팅/' + "퍼블릭채팅");
        publicGetKeyIn.on('child_removed', del_on_child_removed);
    }

    function del_on_child_removed(data) {
        var key = data.key;
        $("#" + key).parent().remove();
        /*리무브*/
        totalMenuCalc();
    }

    /*본인 메세지 삭제*/


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


    function totalMenuCalc() {
        var totalPrice = 0;
        var collection = document.getElementsByClassName('mt-price');
        if (collection.length < 1) {
            totalPrice = 0;
            $("#total-menu-price span").text(totalPrice);
        }
        for (var i = 0; i < collection.length; ++i) {
            totalPrice += parseInt(collection[i].innerHTML);
            $("#total-menu-price span").text(comma(totalPrice));
        }
    }

    function comma(str) {
        str = String(str);
        return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    }

    $(document).on('click', '#menu_line_add', function () {
        input_menu_added();

    });
    $(document).on('click', '#submit', function () {
        if ($(".form-input input").val() == "") {
            alert("빈곳이 있어요");
        } else {
            menu_input_list();
        }
    });

    $("#menu_line_add").keydown(function (key) {
        if (key.keyCode == 13 || key.keyCode == 32) { //키가 13이면 실행 (엔터는 13)
            input_menu_added();
        }
    });

    function input_menu_added() {
        var html = "<label class=\"form-input\">" +
            "                            <input type=\"text\" name=\"input-menu\" required/>" +
            "                            <span class=\"label\">메뉴명</span>" +
            "                            <div class=\"underline\"></div>" +
            "                        </label>" +
            "                        <label class=\"form-input\">" +
            "                            <input type=\"text\" name=\"input-price\" required/>" +
            "                            <span class=\"label\">가격</span>" +
            "                            <div class=\"underline\"></div>" +
            "                        </label>"
        $("#input-menu-in").append(html);

    }

});