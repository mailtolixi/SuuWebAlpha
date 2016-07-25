//----------variable----------//
var play_time;

var gl;
var vertex_shader;
var fragment_shader;
var program;
var position;
var texcoord;
var texture;
//----------class----------//
var SuuActor = {
    op: function(array_position,array_texcoord,image_path){
        var suuActor = {};
        //SuuActor-variable
        suuActor.position_buffer = gl.createBuffer();
        suuActor.texcoord_buffer = gl.createBuffer();
        suuActor.image = new Image();
        suuActor.texture;

        suuActor.image.onload = function(){
            suuActor.texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, suuActor.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, suuActor.image);
            gl.uniform1i(texture, 0);
        }
        suuActor.image.src = image_path;
        //SuuActor-function
        suuActor.play = function(){
            gl.bindBuffer(gl.ARRAY_BUFFER, suuActor.position_buffer);
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, suuActor.texture);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        //SuuActor-op()
        gl.bindBuffer(gl.ARRAY_BUFFER, suuActor.position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, array_position, gl.STATIC_DRAW);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, suuActor.texcoord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, array_texcoord, gl.STATIC_DRAW);
        gl.vertexAttribPointer(texcoord, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return suuActor;
    }
};
//----------webgl----------//
var VERTEX_SHADER_SOURCE =
    "attribute vec4 aposition;\n" +
    "attribute vec2 atexcoord;\n" +
    "varying vec2 texcoord;\n" +
    "void main() {\n" +
    "	texcoord = atexcoord;\n"+
    "	gl_Position = aposition;\n" +
    "}\n";
var FRAGMENT_SHADER_SOURCE =
    "#ifdef GL_ES\n" +
    "	precision mediump float;\n" +
    "#endif\n" +
    "uniform sampler2D texture;\n" +
    "varying vec2 texcoord;\n" +
    "void main() {\n" +
    "	gl_FragColor = texture2D(texture, texcoord);\n" +
    "}\n";

function webgl_op(){
    //加载着色器
    vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertex_shader,VERTEX_SHADER_SOURCE);
    gl.shaderSource(fragment_shader,FRAGMENT_SHADER_SOURCE);
    gl.compileShader(vertex_shader);
    gl.compileShader(fragment_shader);
    program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    gl.useProgram(program);

    position = gl.getAttribLocation(program, "aposition");
    gl.enableVertexAttribArray(position);
    texcoord = gl.getAttribLocation(program, "atexcoord");
    gl.enableVertexAttribArray(texcoord);
    texture = gl.getUniformLocation(program, "texture");
}

function webgl_play(){
    setTimeout("webgl_play();",play_time);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    s1.play();
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
var s1;
var s2;
var date;
var second = 0;
var fps = 0;


//开始调用执行
function op(canvas, width, height, fps){
    var c=document.getElementById(canvas);
    c.style.width = 960+"px";
    c.style.height = 540+"px";
    play_time = 1000/fps;
    gl=c.getContext("webgl");
    gl.viewport(0, 0, c.width, c.height);
    webgl_op();
    s1 = SuuActor.op(new Float32Array([1, 0.5,1,1, 0.5,0.5,0.5, 1]),new Float32Array([0, 1, 0, 0, 1, 1, 1, 0]),"image/lightblueflower.JPG");
    s2 = SuuActor.op(new Float32Array([0, 0.5,0,0, 0.5,0.5,0.5, 0]),new Float32Array([0, 1, 0, 0, 1, 1, 1, 0]),"image/robin.png");
    webgl_play();
    // setInterval("webgl_play();",1000/times);
}
