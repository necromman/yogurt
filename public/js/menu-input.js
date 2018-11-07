function menu_input_list() {

    var name = $(".form-input .s-name").val();
    var number = $(".form-input .phone-number").val();
    var closed = $(".form-input .closed").val();
    var cat = $(".form-input .cat").val();
    var delivery = $(".form-input .delivery").val();
    var menunameL = $("#input-menu-in").find("input[name='input-menu']").length;
    var menuname = $("#input-menu-in").find("input[name='input-menu']");
    var menuPrice = $("#input-menu-in").find("input[name='input-price']");


    var aJsonArray = new Array();

    for (var i = 0; i < menunameL; i++) {
        var aJson = new Object();
        aJson.menuname = menuname[i].value;
        aJson.price = menuPrice[i].value;
        aJson.order = 0;
        aJson.grade = 0;
        aJsonArray.push(aJson);
    }

    console.log(aJsonArray)


    var publicGetKeyIn = firebase.database().ref('/음식점/' + "food");
    publicGetKeyIn.push({
        name: name,
        number: number,
        closed: closed,
        cat: cat,
        delivery: delivery,
        menu: aJsonArray
    });
}


var $btn = document.getElementById("submit");
var $form = document.getElementById("form");

function signIn() {
    if ($form.checkValidity()) {
        $btn.classList.add('pending');
        window.setTimeout(function(){ $btn.classList.add('granted'); }, 1500);
    }
}

$btn.addEventListener("click", signIn);