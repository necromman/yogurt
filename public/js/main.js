$(function () {
    const auth = firebase.auth();
    const database = firebase.database();
    let userInfo;
    auth.onAuthStateChanged(function (user) {
        if (user) {
            userInfo = user;
            random_food_list();
            get_text_list1();
            del_text_msg();
            get_food_list();
            swiper_func();
        } else {
            firebase.auth().signInAnonymously();
        }
    });

    /*
    *==================================================================
    * const collection
    *==================================================================
    */
    const divUtc = $('#divUTC');
    const divLocal = $('#divLocal');
    const ranFoodName = [];
    const $recommen = $('#recommen');
    const $recommenText = $("#recommen-text");
    const $ldsHeart = $(".lds-heart");
    const $jSwiperWrapper = $("#j-swiper-wrapper");
    const $sMenuList = $("#s_menu_list");
    const $closeList = $('.close_list');
    const $sCardWrap = $("#s_card_wrap");
    const $sCardWrap2 = $("#s_card_wrap2");
    const $chatHistory = $("#chat-history");
    const $chatText = $("#chat-text");
    const $psearch = $("#p-search");
    const $totalMenuPrice = $("#total-menu-price");
    const $totalTestPrice = $("#total-test-price");
    const $inputMenuIn = $("#input-menu-in");
    const $from = $("#form");
    const $menuLineAdd = $("#menu_line_add");
    const $sSearch = $("#s-search");
    const $sdPopup = $("#sd-popup");
    const $sSearchC = $("#s-search-c");
    const $sudong = $("#sudong");


    // =========== moment.js 스크립트 시작
    let localTime;
    setInterval(function () {
        divUtc.text(moment.utc().add(9, 'hours').format('YYYY-MM-DD HH:mm:ss'));
        localTime = moment().format('YYYY-MM-DD HH:mm:ss');
        divLocal.text(localTime);
    }, 1000);


    let ranFoodNameC = 0;
    $recommen.click(function () {
        let count = ranFoodName.length;
        let ranJ = Math.floor(Math.random() * (count));
        $recommenText.empty();
        $recommenText.append("오늘은 " + ranFoodName[ranJ] + " 어떠세요?");
        ranFoodNameC = 0;
    });

    function random_food_list() {
        const publicGetKeyIn = firebase.database().ref('/음식점/' + "food");
        publicGetKeyIn.on('child_added', random_food_on_child_added);
    }

    function random_food_on_child_added(data) {
        const sData = data.val();
        ranFoodName[ranFoodNameC] = sData.name;
        ranFoodNameC++;
    }


    function get_food_list() {
        const publicGetKeyIn = firebase.database().ref('/음식점/' + "food");
        publicGetKeyIn.on('child_added', food_on_child_added);
        publicGetKeyIn.on('child_changed', food_on_child_changed);
        $ldsHeart.hide();
    }

    let totalOder = 0;

    function food_on_child_changed(data) {
        const key = data.key;
        const publicGetKeyIn = firebase.database().ref('/음식점/' + "/food/" + "/" + key + "/" + "menu");
        publicGetKeyIn.on('child_added', function (data) {
            const sData = data.val();
            totalOder += sData.order;
            $("#" + key).find(".totalOder").text(totalOder);
        });
        totalOder = 0;
    }

    function food_on_child_added(data) {
        let key = data.key;
        let sData = data.val();
        let fname = sData.name;
        let fclosed = sData.closed;
        let fnumber = sData.number;
        let fdelivery = sData.delivery;
        let imgSrc = sData.imgsrc;
        let publicGetKeyIn = firebase.database().ref('/음식점/' + "/food/" + "/" + key + "/" + "menu");
        publicGetKeyIn.on('child_added', function (data) {
            const sData = data.val();
            totalOder += sData.order
        });

        /*범위지정 랜덤*/
        let ranJ = Math.floor((Math.random() * 3) + 1);
        let ranBack;
        switch (ranJ) {
            case 1 :
                ranBack = "/img/01.jpg";
                break;
            case 2 :
                ranBack = "/img/02.jpg";
                break;
            case 3 :
                ranBack = "/img/03.jpg";
                break;
        }

        let fhtml;
        if (!imgSrc) {
            fhtml = "<div id='" + key + "' class=\"swiper-slide\">" +
                "              <div class=\"owl-item\">" +
                "                  <div class=\"round-element\" style='background-image: url(" + ranBack + ")'>" +
                "                      <div class=\"above-overlay\">" +
                "                          <h2>" + fname + "<span class='totalOwrap'>주문:<span class='totalOder'>" + totalOder + "</span></span></h2>" +
                "                          <p>휴무일 : " + fclosed + "</p>" +
                "                          <p>배달여부 : " + fdelivery + "</p>" +
                "                          <p><a href='tel:" + fnumber + "'>" + fnumber + "</a></p>" +
                "                      </div>" +
                "                      <div class=\"overlay-gradient-large\"></div>" +
                "                  </div>" +
                "              </div>" +
                "          </div>";
        } else {
            fhtml = "<div id='" + key + "' class=\"swiper-slide\">" +
                "              <div class=\"owl-item\">" +
                "                  <div class=\"round-element\" style='background-image: url(" + ranBack + ")'>" +
                "                      <div class=\"above-overlay\">" +
                "                          <h2>" + fname + "<span class='totalOwrap'>주문:<span class='totalOder'>" + totalOder + "</span></span></h2>" +
                "                          <p>휴무일 : " + fclosed + "</p>" +
                "                          <p>배달여부 : " + fdelivery + "</p>" +
                "                          <p><a href='" + imgSrc + "' alt='그림메뉴보기' target='_blank'> 메뉴판 보기 </a></p>" +
                "                          <p><a href='tel:" + fnumber + "'>" + fnumber + "</a></p>" +
                "                      </div>" +
                "                      <div class=\"overlay-gradient-large\"></div>" +
                "                  </div>" +
                "              </div>" +
                "          </div>";
        }
        $jSwiperWrapper.prepend(fhtml);
        totalOder = 0;
    }

    /* 음식점 목록  한세트 */


    /* 메뉴 목록 한세트 */
    let shopId;
    let cartThis;
    let cartThisSpan;
    $jSwiperWrapper.on('click', 'div.swiper-slide:not(a)', function () {
        shopId = $(this).attr("id");
        // shopId = $(this).closest(".swiper-slide").attr("id");
        // $("#s_card_wrap").empty();
        get_menu_list();
        $("body").css("overflow", "hidden");
        $sMenuList.css({
            'left': '0%'
        });
        $closeList.css("display", "block");
        $closeList.on('click', function () {
            $(this).css("display", "none");
            $("body").css("overflow", "");
            $sMenuList.css({
                'left': '-100%'
            });
        });
    });

    $(document).on('click', '.sc-add-to-cart', function () {
        cartThis = $(this);
        cartThisSpan = cartThis.parent().parent().children(".c_order").children("span");
        pushMenu();
    });

    /*푸시메뉴*/
    function pushMenu() {
        let dataMenu = cartThis.closest("div").attr("id");
        let dataMenuName = cartThis.attr("data-name");
        let dataPrice = cartThis.attr("data-price");
        let dataOrder = parseInt(cartThis.attr("data-order"));
        let publicKeyIn = database.ref('/음식점/' + "/food/" + "/" + shopId + "/" + "/menu/" + dataMenu);
        let chatKeyIn = database.ref('/채팅/' + "퍼블릭채팅");
        publicKeyIn.update({
            order: dataOrder + 1
        });
        let keyword = "<h3 data-id='" + dataMenu + "' data-order='" + dataOrder + "' class='" + shopId + "'>" + dataMenuName + "</h3><p>가격:<span class='mt-price'>" + dataPrice + "</span>원<br>상호:<span class='mt-sname'>" + sName + "</span></p>";
        chatKeyIn.push({
            keyword: keyword,
            date: localTime,
            shopname: sName,
            mmenu: dataMenu,
            mprice: dataPrice,
            user: userInfo.uid
        });
    }

    /*푸시메뉴*/

    function get_menu_list() {
        $sCardWrap2.empty();
        $sCardWrap.empty();
        const shopGetKeyIn = firebase.database().ref('/음식점/' + "/food/");
        shopGetKeyIn.on('child_added', shop_on_child_added);
    }


    let sName;
    let menu_GetKeyIn;

    function shop_on_child_added(data) {
        let key = data.key; // 메뉴이름
        let sData = data.val();
        if (key == shopId) {
            sName = sData.name;
            menu_GetKeyIn = firebase.database().ref('/음식점/' + "/food/" + "/" + shopId + "/" + "menu").orderByChild('order');
            //menu_GetKeyIn = firebase.database().ref('/음식점/' + "/food/" + "/" + shopId + "/" + "menu");
            let addHtml = "<div id='"+shopId+"' class=\"card\">" +
                "                        <input type=\"text\" name=\"input-menu\" placeholder=\"메뉴\" required/>" +
                "                        <input type=\"text\" name=\"input-price\" placeholder=\"가격\" required/>" +
                "                   <button class='jump-btn menu-add'>메뉴추가</button> </div>";
            $sCardWrap2.append(addHtml);

            menu_GetKeyIn.on('child_added', menu_on_child_added);
            menu_GetKeyIn.on('child_changed', menu_on_child_added2);
            setRanColor();
        }
    }

    //메뉴추가
    $(document).on('click', '.menu-add', function () {
        var $this = $(this);

        let $shop = $this.closest("div");
        let $shop_id = $this.closest("div").attr("id");
        let menu_name = $shop.find('input[name=input-menu]').val();
        let menu_price = $shop.find('input[name=input-price]').val();
        if(menu_name && menu_price){
        let publicKeyIn = database.ref('/음식점/' + "/food/" + "/" + $shop_id + "/" + "/menu/");
        publicKeyIn.push({
            grade: 0,
            menuname: menu_name,
            order: 0,
            price: menu_price
        });
            alert(menu_name + "가 추가 됐어요.");
        }else{
            alert("입력값이 없어요");
        }
    });

    function menu_on_child_added(data) {
        let key = data.key; // 메뉴이름
        let sData = data.val();
        let mprice = sData.price;
        let menuname = sData.menuname;
        let morder = sData.order;

        let mhtml = "<div id='" + key + "' class=\"card\">" +
            "              <span><button class=\"sc-remove-menu jump-btn\" data-shop='" + shopId + "' data-name='" + menuname + "' data-price='" + mprice + "' data-order='" + morder + "'>삭제</button></span>" +
            "              <span class=\"c_img\"><span>" + sName.substr(0, 2) + "</span></span>" +
            "              <span class=\"c_name\">" + menuname + "</span>" +
            "              <span class=\"c_price\">" + comma(mprice) + "원</span>" +
            "              <span class=\"c_order\">주문횟수 : <span>" + morder + "</span></span>" +
            "              <span><button class=\"sc-add-to-cart jump-btn\" data-shop='" + shopId + "' data-name='" + menuname + "' data-price='" + mprice + "' data-order='" + morder + "'>이걸로하죠</button></span>" +
            "          </div>";
        if (morder > 0) {
            $sCardWrap.prepend(mhtml);
        } else {
            $sCardWrap.append(mhtml);
        }
    }

    function menu_on_child_added2(data) {
        let key = data.key;
        let sData = data.val();
        let morder = sData.order;
        $("#" + key + " .c_order span").text(morder);
        $("#" + key + " .sc-add-to-cart").attr("data-order", morder);
        $("." + shopId).attr("data-order", morder);
        /*체인지*/
        totalMenuCalc();
    }

    /* 메뉴 목록  한세트 */

    /*더보기*/

    $(document).on('click', '#more-btn', function () {
        $chatHistory.empty();
        get_text_list_more();

    });
    let moreCount = 20;

    function get_text_list_more() {
        let publicGetKeyIn = firebase.database().ref('/채팅/' + "퍼블릭채팅").limitToLast(moreCount);
        publicGetKeyIn.on('child_added', public_on_child_added);
        $chatHistory.append("<button id=\"more-btn\">더보기</button>");
        moreCount += 20;
    }

    /* 채팅 한세트 */
    function get_text_list1() {
        const publicGetKeyIn = firebase.database().ref('/채팅/' + "퍼블릭채팅");
        publicGetKeyIn.on('child_added', public_on_child_added);
    }

    let jUser;

    function public_on_child_added(data) {
        let key = data.key;
        let sData = data.val();
        let Kword = sData.keyword;
        let Kdate = sData.date;
        jUser = sData.user;
        let mPrice = sData.mprice;
        let sdPrice = sData.sdprice;

        let dateStr = Kdate;
        let a;
        a = dateStr.split(" ");
        let d = a[0].split("-");
        let t = a[1].split(":");
        let rKdate = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
        let end = new Date(),
            diff = new Date(end - rKdate),
            days = diff / 1000 / 60 / 60 / 24;

        if (days < 0.5) {
            Kdate = "오늘";
            if (mPrice > 0) {
                totalPrice += parseInt(mPrice);
            }
        }

        let html2 =
            "<div id='" + jUser + "' class='timeline-item-wrap " + key + "'><div id='" + key + "' class='timeline-item' data-price='" + mPrice + "'>" + Kword + "<span>" + Kdate + "</span>" + "</div></div>";

        $chatHistory.prepend(html2);
        $('#' + userInfo.uid).addClass("bonin");
        if (mPrice > 0) {
            $("#" + key).append("<button class='samsam jump-btn'>같은걸로</button>");
        }
        if (jUser == userInfo.uid) {
            if (days < 0.5) {
                $('#' + userInfo.uid).append("<button class='msgDel jump-btn'>삭제</button>");
                $('#' + userInfo.uid).find(".samsam").hide();
            }
        }
        if (days > 0.5) {
            $("#chat-history > div").css("backgroundColor", "#7d7d7d");
        }

        /*애드*/
        if (sdPrice > 0) {
            totalPrice += parseInt(sdPrice);
            $totalMenuPrice.text(comma(totalPrice));
            $totalTestPrice.text(comma(32000 - totalPrice));
        }
        totalMenuCalc();

    }

    /*나도 같은걸로*/
    let samThis;
    $(document).on('click', '.samsam', function () {
        samThis = $(this);
        let price = samThis.prevAll("p").children(".mt-price").text();
        let dataId = samThis.prevAll("h3").attr("data-id");
        let shopId2 = samThis.prevAll("h3").attr("class");
        let dataMeuName = samThis.prevAll("h3").text();
        let sName2 = samThis.prevAll("p").children(".mt-sname").text();
        let dataOrder2 = 0;

        let getDataSameOrder = database.ref('/음식점/' + "/food/" + "/" + shopId2 + "/" + "/menu/");
        getDataSameOrder.on('child_added', getDataSameOrder_c);

        function getDataSameOrder_c(data) {
            let key = data.key;
            let Sdata = data.val();

            if (key == dataId) {
                dataOrder2 = Sdata.order;
            }
        }

        if (dataOrder2) {
            var publicKeyIn = database.ref('/음식점/' + "/food/" + "/" + shopId2 + "/" + "/menu/" + dataId);
            publicKeyIn.update({
                order: dataOrder2 + 1
            });

            var chatKeyIn = database.ref('/채팅/' + "퍼블릭채팅");
            var keyword = "<h3 data-id='" + dataId + "' data-order='" + dataOrder2 + "' class='" + shopId2 + "'>" + dataMeuName + "</h3><p>가격:<span class='mt-price'>" + price + "</span>원<br>상호:<span class='mt-sname'>" + sName2 + "</span></p>"
            chatKeyIn.push({
                keyword: keyword,
                date: localTime,
                shopname: sName2,
                mmenu: dataMeuName,
                mprice: price,
                user: userInfo.uid
            });

            if (jUser == userInfo.uid) {
                $('#' + userInfo.uid).find(".samsam").hide();
            }
        } else {
            alert("음식점이 없어요.")
        }
    });

    /*본인 메세지 삭제*/
    let delMenu;
    let delShop;
    $(document).on('click', '.msgDel', function () {
        let delBtnThis = $(this);
        let delKey = delBtnThis.prev("div").attr("id");
        delShop = delBtnThis.prev("div").children("h3").attr("class");
        delMenu = delBtnThis.prev("div").children("h3").attr("data-id");
        let publicGetKeyIn = firebase.database().ref('/채팅/' + "/퍼블릭채팅/" + delKey);
        publicGetKeyIn.remove();
        update_order_action();
    });

    $(document).on('click', '.sc-remove-menu', function () {
        if (confirm("삭제 할까요?") == true) {
            let cartThis = $(this);
            let dataMenu = cartThis.closest("div").attr("id");
            let dataShop = cartThis.attr("data-shop");
            let publicGetKeyIn = firebase.database().ref('/음식점/' + "/food/" + "/" + dataShop + "/" + "/menu/" + dataMenu);
            console.log(dataMenu);
            console.log(dataShop);
            publicGetKeyIn.remove();
            cartThis.closest("div").hide();
            alert("삭제 되었어요");
        } else {
            return;
        }
    });

    function update_order_action() {
        let publicKeyIn = database.ref('/음식점/' + "/food/" + "/" + delShop + "/" + "menu");
        publicKeyIn.on('child_added', update_order_delete_child);
    }

    function update_order_delete_child(data) {
        let key = data.key;
        let dataTem = data.val();
        let dataOrderTem = dataTem.order;
        if (key == delMenu) {
            let publicKeyIn = database.ref('/음식점/' + "/food/" + "/" + delShop + "/" + "/menu/" + delMenu);
            publicKeyIn.update({
                order: dataOrderTem - 1
            });
        }
    }

    function del_text_msg() {
        const publicGetKeyIn = firebase.database().ref('/채팅/' + "퍼블릭채팅");
        publicGetKeyIn.on('child_removed', del_on_child_removed);
    }

    function del_on_child_removed(data) {
        let key = data.key;
        let mtdelVal2 = $("#" + key).find(".mt-price").text();

        if (mtdelVal2 > 0) {
            totalPrice -= parseInt(mtdelVal2);
            $("#total-menu-price").text(comma(totalPrice));
            $("#total-test-price").text(comma(32000 - totalPrice));
        }
        $("." + key).remove();
        /*리무브*/

    }

    /*본인 메세지 삭제*/
    function sdPush() {
        let sdMenu = $("#sd-menu").val();
        let sdPrice = $("#sd-price").val();
        let html = "<h3>" + sdMenu + "</h3>" +
            "<p>가격:<span class=\"mt-price\">" + sdPrice + "</span>원</p>";
        if (!(sdMenu == "" || sdPrice == "")) {
            var publicKeyIn = database.ref('/채팅/' + "퍼블릭채팅");
            publicKeyIn.push({
                keyword: html,
                date: localTime,
                sdprice: sdPrice,
                user: userInfo.uid
            });
            $("#sd-menu").val("");
            $("#sd-price").val("");

        } else {
            alert("입력값이 없어요");
        }
    }


    function goSearch() {
        let keyword = replaceFunc($chatText.val());
        /*keyword = keyword.replace(new RegExp("(" + find.map(function (i) {
            return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
        }).join("|") + ")", "g"), function (s) {
            return replace[find.indexOf(s)]
        });*/
        if (keyword) {
            const publicKeyIn = database.ref('/채팅/' + "퍼블릭채팅");
            publicKeyIn.push({
                keyword: keyword,
                date: localTime,
                user: userInfo.uid
            });
        } else {
            alert("입력값이 없어요")
        }
    }


    $chatText.keydown(function (key) {
        if (key.keyCode == 13) { //키가 13이면 실행 (엔터는 13)
            goSearch();
            $chatText.val("");
        }
    });
    $psearch.click(function () {
        goSearch();
        $chatText.val("");
    });

    $sSearch.click(function () {
        sdPush();
        $sudong.hide()
    });

    $sdPopup.click(function () {
        $sudong.show();
    });
    $sSearchC.click(function () {
        $sudong.hide();
    });


    let totalPrice = 0;

    function totalMenuCalc() {
        $totalMenuPrice.text(comma(totalPrice));
        $totalTestPrice.text(comma(32000 - totalPrice));
    }

    function comma(str) {
        str = String(str);
        return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    }

    function uncomma(str) {
        str = String(str);
        return str.replace(/[^\d]+/g, '');
    }

    $(document).on('click', '#menu_line_add', function () {
        input_menu_added();
    });

    $(document).on('click', '#menu_line_remove', function () {
        $inputMenuIn.find(".input-tem:last-child").remove();
    });

    $(document).on('click', '#submit', function () {
        let check = 0;
        let fromInput = $("#form input");
        let fromFind = $from.find("input");

        function f() {
            for (let i = 0; fromInput.length > i; i++) {
                if (!fromFind[i].value) {
                    fromFind[i].focus();
                    check++;
                    break;
                }
            }
            if (check <= 0) {
                menu_input_list();
            } else
                alert("빈값이 있어요");
        }

        f();
    });

    $menuLineAdd.keydown(function (key) {
        if (key.keyCode == 13 || key.keyCode == 32) { //키가 13이면 실행 (엔터는 13)
            input_menu_added();
        }
    });

    function input_menu_added() {
        let html = "<div class=\"input-tem\">" +
            "            <input type=\"text\" name=\"input-menu\" placeholder=\"메뉴\" required/>" +
            "            <input type=\"text\" name=\"input-price\" placeholder=\"가격\" required/>" +
            "        </div>";
        $inputMenuIn.append(html);

    }

});

function replaceFunc(re) {
    const find = ["<", ">", "\n"];
    const replace = ["&lt;", "&gt;", "<br/>"];
    let temp = re.replace(new RegExp("(" + find.map(function (i) {
        return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
    }).join("|") + ")", "g"), function (s) {
        return replace[find.indexOf(s)]
    });
    return temp;
}
