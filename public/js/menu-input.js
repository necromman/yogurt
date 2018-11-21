function menu_input_list() {
    let name = $("#form .s-name").val();
    let number = $("#form .phone-number").val();
    let closed = $("#form .closed").val();
    let cat = $("#form .cat").val();
    let delivery = $("#form .delivery").val();
    let menunameL = $("#input-menu-in").find("input[name='input-menu']").length;
    let menuname = $("#input-menu-in").find("input[name='input-menu']");
    let menuPrice = $("#input-menu-in").find("input[name='input-price']");
    let aJsonArray = new Array();

    for (let i = 0; i < menunameL; i++) {
        let aJson = new Object();
        aJson.menuname = replaceFunc(menuname[i].value);
        aJson.price = replaceFunc(menuPrice[i].value);
        aJson.order = 0;
        aJson.grade = 0;
        aJsonArray.push(aJson);
    }

    console.log(aJsonArray);

    let publicGetKeyIn = firebase.database().ref('/음식점/' + "food");
    publicGetKeyIn.push({
        name: replaceFunc(name),
        number: replaceFunc(number),
        closed: replaceFunc(closed),
        cat: replaceFunc(cat),
        delivery: replaceFunc(delivery),
        menu: aJsonArray
    });
    $("#form input").val("");
    alert("♥ 추가되었어요.");
}
