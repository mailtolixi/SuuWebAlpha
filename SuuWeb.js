//----------variable----------//
var webgl_width;
var webgl_height;
var play_time;
var play_speed = 5;

var gl;

var texture;
var color;
var tposition;
var ttexcoord;
var mposition;
var mtexcoord;
//----------class----------//

var SuuImage = {
    op: function(x,y,width,height,divideX,divideY,image_path){
        var suuImage = {};
        //SuuActor-variable
        suuImage.x = x;
        suuImage.y = y;
        suuImage.width = width;
        suuImage.height = height;
        suuImage.divideX = divideX;
        suuImage.divideY = divideY;
        suuImage.chooseX = 1;
        suuImage.chooseY = 1;
        suuImage.alpha = 1;
        suuImage.image = new Image();
        suuImage.texture;

        suuImage.image.onload = function(){
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
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
        }
        suuImage.image.src = image_path;
        //SuuActor-function
        suuImage.play = function(){
            suuImage.position_update();
            suuImage.texcoord_update();
            suuImage.color_update();
            gl.bindTexture(gl.TEXTURE_2D, suuImage.texture);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        suuImage.position_update = function () {
            // gl.bindBuffer(gl.ARRAY_BUFFER, suuImage.position_buffer);
            // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            //     suuImage.x/webgl_width-1,(suuImage.y+suuImage.height)/webgl_height-1,
            //     suuImage.x/webgl_width-1,suuImage.y/webgl_height-1,
            //     (suuImage.x+suuImage.width)/webgl_width-1,(suuImage.y+suuImage.height)/webgl_height-1,
            //     (suuImage.x+suuImage.width)/webgl_width-1,suuImage.y/webgl_height-1
            // ]), gl.STATIC_DRAW);
            gl.uniform4f(mposition,width,height,1,1);
            gl.uniform4f(tposition,x/webgl_width-1,y/webgl_height-1,0,0);
        }
        suuImage.texcoord_update = function () {
            // gl.bindBuffer(gl.ARRAY_BUFFER, suuImage.texcoord_buffer);
            // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            //     1.0/suuImage.divideX*(suuImage.chooseX-1.0), 1.0/suuImage.divideY*(suuImage.chooseY-1.0),
            //     1.0/suuImage.divideX*(suuImage.chooseX-1.0), 1.0/suuImage.divideY*suuImage.chooseY,
            //     1.0/suuImage.divideX*suuImage.chooseX, 1.0/suuImage.divideY*(suuImage.chooseY-1.0),
            //     1.0/suuImage.divideX*suuImage.chooseX, 1.0/suuImage.divideY*suuImage.chooseY
            // ]), gl.STATIC_DRAW);
            // gl.uniform2f(mtexcoord,1.0/divideX,1.0/divideY);
            // gl.uniform2f(ttexcoord,1.0/divideX*(chooseX-1),1.0/divideY*(chooseY-1));
            gl.uniform2f(mtexcoord,1/suuImage.divideX,1/suuImage.divideY);
            gl.uniform2f(ttexcoord,(suuImage.chooseX-1)/suuImage.divideX,(suuImage.chooseY-1)/suuImage.divideY);
        }
        suuImage.color_update = function () {
            gl.uniform4f(color,1,1,1,suuImage.alpha);
        }
        suuImage.setxy = function () {

        }
        suuImage.update = function () {
            suuImage.chooseX ++;
            if(suuImage.chooseX>suuImage.divideX&&suuImage.chooseY<suuImage.divideY){
                suuImage.chooseX = 1;
                suuImage.chooseY ++;
            }else if(suuImage.chooseX>suuImage.divideX&&suuImage.chooseY==suuImage.divideY){
                suuImage.chooseX = 1;
                suuImage.chooseY = 1;
            }
            suuImage.texcoord_update();
        }
        //SuuActor-op()

        suuImage.position_update();
        suuImage.texcoord_update();
        suuImage.color_update();
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return suuImage;
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
    gl.shaderSource(vertex_shader,VERTEX_SHADER_SOURCE);
    gl.shaderSource(fragment_shader,FRAGMENT_SHADER_SOURCE);
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

    mposition = gl.getUniformLocation(program, "mposition");;
    mtexcoord = gl.getUniformLocation(program, "mtexcoord");;
    tposition = gl.getUniformLocation(program, "tposition");;
    ttexcoord = gl.getUniformLocation(program, "ttexcoord");;
    texture = gl.getUniformLocation(program, "texture");
    color = gl.getUniformLocation(program, "color");

    //透明png
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
}

function webgl_play(){
    setTimeout("webgl_play();",play_time);
    s2.update();
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    s2.play();

    fps++;
    date = new Date();
    if (date.getSeconds()==0&&second==59){
        second = date.getSeconds();
        document.getElementById("test").innerHTML =second+ "||fps:"+fps;
        fps=0;
    } else if (date.getSeconds() - second >= 1){
        second = date.getSeconds();
        document.getElementById("test").innerHTML =second+ "||fps:"+fps;
        fps=0;
    }
}

//----------function----------//
var s2;
var date;
var second = 0;
var fps = 0;

//开始调用执行
function op(canvas, width, height, fps){
    var canvas=document.getElementById(canvas);
    addevent(canvas);
    webgl_width = canvas.width;
    webgl_height = canvas.height;
    play_time = 1000/fps;
    gl=canvas.getContext("webgl");
    webgl_op();
    s2 = SuuImage.op(100,100,500,500,5,5,"image/tx.png");
    webgl_play();
}

//加载点击和触摸事件
function addevent(canvas){
    canvas.addEventListener("mousedown",function (e) {
        document.getElementById("test").innerHTML ="mousedown:"+e.pageX+","+(webgl_height-e.pageY);
    },false);
    canvas.addEventListener("mousemove",function (e) {
        document.getElementById("test").innerHTML ="mousemove:"+e.pageX+","+(webgl_height-e.pageY);
    },false);
    canvas.addEventListener("mouseup",function (e) {
        document.getElementById("test").innerHTML ="mouseup:"+e.pageX+","+(webgl_height-e.pageY);
        s2.update();
    },false);

    canvas.addEventListener("touchstart",function (e) {
        document.getElementById("test").innerHTML ="touchstart:"+e.touches[0].clientX+","+e.touches[0].clientY;
    },false);
    canvas.addEventListener("touchmove",function (e) {
        document.getElementById("test").innerHTML ="touchmove:"+e.touches[0].clientX+","+e.touches[0].clientY;
    },false);
    canvas.addEventListener("touchend",function (e) {
        document.getElementById("test").innerHTML ="touchend:"+e.touches[0].clientX+","+e.touches[0].clientY;
    },false);
}