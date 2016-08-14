add_image("image/default_background.png");
add_image("image/default_button.png");
add_image("image/default_window.png");
var op_background = SuuActor.op(0, 0, webgl_width, webgl_height, 1, 1, "image/default_background.png");
var op_button = SuuActor.op(webgl_width / 2 - 100, 100, 200, 40, 1, 2, "image/default_button.png");
var op_button_text = SuuActor.text_op(webgl_width / 2 - 45, 110, 100, 40, 18, "#FFFFFF", "测 试 按 钮", "op_button_text");
var op_window = SuuActor.op(webgl_width, 100, 750, 520, 1, 1, "image/default_window.png");
var op_window_text = SuuActor.text_op(webgl_width+25 , 100, 700, 520, 25, "#000000",
    "                                            测 试 按 钮                                            " +
    "dasfsdfsdafsdaf", "op_window_text");
op_button.down = function (x, y) {
    op_button.chooseY = 2;
    op_button.texcoord_update();
}
op_button.move = function (x, y) {
    if (!op_button.inactor(x, y)) {
        op_button.chooseY = 1;
        op_button.texcoord_update();
        event_actor = null;
    }
}
op_button.up = function (x, y) {
    op_button.chooseY = 1;
    op_button.texcoord_update();
    s_animation.put("op_window", SuuAnimation.op("op_window", 100, 90, 750, 520, 0, 1, 5));
    s_animation.put("op_window_text", SuuAnimation.op("op_window_text", 290, 100, 700, 520, 0, 1, 5));
}
op_window.up  = function (x, y) {
    s_animation.put("op_window", SuuAnimation.op("op_window", webgl_width, 100, 750, 520, 0, 1, 5));
    s_animation.put("op_window_text", SuuAnimation.op("op_window_text", webgl_width+25, 100, 700, 520, 0, 1, 5));
}

add_actor("op_background", op_background);
add_event_actor("op_button", op_button);
add_actor("op_button_text", op_button_text);
add_event_actor("op_window", op_window);
add_actor("op_window_text", op_window_text);

var ii = 8;
var jj = 5;
for (var i = 0; i < ii; i ++) {
    for (var j = jj - 1; j >= 0; j --) {
        add_actor(i+""+j, SuuActor.op(webgl_width / ii * i + 1, webgl_height / jj * j + 1, webgl_width / ii - 2, webgl_height / jj - 2, 1, 2, "image/default_button.png"));
           }
}
for (var i = 0; i < ii; i ++) {
    for (var j = jj - 2; j > 0; j --) {
        add_actor(i+""+j+"x", SuuActor.op(webgl_width / ii * i + 1, webgl_height / jj * j + 1, webgl_width / ii - 2, webgl_height / jj * 1.5, 8, 4, "image/xxyd.png"));
        if (i < ii / 2) {
            s_screen.get(i+""+j+"x").opposite();
        }
    }
}