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
    s_animation.put("op_window", SuuAnimation.op("op_window", 265, 100, 750, 520, 0, 1, 5));
    s_animation.put("op_window_text", SuuAnimation.op("op_window_text", 290, 100, 700, 520, 0, 1, 5));
}
op_window.up  = function (x, y) {
    s_animation.put("op_window", SuuAnimation.op("op_window", webgl_width, 100, 750, 520, 0, 1, 5));
    s_animation.put("op_window_text", SuuAnimation.op("op_window_text", webgl_width+25, 100, 700, 520, 0, 1, 5));
}

s_screen.put("op_background", op_background);
addeventactor("op_button", op_button);
s_screen.put("op_button_text", op_button_text);
addeventactor("op_window", op_window);
s_screen.put("op_window_text", op_window_text);