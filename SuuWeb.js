//----------variable----------//
var screen;
var image;
var animation;
var sound;
var unused_texture;

var webgl_width;
var webgl_height;
var play_time;

var gl;

//图像大小与位置
var tposition;
var mposition;
//纹理分割与选择
var ttexcoord;
var mtexcoord;
//纹理贴图与颜色
var texture;
var color;
//----------class----------//
var MinHashMap = {
    op: function () {
        var minHashMap = {};

        //MinHashMap-variable
        minHashMap.obj = new Object();
        minHashMap.size = 0;

        //MinHashMap-function
        minHashMap.containskey = function (key) {
            return (key in minHashMap.obj);
        }
        minHashMap.put = function (key, value) {
            if (!minHashMap.containskey(key)){
                minHashMap.size ++;
            }
            minHashMap.obj[key] = value;
        }
        minHashMap.get = function (key){
            return minHashMap.obj[key];
        }

        minHashMap.remove = function (key){
            if(minHashMap.containskey(key)&&(delete minHashMap.obj[key])){
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
                minLinkedHashMap.obj[key] = {};
                if (minLinkedHashMap.size == 0) {
                    minLinkedHashMap.op_key = key;
                } else if (minLinkedHashMap.size > 0) {
                    minLinkedHashMap.obj[minLinkedHashMap.ed_key].next = key;
                    minLinkedHashMap.obj[key].last = minLinkedHashMap.ed_key;
                }
                minLinkedHashMap.ed_key = key;
                minLinkedHashMap.size ++;
            }
            minLinkedHashMap.obj[key].value = value;
        }
        minLinkedHashMap.get = function (key){
            return minLinkedHashMap.obj[key].value;
        }
        minLinkedHashMap.getlast = function (key){
            minLinkedHashMap.op_key = minLinkedHashMap.obj[key].last;
            return minLinkedHashMap.obj[key].value;
        }
        minLinkedHashMap.getnext = function (key){
            minLinkedHashMap.ed_key = minLinkedHashMap.obj[key].next;
            return minLinkedHashMap.obj[key].value;
        }
        minLinkedHashMap.remove = function (key) {
            if (minLinkedHashMap.containskey(key)) {
                if (minLinkedHashMap.containskey(minLinkedHashMap.obj[key].last)) {
                    minLinkedHashMap.obj[minLinkedHashMap.obj[key].last].next = minLinkedHashMap.obj[key].next;
                }
                if (minLinkedHashMap.containskey(minLinkedHashMap.obj[key].next)) {
                    minLinkedHashMap.obj[minLinkedHashMap.obj[key].next].last = minLinkedHashMap.obj[key].last;
                }
                delete minLinkedHashMap.obj[key];
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
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture_op);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_op);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.uniform1i(texture, 0);
            image_op = null;
            image.put(image_path, texture_op);
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

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture_op);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_op);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(texture, 0);
        image_op = null;
        image.put(key, texture_op);
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
            gl.uniformMatrix4fv(mposition, false, suuActor.matrix);
            gl.uniform4f(tposition, suuActor.x * 2 / webgl_width - 1, suuActor.y * 2 / webgl_height - 1, 0, 0);
            suuActor.texcoord_update();
            suuActor.color_update();
            gl.bindTexture(gl.TEXTURE_2D, image.get(suuActor.key));
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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

        suuActor.texcoord_update = function () {
            gl.uniform2f(mtexcoord, 1, 1);
            gl.uniform2f(ttexcoord, 0, 0);
        }
        suuActor.color_update = function () {
            gl.uniform4f(color, 1, 1, 1, suuActor.alpha);
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

        if(!image.containskey(suuActor.key)) {
            if (unused_texture.length > 0) {
                SuuImage.unused_op(unused_texture.pop(), suuActor.key);
            } else {
                SuuImage.op(gl.createTexture(), suuActor.key);
            }
        }

        //SuuActor-function
        suuActor.position_update = function () {
            gl.uniform4f(mposition, suuActor.width * 2, suuActor.height * 2, 1, 1);
            gl.uniform4f(tposition, suuActor.x * 2 / webgl_width - 1, suuActor.y * 2 / webgl_height - 1, 0, 0);
        }
        suuActor.texcoord_update = function () {
            gl.uniform2f(mtexcoord, 1 / suuActor.divideX, 1 / suuActor.divideY);
            gl.uniform2f(ttexcoord, (Math.ceil(suuActor.chooseX/5) - 1) / suuActor.divideX, (suuActor.chooseY - 1) / suuActor.divideY);
        }
        suuActor.update = function () {
            suuActor.chooseX ++;
            if (Math.ceil(suuActor.chooseX/5) > suuActor.divideX){
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
            if (image.containskey(key)) {
                SuuImage.text_op(image.get(suuActor.key), suuActor.key, text, width, height, font_size, font_color);
            } else {
                SuuImage.text_op(gl.createTexture(), suuActor.key, text, width, height, font_size, font_color);
            }
        }

        //SuuActor-function
        suuActor.settext = function (text) {
            suuActor.text = text;
            SuuImage.text_op(image.get(suuActor.key), suuActor.key, text, width, height, font_size, font_color);
        }

        return suuActor;
    }
};
//----------webgl----------//
function webgl_op(){
    gl.viewport(0, 0, webgl_width, webgl_height);

    //加载着色器
    var VERTEX_SHADER_SOURCE =
        "attribute vec4 aposition;\n" +
        "attribute vec2 atexcoord;\n" +
        "varying vec2 texcoord;\n" +
        "uniform mat4 mposition;\n" +
        "uniform vec2 mtexcoord;\n" +
        "uniform vec4 tposition;\n" +
        "uniform vec2 ttexcoord;\n" +
        "void main() {\n" +
        "	texcoord = atexcoord * mtexcoord + ttexcoord;\n"+
        "	gl_Position = aposition * mposition + tposition;\n" +
        "}\n";
    var FRAGMENT_SHADER_SOURCE =
        "#ifdef GL_ES\n" +
        "	precision mediump float;\n" +
        "#endif\n" +
        "varying vec2 texcoord;\n" +
        "uniform sampler2D texture;\n" +
        "uniform vec4 color;\n" +
        "void main() {\n" +
        "   vec3 v = texture2D(texture, texcoord).rgb;"+
        "	gl_FragColor = texture2D(texture, texcoord) * color;\n" +
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
    mposition = gl.getUniformLocation(program, "mposition");;
    //图形移动
    tposition = gl.getUniformLocation(program, "tposition");;
    //纹理裁剪
    mtexcoord = gl.getUniformLocation(program, "mtexcoord");;
    //纹理选择
    ttexcoord = gl.getUniformLocation(program, "ttexcoord");;
    texture = gl.getUniformLocation(program, "texture");
    color = gl.getUniformLocation(program, "color");

    //透明png
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
}

function webgl_play(){
    screen.ed_key = screen.op_key;
    for(var i = 0; i < screen.size; i++){
        screen.getnext(screen.ed_key).update();
    }

    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    screen.ed_key = screen.op_key;
    for(var i = 0; i < screen.size; i++){
        screen.getnext(screen.ed_key).play();
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
    screen = MinLinkedHashMap.op();
    image = MinHashMap.op();
    animation = MinLinkedHashMap.op();
    sound = MinLinkedHashMap.op();
    unused_texture = new Array();

    play_time = 1000 / fps;
    gl = canvas.getContext("webgl");
    webgl_op();
    screen.put("1",SuuActor.text_op(100, 100, 300, 50, 20, "#FF00FF", "11sssssssssssss1", "key"));
    // screen.put("2",SuuActor.op(0, 0, 100, 100, 5, 4,"image/robin.png"));
    screen.put("2",SuuActor.op(0, 0, 100, 100, 8, 4,"image/xxyd.png"));
    setInterval("webgl_play();", play_time);
}
var sx = 0;
var sy = 0;
var flag = false;
//加载点击和触摸事件
function addevent(canvas){
    var x,y;
    canvas.addEventListener("mousedown",function (e) {
        x = e.clientX;
        y = webgl_height - e.clientY;
        document.getElementById("operationMsg").innerHTML ="mousedown:" + x + "," + y;
        if (screen.get("1").inactor(x,y)){
            sx = x - screen.get("1").x;
            sy = y - screen.get("1").y;
            flag  = true;
        }
    },false);
    canvas.addEventListener("mousemove",function (e) {
        x = e.clientX;
        y = webgl_height - e.clientY;
        document.getElementById("operationMsg").innerHTML ="mousemove:" + x + "," + y;
        if (flag){
            screen.get("1").setxy(x-sx,y-sy);
        }
    },false);
    canvas.addEventListener("mouseup",function (e) {
        x = e.clientX;
        y = webgl_height - e.clientY;
        document.getElementById("operationMsg").innerHTML ="mouseup:" + x + "," + y;
        flag = false;
    },false);

    canvas.addEventListener("touchstart",function (e) {
        x = e.touches[0].clientX;
        y = webgl_height - Math.floor(e.touches[0].clientY);
        document.getElementById("operationMsg").innerHTML ="touchstart:" + x + "," + y;
    },false);
    canvas.addEventListener("touchmove",function (e) {
        x = e.pageX;
        y = webgl_height - Math.floor(e.touches[0].clientY);
        document.getElementById("operationMsg").innerHTML ="touchmove:" + x + "," + y;
    },false);
    canvas.addEventListener("touchend",function (e) {
        x = e.pageX;
        y = webgl_height - Math.floor(e.touches[0].clientY);
        document.getElementById("operationMsg").innerHTML ="touchend:" + x + "," + y;
    },false);
}