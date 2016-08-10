var NewSuuAnimation = {
    op: function (actor, x, y, width, height, angle, alpha, fps) {
        var suuAnimation = SuuAnimation.op(actor, x, y, width, height, angle, alpha, fps);
        suuAnimation.ed = function () {
            s_animation.put(actor, SuuAnimation.op("" + actor, webgl_width / 2 + (100 - Math.floor(actor / 360) * 10) * Math.cos((actor % 360) * Math.PI / 180),
                webgl_height / 2 + (100 - Math.floor(actor / 360) * 10) * Math.sin((actor % 360) * Math.PI / 180), 40, 40, 0, 1, Math.floor(50 * Math.random())));
        }

        return suuAnimation;
    }
}
for (var i = 0; i < 360 * 1; i++) {
    s_screen.put("" + i,SuuActor.text_op(webgl_width / 2 + (100 - Math.floor(i / 360) * 10) * Math.cos((i % 360) * Math.PI / 180),
        webgl_height / 2 + (100 - Math.floor(i / 360) * 10) * Math.sin((i % 360) * Math.PI / 180), 40, 40, 20, "#0000FF", ".", "key"));
}

// s_screen.put("2",SuuActor.op(0, 0, 100, 100, 8, 4,"/storage/extSdCard/SuuWebAlpha/image/xxyd.png"));
function down(x, y) {
    for (var actor = 0; actor < s_screen.size; actor++) {
        s_animation.put(actor, NewSuuAnimation.op("" + actor, webgl_width / 2 + (100 - Math.floor(actor / 360) * 10) * Math.cos((actor % 360) * Math.PI / 180) + 100 * Math.random() - 50,
            webgl_height / 2 + (100 - Math.floor(actor / 360) * 10) * Math.sin((actor % 360) * Math.PI / 180) + 100 * Math.random() - 50, 40, 40, 0, 1, Math.floor(25 * Math.random())));
    }
}
function move(x, y) {
    for (var actor = 0; actor < s_screen.size; actor++) {
        if(x >= s_screen.get(actor).x - 10 && x <= s_screen.get(actor).x + s_screen.get(actor).width + 10 &&
            y >= s_screen.get(actor).y - 10 && y <= s_screen.get(actor).y + s_screen.get(actor).height + 10) {
            s_animation.put(actor, NewSuuAnimation.op("" + actor, s_screen.get(actor).x + (100 - Math.floor(actor / 360) * 10) * Math.random() - 50,
                s_screen.get(actor).y + (100 - Math.floor(actor / 360) * 10) * Math.random() - 50, 40, 40, 0, 1, Math.floor(25 * Math.random())));
        }

    }
}

function up(x, y) {

}

