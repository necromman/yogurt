function menu_input_list() {
    var name = $("#form .s-name").val();
    var number = $("#form .phone-number").val();
    var closed = $("#form .closed").val();
    var cat = $("#form .cat").val();
    var delivery = $("#form .delivery").val();
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

    console.log(aJsonArray);


    var publicGetKeyIn = firebase.database().ref('/음식점/' + "food");
    publicGetKeyIn.push({
        name: name,
        number: number,
        closed: closed,
        cat: cat,
        delivery: delivery,
        menu: aJsonArray
    });
    $("#form input").val("");
    alert("♥ 추가되었어요.");
}