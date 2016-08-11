//----------loadjs----------//
// document.write(
//     "<style type=\"text/css\">" +
//     "   * {margin:0;padding:0}" +
//     "   body,html,canvas {width:100%;height: 100%;overflow-y: hidden;}" +
//     "</style>");
document.write(
    "<style type=\"text/css\">" +
    "   * {margin:0;padding:0}" +
    "   body,html,canvas {width:100%;height: 100%;}" +
    "</style>");
//----------variable----------//
var s_screen;
var s_animation;
var s_sound;

var gl;

var image_texture;
var unused_texture;
var event_actor;
var event_actors;

var webgl_width;
var webgl_height;
var window_width;
var window_height;
var play_time;

//图像大小与位置
var translate_position;
var matrix_position;
//纹理分割与选择
var translate_texcoord;
var scale_texcoord;
//纹理贴图与颜色
var texture_object;
var texture_color;
//----------class----------//
var MinHashMap = {
    op: function () {
        var minHashMap = {};

        //MinHashMap-variable
        minHashMap.object = new Object();
        minHashMap.size = 0;

        //MinHashMap-function
        minHashMap.containskey = function (key) {
            return (key in minHashMap.object);
        }
        minHashMap.put = function (key, value) {
            if (!minHashMap.containskey(key)){
                minHashMap.size ++;
            }
            minHashMap.object[key] = value;
        }
        minHashMap.get = function (key){
            return minHashMap.object[key];
        }

        minHashMap.remove = function (key){
            if(minHashMap.containskey(key)&&(delete minHashMap.object[key])){
                minHashMap.size --;
            }
        };

        return minHashMap;
    }
}

var MinLinkedHashMap = {
    op: function () {
        //Extend MinHashMap
        var minLinkedHashMap = MinHashMap.op();

        //MinLinkedHashMap-variable
        minLinkedHashMap.op_key;
        minLinkedHashMap.ed_key;

        //MinLinkedHashMap-function
        minLinkedHashMap.put = function (key, value) {
            if (!minLinkedHashMap.containskey(key)){
                minLinkedHashMap.object[key] = {};
                if (minLinkedHashMap.size == 0) {
                    minLinkedHashMap.op_key = key;
                } else if (minLinkedHashMap.size > 0) {
                    minLinkedHashMap.object[minLinkedHashMap.ed_key].next = key;
                    minLinkedHashMap.object[key].last = minLinkedHashMap.ed_key;
                }
                minLinkedHashMap.ed_key = key;
                minLinkedHashMap.size ++;
            }
            minLinkedHashMap.object[key].value = value;
        }
        minLinkedHashMap.get = function (key){
            return minLinkedHashMap.object[key].value;
        }
        minLinkedHashMap.getlast = function (key){
            minLinkedHashMap.op_key = minLinkedHashMap.object[key].last;
            return minLinkedHashMap.object[key].value;
        }
        minLinkedHashMap.getnext = function (key){
            minLinkedHashMap.ed_key = minLinkedHashMap.object[key].next;
            return minLinkedHashMap.object[key].value;
        }
        minLinkedHashMap.remove = function (key) {
            if (minLinkedHashMap.containskey(key)) {
                if (minLinkedHashMap.containskey(minLinkedHashMap.object[key].last)) {
                    minLinkedHashMap.object[minLinkedHashMap.object[key].last].next = minLinkedHashMap.object[key].next;
                }
                if (minLinkedHashMap.containskey(minLinkedHashMap.object[key].next)) {
                    minLinkedHashMap.object[minLinkedHashMap.object[key].next].last = minLinkedHashMap.object[key].last;
                }
                delete minLinkedHashMap.object[key];
                minLinkedHashMap.size --;
            }
        }

        return minLinkedHashMap;
    }
}

var SuuImage = {
    op: function (texture_op, image_path) {

        var image_op = new Image();

        image_op.onload = function () {
            var suuImage = {};
            suuImage.texture = texture_op;
            suuImage.count = 1;

            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, suuImage.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_op);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.uniform1i(texture_object, 0);
            image_op = null;

            image_texture.put(image_path, suuImage);
        }
        image_op.src = image_path;
    },
    text_op: function (texture_op, key, text, width, height, font_size, font_color) {
        var image_op = document.createElement("canvas");

        var lines = new Array();
        var line = "";
        var ctx = image_op.getContext("2d");
        image_op.width = width;
        image_op.height = height;
        ctx.font = font_size + "px 宋体";
        ctx.fillStyle = font_color;


        for (var i = 0; i < text.length; i++){
            if (ctx.measureText(line + text.substring(i, i+1)).width > width) {
                lines.push(line);
                line = "";
            }
            line += text.substring(i, i+1);
        }
        if (line != ""){
            lines.push(line);
        }
        line = null;

        for (var i = lines.length; i > 0; i--) {
            ctx.fillText(lines.pop(), 0, font_size * (i + 1));
        }
        var suuImage = {};
        suuImage.texture = texture_op;
        suuImage.count = 1;

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, suuImage.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_op);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(texture_object, 0);
        image_op = null;
        image_texture.put(key, suuImage);
    }
}

var SuuActor = {
    new: function (x, y, width, height) {
        var suuActor = {};

        //SuuActor-variable
        suuActor.x = x;
        suuActor.y = y;
        suuActor.width = width;
        suuActor.height = height;
        suuActor.angle = 0;
        suuActor.alpha = 1;
        suuActor.matrix;

        //SuuActor-function
        suuActor.play = function(){
            if (suuActor.x < webgl_width && suuActor.y < webgl_height &&
                -suuActor.x < suuActor.width && -suuActor.y < suuActor.height ) {
                gl.uniformMatrix4fv(matrix_position, false, suuActor.matrix);
                gl.uniform4f(translate_position, suuActor.x * 2 / webgl_width - 1, suuActor.y * 2 / webgl_height - 1, 0, 0);
                suuActor.texcoord_update();
                suuActor.color_update();
                gl.bindTexture(gl.TEXTURE_2D, image_texture.get(suuActor.key).texture);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
        }

        suuActor.position_update = function () {
            suuActor.matrix = new Float32Array([
                suuActor.width * 2 / webgl_width * Math.cos((suuActor.angle % 360) * Math.PI / 180),
                suuActor.height * 2 / webgl_height * Math.sin((suuActor.angle % 360) * Math.PI / 180), 0, 0,
                -suuActor.width * 2 / webgl_width * Math.sin((suuActor.angle % 360) * Math.PI / 180),
                suuActor.height * 2 / webgl_height * Math.cos((suuActor.angle % 360) * Math.PI / 180), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }


        suuActor.color_update = function () {
            gl.uniform4f(texture_color, 1, 1, 1, suuActor.alpha);
        }
        suuActor.setxy = function (x, y) {
            suuActor.x = x;
            suuActor.y = y;
        }
        suuActor.inactor = function (x, y) {
            if(x >= suuActor.x && x <= suuActor.x + suuActor.width &&
                y >= suuActor.y && y <= suuActor.y + suuActor.height) {
                return true;
            }
            return false;
        }
        suuActor.update = function () {
        }

        suuActor.down = function (x, y) {

        }

        suuActor.move = function (x, y) {

        }

        suuActor.up = function (x, y) {

        }

        suuActor.position_update();

        return suuActor;
    },
    op: function (x, y, width, height, divideX, divideY, image_path){
        var suuActor = SuuActor.new(x, y, width, height);

        //SuuActor-variable
        suuActor.divideX = divideX;
        suuActor.divideY = divideY;
        suuActor.key = image_path;
        suuActor.chooseX = 1;
        suuActor.chooseY = 1;

        if(!image_texture.containskey(suuActor.key)) {
            if (unused_texture.length > 0) {
                SuuImage.unused_op(unused_texture.pop(), suuActor.key);
            } else {
                SuuImage.op(gl.createTexture(), suuActor.key);
            }
        } else {
            image_texture.get(suuActor.key).count ++;
        }

        //SuuActor-function
        suuActor.texcoord_update = function () {
            gl.uniform2f(scale_texcoord, 1 / suuActor.divideX, 1 / suuActor.divideY);
            gl.uniform2f(translate_texcoord, (Math.ceil(suuActor.chooseX) - 1) / suuActor.divideX, (suuActor.chooseY - 1) / suuActor.divideY);
        }
        suuActor.update = function () {
            suuActor.chooseX ++;
            if (Math.ceil(suuActor.chooseX) > suuActor.divideX){
                suuActor.chooseX = 1;
            }
            suuActor.texcoord_update();
        }

        return suuActor;
    },
    text_op: function (x, y, width, height, font_size, font_color, text, key){
        var suuActor = SuuActor.new(x, y, width, height);

        //SuuActor-variable
        suuActor.key = key;

        if (unused_texture.length > 0){
            SuuImage.text_op(unused_texture.pop(), suuActor.key, text, width, height, font_size, font_color);
        } else {
            if (image_texture.containskey(key)) {
                SuuImage.text_op(image_texture.get(suuActor.key).texture, suuActor.key, text, width, height, font_size, font_color);
            } else {
                SuuImage.text_op(gl.createTexture(), suuActor.key, text, width, height, font_size, font_color);
            }
        }

        // gl.deleteTexture(image_texture.get(suuActor.key).texture_object);

        //SuuActor-function
        suuActor.texcoord_update = function () {
            gl.uniform2f(scale_texcoord, 1, 1);
            gl.uniform2f(translate_texcoord, 0, 0);
        }
        suuActor.settext = function (text) {
            suuActor.text = text;
            SuuImage.text_op(image_texture.get(suuActor.key).texture, suuActor.key, text, width, height, font_size, font_color);
        }

        return suuActor;
    }
};
var SuuAnimation = {
    op: function (actor, x, y, width, height, angle, alpha, fps) {
        var suuAnimation = {};

        //SuuActor-variable
        suuAnimation.actor = actor;
        suuAnimation.x = x;
        suuAnimation.y = y;
        suuAnimation.width = width;
        suuAnimation.height = height;
        suuAnimation.angle = angle;
        suuAnimation.alpha = alpha;
        suuAnimation.fps = fps;

        //SuuActor-function
        suuAnimation.play = function () {
            if (suuAnimation.fps == 0) {
                s_screen.get(suuAnimation.actor).x = suuAnimation.x;
                s_screen.get(suuAnimation.actor).y = suuAnimation.y;
                s_screen.get(suuAnimation.actor).width = suuAnimation.width;
                s_screen.get(suuAnimation.actor).height = suuAnimation.height;
                s_screen.get(suuAnimation.actor).angle = suuAnimation.angle;
                s_screen.get(suuAnimation.actor).alpha = suuAnimation.alpha;
                suuAnimation.ed();
            } else {
                s_screen.get(suuAnimation.actor).x += (suuAnimation.x - s_screen.get(suuAnimation.actor).x) / suuAnimation.fps;
                s_screen.get(suuAnimation.actor).y += (suuAnimation.y - s_screen.get(suuAnimation.actor).y) / suuAnimation.fps;
                s_screen.get(suuAnimation.actor).width += (suuAnimation.width - s_screen.get(suuAnimation.actor).width) / suuAnimation.fps;
                s_screen.get(suuAnimation.actor).height += (suuAnimation.height - s_screen.get(suuAnimation.actor).height) / suuAnimation.fps;
                s_screen.get(suuAnimation.actor).angle += (suuAnimation.angle - s_screen.get(suuAnimation.actor).angle) / suuAnimation.fps;
                s_screen.get(suuAnimation.actor).alpha += (suuAnimation.alpha - s_screen.get(suuAnimation.actor).alpha) / suuAnimation.fps;
                suuAnimation.fps --;
            }
            s_screen.get(suuAnimation.actor).position_update();
        }

        suuAnimation.ed = function () {
            s_animation.remove(suuAnimation.actor);
        }

        return suuAnimation;
    }
}
//----------webgl----------//
function webgl_op(){
    gl.viewport(0, 0, webgl_width, webgl_height);

    //加载着色器
    var VERTEX_SHADER_SOURCE =
        "attribute vec4 aposition;\n" +
        "attribute vec2 atexcoord;\n" +
        "varying vec2 texcoord;\n" +
        "uniform mat4 matrix_position;\n" +
        "uniform vec2 scale_texcoord;\n" +
        "uniform vec4 translate_position;\n" +
        "uniform vec2 translate_texcoord;\n" +
        "void main() {\n" +
        "	texcoord = atexcoord * scale_texcoord + translate_texcoord;\n"+
        "	gl_Position = aposition * matrix_position + translate_position;\n" +
        "}\n";
    var FRAGMENT_SHADER_SOURCE =
        "#ifdef GL_ES\n" +
        "	precision mediump float;\n" +
        "#endif\n" +
        "varying vec2 texcoord;\n" +
        "uniform sampler2D texture_object;\n" +
        "uniform vec4 texture_color;\n" +
        "void main() {\n" +
        "   vec3 v = texture2D(texture_object, texcoord).rgb;"+
        "	gl_FragColor = texture2D(texture_object, texcoord) * texture_color;\n" +
        "}\n";

    var vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertex_shader, VERTEX_SHADER_SOURCE);
    gl.shaderSource(fragment_shader, FRAGMENT_SHADER_SOURCE);
    gl.compileShader(vertex_shader);
    gl.compileShader(fragment_shader);
    var program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    gl.useProgram(program);

    var position = gl.getAttribLocation(program, "aposition");
    gl.enableVertexAttribArray(position);
    var position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 1, 0, 1,
        0, 0, 0, 1,
        1, 1, 0, 1,
        1, 0, 0, 1,
    ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(position, 4, gl.FLOAT, false, 0, 0);

    var texcoord = gl.getAttribLocation(program, "atexcoord");
    gl.enableVertexAttribArray(texcoord);
    var texcoord_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoord_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0,
        0, 1,
        1, 0,
        1, 1
    ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(texcoord, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //图形缩放
    matrix_position = gl.getUniformLocation(program, "matrix_position");;
    //图形移动
    translate_position = gl.getUniformLocation(program, "translate_position");;
    //纹理裁剪
    scale_texcoord = gl.getUniformLocation(program, "scale_texcoord");;
    //纹理选择
    translate_texcoord = gl.getUniformLocation(program, "translate_texcoord");;
    texture_object = gl.getUniformLocation(program, "texture_object");
    texture_color = gl.getUniformLocation(program, "texture_color");

    //透明png
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
}

function webgl_play(){
    for (var key in s_animation.object) {
        s_animation.get(key).play();
    }

    s_screen.ed_key = s_screen.op_key;
    for (var i = 0; i < s_screen.size; i++) {
        s_screen.getnext(s_screen.ed_key).update();
    }

    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    s_screen.ed_key = s_screen.op_key;
    for (var i = 0; i < s_screen.size; i++) {
        s_screen.getnext(s_screen.ed_key).play();
    }

    fps ++;
    date = new Date();
    if (date.getSeconds() == 0 && second == 59){
        second = date.getSeconds();
        document.getElementById("fpsMsg").innerHTML = "fps:" + fps;
        fps = 0;
    } else if (date.getSeconds() - second >= 1){
        second = date.getSeconds();
        document.getElementById("fpsMsg").innerHTML = "fps:" + fps;
        fps = 0;
    }
}

//----------function----------//
var date;
var second = 0;
var fps = 0;
//开始调用执行
function op(canvas, width, height, fps){
    var canvas = document.getElementById(canvas);
    addevent(canvas);
    canvas.width = width;
    canvas.height = height;
    webgl_width = width;
    webgl_height = height;
    window_width = window.innerWidth;
    window_height = window.innerHeight;
    window.addEventListener("resize", function () {
        window_width = window.innerWidth;
        window_height = window.innerHeight;
    }, false);

    event_actor = null;
    s_screen = MinLinkedHashMap.op();
    image_texture = MinHashMap.op();
    s_animation = MinHashMap.op();
    s_sound = MinLinkedHashMap.op();
    unused_texture = new Array();
    event_actors = new Array();

    play_time = 1000 / fps;
    gl = canvas.getContext("webgl");
    webgl_op();
    setInterval("webgl_play();", play_time);
}

//s_screen
function addeventactor(actorname, actor) {
    s_screen.put(actorname, actor);
    event_actors.push(actorname);
}
function deleteactor(actorname) {
    if (image_texture.get(s_screen.get(actorname).key).count -- == 0) {
        unused_texture.push(image_texture.get(s_screen.get(actorname).key).texture);
        image_texture.remove(s_screen.get(actorname).key);
        event_actors.remove(actorname);
    }
    s_screen.remove(actorname);
}

//加载点击和触摸事件
function addevent(canvas){
    var x,y;
    canvas.addEventListener("mousedown",function (e) {
        x = Math.round(e.clientX / window_width * webgl_width);
        y = Math.round((1 - e.clientY / window_height) * webgl_height);
        document.getElementById("operationMsg").innerHTML ="mousedown:" + x + "," + y;
        down(x, y);
    },false);
    canvas.addEventListener("mousemove",function (e) {
        x = Math.round(e.clientX / window_width * webgl_width);
        y = Math.round((1 - e.clientY / window_height) * webgl_height);
        document.getElementById("operationMsg").innerHTML ="mousemove:" + x + "," + y;
        move(x, y);
    },false);
    canvas.addEventListener("mouseup",function (e) {
        x = Math.round(e.clientX / window_width * webgl_width);
        y = Math.round((1 - e.clientY / window_height) * webgl_height);
        document.getElementById("operationMsg").innerHTML ="mouseup:" + x + "," + y;
        up(x, y);
    },false);

    canvas.addEventListener("touchstart",function (e) {
        x = Math.round(e.touches[0].clientX / window_width * webgl_width);
        y = Math.round((1 - Math.floor(e.touches[0].clientY) / window_height) * webgl_height);
        document.getElementById("operationMsg").innerHTML ="touchstart:" + x + "," + y;
        down(x, y);
    },false);
    canvas.addEventListener("touchmove",function (e) {
        x = Math.round(e.touches[0].clientX / window_width * webgl_width);
        y = Math.round((1 - Math.floor(e.touches[0].clientY) / window_height) * webgl_height);
        document.getElementById("operationMsg").innerHTML ="touchmove:" + x + "," + y;
        move(x, y);
    },false);
    canvas.addEventListener("touchend",function (e) {
        x = Math.round(e.touches[0].clientX / window_width * webgl_width);
        y = Math.round((1 - Math.floor(e.touches[0].clientY) / window_height) * webgl_height);
        document.getElementById("operationMsg").innerHTML ="touchend:" + x + "," + y;
        up(x, y);
    },false);
}

function down(x, y) {
    for (var i = event_actors.length - 1; i >= 0; i --) {
        if (s_screen.get(event_actors[i]).inactor(x, y)) {
            event_actor = event_actors[i];
            s_screen.get(event_actor).down(x, y);
            break;
        }
    }
}

function move(x, y) {
    s_screen.get(event_actor).move(x, y);
}

function up(x, y) {
    if (event_actor != null) {
        s_screen.get(event_actor).up(x, y);
        event_actor = null;
    }
}

