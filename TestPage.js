/**
 * Created by user on 16-8-8.
 */
var NewSuuAnimation = {
    op: function (actor, x, y, width, height, angle, alpha, fps) {
        var suuAnimation = SuuAnimation.op(actor, x, y, width, height, angle, alpha, fps);
        suuAnimation.ed = function () {
            animation.put(actor, NewSuuAnimation.op("" + actor, webgl_width / 2 + 100 * Math.cos((actor % 360) * Math.PI / 180),
                webgl_height / 2 + 100 * Math.sin((actor % 360) * Math.PI / 180), width*1.5, height*1.5, 0, 1, 25));
        }

        return suuAnimation;
    }
}

for (var i = 0; i < 2000; i++) {
    // screen.put("" + i,SuuActor.text_op(webgl_width / 2 + 100 * Math.cos((i % 360) * Math.PI / 180),
    //     webgl_height / 2 + 100 * Math.sin((i % 360) * Math.PI / 180), 40, 40, 20, "#0000FF", ".", "key"));
    screen.put("" + i, SuuActor.text_op(100, 100, 40, 40, 20, "#0000FF", ".", "key"));
}
for (var i = 2000; i < 5000; i++) {
    // screen.put("" + i,SuuActor.text_op(webgl_width / 2 + 100 * Math.cos((i % 360) * Math.PI / 180),
    //     webgl_height / 2 + 100 * Math.sin((i % 360) * Math.PI / 180), 40, 40, 20, "#0000FF", ".", "key"));
    screen.put("" + i, SuuActor.text_op(1000, 100, 40, 40, 20, "#0000FF", ".", "key"));
}

function down(x, y) {
}

function move(x, y) {

}

function up(x, y) {
}