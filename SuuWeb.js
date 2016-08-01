//----------variable----------//
var screen;
var image;
var animation;
var sound;
var unused_texture;

var load_image;

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
            } else {
                return;
            }
            minHashMap.obj[key] = value;
        }
        minHashMap.get=function(key){
            return minHashMap.containskey(key)?minHashMap.obj[key]:null;
        }
        minHashMap.remove=function(key){
            if(minHashMap.containsKey(key)&&(delete minHashMap.obj[key])){
                minHashMap.size --;
            }
        };

        return minHashMap;
    }
}

var SuuImage = {
    op: function (image_path) {
        var suuImage = {};
        //SuuImage-variable
        suuImage.image = new Image();
        suuImage.texture;
        if (!image.containskey(image_path)) {
            suuImage.image.onload = function () {
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                suuImage.texture = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, suuImage.texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, suuImage.image);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.uniform1i(texture, 0);
                suuImage.image = null;
                image.put(image_path, suuImage.texture);
            }
            suuImage.image.src = image_path;
        }
    },
    unused_op: function (image_path,unused_texture) {
        alert("s");
        var suuImage = {};
        //SuuImage-variable
        suuImage.image = new Image();
        suuImage.texture = unused_texture;
        if (!image.containskey(image_path)) {
            suuImage.image.onload = function () {
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, suuImage.texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, suuImage.image);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.uniform1i(texture, 0);
                suuImage.image = null;
                image.put(image_path, suuImage.texture);
            }
            suuImage.image.src = image_path;
        }
    }
}

var SuuActor = {
    op: function (x, y, width, height, divideX, divideY, image_path){
        var suuActor = {};
        //SuuActor-variable
        suuActor.x = x;
        suuActor.y = y;
        suuActor.width = width;
        suuActor.height = height;
        suuActor.divideX = divideX;
        suuActor.divideY = divideY;
        suuActor.chooseX = 1;
        suuActor.chooseY = 1;
        suuActor.alpha = 1;
        suuActor.image = new Image();

        if (unused_texture.length > 0){
            SuuImage.unused_op(image_path,unused_texture.pop());
        } else {
            SuuImage.op(image_path);
        }

        //SuuActor-function
        suuActor.play = function(){
            suuActor.position_update();
            suuActor.texcoord_update();
            suuActor.color_update();
            gl.bindTexture(gl.TEXTURE_2D, image.get(image_path));
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        suuActor.position_update = function () {
            gl.uniform4f(mposition, suuActor.width * 2, suuActor.height * 2, 1, 1);
            gl.uniform4f(tposition, suuActor.x * 2 / webgl_width - 1, suuActor.y * 2 / webgl_height - 1, 0, 0);
        }
        suuActor.texcoord_update = function () {
            gl.uniform2f(mtexcoord, 1 / suuActor.divideX, 1 / suuActor.divideY);
            gl.uniform2f(ttexcoord, (suuActor.chooseX - 1) / suuActor.divideX, (suuActor.chooseY - 1) / suuActor.divideY);
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
            suuActor.chooseX ++;
            if (suuActor.chooseX > suuActor.divideX && suuActor.chooseY < suuActor.divideY){
                suuActor.chooseX = 1;
                suuActor.chooseY ++;
            } else if (suuActor.chooseX > suuActor.divideX && suuActor.chooseY == suuActor.divideY){
                suuActor.chooseX = 1;
                suuActor.chooseY = 1;
            }
            suuActor.texcoord_update();
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
        "uniform vec4 mposition;\n" +
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
         0, 1/webgl_height, 1, 1,
         0, 0, 1, 1,
         1/webgl_width, 1/webgl_height, 1, 1,
         1/webgl_width, 0, 1, 1,
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
    for(var key in screen.obj){
        screen.get(key).update();
    }

    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for(var key in screen.obj){
        screen.get(key).play();
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
var s1;
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
    screen = MinHashMap.op();
    image = MinHashMap.op();
    animation = MinHashMap.op();
    sound = MinHashMap.op();
    unused_texture = new Array();

    play_time = 1000 / fps;
    gl = canvas.getContext("webgl");
    webgl_op();
    screen.put("new1",SuuActor.op(200, 200, 100, 100, 1, 1,"image/lightblueflower.JPG"));
    screen.put("new",SuuActor.op(200, 200, 100, 100, 8, 4,"image/xxyd.png"));
    screen.put("new2",SuuActor.op(0, 0, 100, 100, 5, 4,"image/robin.png"));
    // s2 = SuuActor.op(0, 0, 180, 180, 5, 5,"image/tx.png");

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
        if (screen.get("new").inactor(x,y)){
            sx = x - screen.get("new").x;
            sy = y - screen.get("new").y;
            flag  = true;
        }
    },false);
    canvas.addEventListener("mousemove",function (e) {
        x = e.clientX;
        y = webgl_height - e.clientY;
        document.getElementById("operationMsg").innerHTML ="mousemove:" + x + "," + y;
        if (flag){
            screen.get("new").setxy(x-sx,y-sy);
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