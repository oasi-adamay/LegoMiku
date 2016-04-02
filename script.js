// Lego Miku @WebGL

// canvas とクォータニオンをグローバルに扱う
var c;
var q = new qtnIV();
var qt = q.identity(q.create());

// マウスムーブイベントに登録する処理
function mouseMove(e){
	var cw = c.width;
	var ch = c.height;
	var wh = 1 / Math.sqrt(cw * cw + ch * ch);
	var x = e.clientX - c.offsetLeft - cw * 0.5;
	var y = e.clientY - c.offsetTop - ch * 0.5;
	var sq = Math.sqrt(x * x + y * y);
	var r = sq * 2.0 * Math.PI * wh;
	if(sq != 1){
		sq = 1 / sq;
		x *= sq;
		y *= sq;
	}
	q.rotate(r, [y, x, 0.0], qt);
//	q.rotate(r, [-y, -x, 0.0], qt);		//drag mode
}

onload = function(){
	// canvasエレメントを取得	
	c = document.getElementById('canvas');
	c.width = 512;
	c.height = 512;
	
	// canvas のマウスムーブイベントに処理を登録	
	c.addEventListener('mousemove', mouseMove, true);

    // webglコンテキストを取得
	var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
	if(gl== null){
		console.log('webgl is not supported');	return;	
	}

	// 拡張機能を有効化する
	if(!gl.getExtension('OES_standard_derivatives')){
		console.log('OES_standard_derivatives is not supported');	
		return;
	}
	
	var glExt;
	glExt = (
		gl.getExtension('ANGLE_instanced_arrays')
	);
	if(glExt == null){
		console.log('ANGLE_instanced_arrays is not supported');
		return;
	}
	
	

    // 頂点シェーダとフラグメントシェーダの生成
	var v_shader = create_shader('vs');
	var f_shader = create_shader('fs');
	
    // プログラムオブジェクトの生成とリンク
	var prg = create_program(v_shader, f_shader);
	
    // attributeLocationを配列に取得
	var E_Att = {pos:0, nor:1, instPos:2 , instCol:3 };
	var attLocation = new Array();
	attLocation[E_Att.pos] = gl.getAttribLocation(prg, 'position');
	attLocation[E_Att.nor] = gl.getAttribLocation(prg, 'normal');
	attLocation[E_Att.instPos] = gl.getAttribLocation(prg, 'instancePosition');
	attLocation[E_Att.instCol] = gl.getAttribLocation(prg, 'instanceColor');
	
    // attributeの要素数を配列に格納
	var attStride = new Array();
	attStride[E_Att.pos] = 3;		//position:xyz
	attStride[E_Att.nor] = 3;		//normal vec:xyz
	attStride[E_Att.instPos] = 3;	//instance position:xyz
	attStride[E_Att.instCol] = 4;	//instance color:rgbr
	
    // uniformLocationの取得
	var E_Uni = {mvpMtx:0, mMtx:1, invMtx:2 , lightDir:3 , eyePos:4};
	var uniLocation = new Array();

	uniLocation[E_Uni.mvpMtx] = gl.getUniformLocation(prg, 'mvpMatrix');
	uniLocation[E_Uni.mMtx] = gl.getUniformLocation(prg, 'mMatrix');
	uniLocation[E_Uni.invMtx] = gl.getUniformLocation(prg, 'invMatrix');
	uniLocation[E_Uni.lightDir] = gl.getUniformLocation(prg, 'lightDirection');
	uniLocation[E_Uni.eyePos] = gl.getUniformLocation(prg, 'eyePosition');
	
	
	
	var modelDataArray = new Array();		// モデルデータ配列
	var mdVBOListArray  =  new Array();		// モデルごとのVBO List配列
	var mdIBOArray      =  new Array();		// モデルごとのIBO配列

	var instPosArray = new Array();	//インスタンスposition配列
	var instCorArray  = new Array();		//インスタンス color配列	

	//model id:0 LegoBlock
	{
		var modelData = modelLegoBlock();
		modelDataArray.push(modelData);
		var mdPosition = create_vbo(modelData.p);
		var mdNormal   = create_vbo(modelData.n);
	//	var mdColor    = create_vbo(modelData.c);
		mdVBOListArray.push([mdPosition, mdNormal]);
		mdIBOArray.push(create_ibo(modelData.i));
	}
	
	//model id:1 LegoCylinder
	{
		var modelData = modelLegoCylinder();
		modelDataArray.push(modelData);
		var mdPosition = create_vbo(modelData.p);
		var mdNormal   = create_vbo(modelData.n);
	//	var mdColor    = create_vbo(modelData.c);
		mdVBOListArray.push([mdPosition, mdNormal]);
		mdIBOArray.push(create_ibo(modelData.i));
	}
	
	
	// 各インスタンスに適用するデータ

	// インスタンス用配列 モデル数分
	for(var i=0;i<modelDataArray.length;i++){
		instPosArray.push(new Array());
		instCorArray.push(new Array());
	}
	


//1-1,1-2,1-3　顔
	appendPosCol(instPosArray,instCorArray,[
[-2.0,16.0,0.0],	
"    gggggg",
" gggg gg gggg",
" gggg    gggg",
"   gg    gg",
"   kkfg gkk",
"     fggf",
"      gg",
"       g",
[-2.0,15.0,0.0],
"    gggggg",
"gggggggggggggg",
"gggg      gggg",
"  kk gggg kk",
"  kkfgffgfkk",
"    fCffCf",
"       g",
[-2.0,14.0,0.0],
"    gggggg ",
"   gggggggg",
"  kkk gg kkk",
"  ykggggggky",
"  RkfggggfkR",
"    fBffBf",
[-2.0,13.0,0.0],
"     gggg",
"    gggggg",
"   gggggggg",
"  kkkggggkkk",
"  kkppggppkk",
"    ppffpp",
]);



//1-4　顔（髪）
	appendPosCol(instPosArray,instCorArray,[
[-1.0,17.0,0.0],	
"    gggg",
"gg gggggg gg",
"gggg    gggg",
"  ggg  ggg",
"  gggggggg",
"gggggggggg",
"  gggggggg",
"     gg",
[-1.0,16.0,5.0],
" ggg    ggg",
" ggg    ggg",
[-1.0,15.0,5.0],
" gg      gg",
" gg      gg",
[-1.0,14.0,5.0],
" gg      gg",
" gg        ",
]);

//1-5
	appendPosCol(instPosArray,instCorArray,[
[-1.0,20.0,0.0],
"",
"  k      k",
"  k  gg  k",
"  k gggg k",
"    gggg",
"    gggg",
"     gg",
[-1.0,19.0,0.0],
"",
" gk  gg  kg",
"ggkggggggkgg",
"  kggggggk",
"   g gg g",
"   gggggg",
"    gggg",
"    gg",
[-1.0,18.0,0.0],
"     gg",
"ggk gggg kgg",
"ggkggggggkgg",
"  kkg  gkk",
"  gggggggg",
"  gggggggg",
"   gggggg",
"    ggg",
]);

//1-6　顔（首）
	appendPosCol(instPosArray,instCorArray,[
[1.0,12.0,0.0],
"  gg",
" gggg",
"gggggg",
[1.5,12.0,3.0],
"ggggggg",
"gg f gg",
" fffff",
[1.5,11.0,3.0],
"       ",
"       ",
" k    ",
" k    ",
]);

//1-7　顔（もみあげ）
	appendPosCol(instPosArray,instCorArray,[
[0.5,13.0,4.0],
"         ",
"g       g",
"g        ",
[0.5,12.0,4.0],
"g       g",
"g       g",
[0.5,11.0,4.0],
"         ",
"g       g"
]);



//2-1
	appendPosCol(instPosArray,instCorArray,[
[1.0,6.0,1.0],
"        ",
"   ww   ",
"  wwww  ",
"  wwww  ",
"   ww   ",
"        ",
[1.0,5.0,1.0],
"        ",
"  kkkk  ",
" kkkkkk ",
" kkkkkk ",
"  kkkk  ",
"        ",
[1.0,4.0,1.0],
"  gggg  ",
" gggggg ",
"gggggggg",
"gggggggg",
" gggggg ",
"  gggg  ",
]);
//2-2 ,2-4
	appendPosCol(instPosArray,instCorArray,[
[1.5,7.0,1.0],
"       ",
"       ",
"  www  ",
"  www  ",
"       ",
"       ",
[1.5,8.0,1.0],
"       ",
"       ",
"  www  ",
"  wgw  ",
"   g   ",
"       ",
[1.5,9.0,1.0],
"       ",
"       ",
"  www  ",
"  wwy  ",
"   g   ", 
"       ",
[1.5,10.0,1.0],
"       ",
"       ",
" ffwff ",
"  ggw  ",
"   g   ",
"       ",
[1.5,11.0,1.0],
"       ",
"       ",
"  www  ",
"  WgW  ",
"       ",
"       "
]);
//2-3 手
	appendPosCol(instPosArray,instCorArray,[
[-0.5,9.0,2.5],
"   g   g ",
"   g   g ",
[-0.5,8.0,2.5],
"  kk   kk",
"  kk   kk",
[-0.5,7.0,2.5],
" kk     kk",
" kk     kk",
[-0.5,6.0,2.5],
"          ",
"ff       ff",
]);

//2-5 足
	appendPosCol(instPosArray,instCorArray,[
[1.5,3.0,1.0],
"       ",
"       ",
"  f f  ",
"  f f  ",
"       ",
"       ",
[1.5,2.0,1.0],
"       ",
"       ",
"  g g  ",
"  g g  ",
"       ",
"       ",
[1.5,1.0,1.0],
"       ",
"       ",
"  k k  ",
"  k k  ",
"       ",
"       ",
[1.5,0.0,1.0],
"       ",
"       ",
"  k k  ",
"  k k  ",
"       ",
"       ",
[1.5,-1.0,1.0],
"       ",
"  fff  ",
"  fff  ",
"  k k  ",
"  k k  ",
"       "
]);



//3 髪
	appendPosCol(instPosArray,instCorArray,[
[-4.0,14.0,0.0],
"                ",
"  gg          gg",
"  gg          gg",
[-4.0,13.0,0.0],
"                 ",
" ggg          ggg",
" ggg          ggg",
[-4.0,12.0,0.0],
"                 ",
" ggg          ggg",
" ggg          ggg",
[-4.0,11.0,0.0],
"                  ",
"ggg            ggg",
"ggg            ggg",
[-4.0,10.0,0.0],
"                  ",
"ggg            ggg",
"ggg            ggg",
[-4.0,9.0,0.0],
"                  ",
"ggg            ggg",
"ggg            ggg",
[-4.0,8.0,0.0],
" g              g ",
"ggg            ggg",
"ggg            ggg",
" g              g ",
[-4.0,7.0,0.0],
"gg              gg",
"gg              gg",
"gg              gg",
"gg              gg",
[-4.0,6.0,0.0],
"gg              gg",
"gg              gg",
"gg              gg",
"gg              gg",
[-4.0,5.0,0.0],
"gg              gg",
"gg              gg",
"gg              gg",
"gg              gg",
[-4.0,4.0,0.0],
"gg              gg",
"gg              gg",
"gg              gg",
"gg              gg",
[-4.0,3.0,0.0],
"gg              gg",
"gg              gg",
"gg              gg",
"gg              gg",
[-4.0,2.0,0.0],
"gg              gg",
"gg              gg",
"gg              gg",
"gg              gg",
[-4.0,1.0,0.0],
"gg              gg",
"gg              gg",
"gg              gg",
"gg              gg",
[-4.0,0.0,0.0],
"                  ",
"ggg            ggg",
"ggg            ggg",
"                  ",
[-4.0,-1.0,0.0],
"                  ",
" gg            gg ",
" gg            gg ",
"                  ",

]);
	
	//インスタンpositionのセンタリング
	centeringPos(instPosArray);
	
	
	// 配列からVBOを生成
	var instPosVBOArray = new Array();
	var instColVBOArray = new Array();
	
	for(var i=0;i<instPosArray.length;i++){
		instPosVBOArray.push(create_vbo(instPosArray[i]));
		instColVBOArray.push(create_vbo(instCorArray[i]));
	}

    // minMatrix.js を用いた行列関連処理
	var m = new matIV();
	var mMatrix   = m.identity(m.create());
	var vMatrix   = m.identity(m.create());
	var pMatrix   = m.identity(m.create());
	var tmpMatrix = m.identity(m.create());
	var mvpMatrix = m.identity(m.create());
	var invMatrix = m.identity(m.create());
	
    // カリングと深度テストを有効にする
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.CULL_FACE);
	
	
	// 点平行の位置
	var lightDirection = [-0.577, 0.577, 0.577];
//	var lightDirection = [15.0, 15.0, 15.0];
	
	//視点の原点
	var eyePositionBase = [0.0, 0.0, 20.0];
//	var eyePositionBase = [0.0, 7.0, 30.0];

	// カメラの上方向を表すベクトル	
	var camUpDirectionBase = [0.0, 1.0, 0.0];

	
	// 環境光の色
//	var ambienmdColor = [0.1, 0.1, 0.1, 1.0];
	
/*	
	var ambienmdColor = [0.5, 0.5, 0.5, 1.0];
	
	// カメラの位置
	var camPosition = [0.0, 0.0, 10.0];
	
	// カメラの上方向を表すベクトル	
	var camUpDirection = [0.0, 1.0, 0.0];
	
    // ビュー×プロジェクション座標変換行列
	m.lookAt(camPosition, [0, 0, 0], camUpDirection, vMatrix);
	m.perspective(45, c.width / c.height, 0.1, 100, pMatrix);
	m.multiply(pMatrix, vMatrix, tmpMatrix);
*/
	
    // カウンタの宣言
	var count = 0;
	
	
	// infinit loop
	(function(){
		// inclement counter 
		count++;
		
		var eyePosition = new Array();
		var camUpDirection = new Array();
		q.toVecIII(eyePositionBase, qt, eyePosition);
		q.toVecIII(camUpDirectionBase, qt, camUpDirection);
		m.lookAt(eyePosition, [0.0, 0.0, 0.0], camUpDirection, vMatrix);
		m.perspective(90, c.width / c.height, 0.1, 50.0, pMatrix);
		m.multiply(pMatrix, vMatrix, tmpMatrix);
		
		
        // initialize canvas
		gl.clearColor(0.75, 0.75, 0.75, 1.0);
//		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		m.identity(mMatrix);
//		m.rotate(mMatrix, (count % 360) * Math.PI / 180, [1.0, 1.0, 0.0], mMatrix);
		m.multiply(tmpMatrix, mMatrix, mvpMatrix);
		m.inverse(mMatrix, invMatrix);
		gl.uniformMatrix4fv(uniLocation[E_Uni.mvpMtx], false, mvpMatrix);
		gl.uniformMatrix4fv(uniLocation[E_Uni.mMtx], false, mMatrix);
		gl.uniformMatrix4fv(uniLocation[E_Uni.invMtx], false, invMatrix);
		gl.uniform3fv(uniLocation[E_Uni.lightDir], lightDirection);
		gl.uniform3fv(uniLocation[E_Uni.eyePos], eyePosition);
		
		for(var i=0;i<instPosArray.length;i++){

			var instanceCount = instPosArray[i].length /attStride[E_Att.instPos];
			if(instanceCount==0) continue;
	
			//model のbind
			set_attribute(mdVBOListArray[i], attLocation, attStride);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mdIBOArray[i]);
			
			// インスタンス用の座標位置VBOを有効にする
			gl.bindBuffer(gl.ARRAY_BUFFER, instPosVBOArray[i]);
			gl.enableVertexAttribArray(attLocation[E_Att.instPos]);
			gl.vertexAttribPointer(attLocation[E_Att.instPos], attStride[E_Att.instPos], gl.FLOAT, false, 0, 0);

			// インスタンスを有効化し除数を指定する
			glExt.vertexAttribDivisorANGLE(attLocation[E_Att.instPos], 1)

			// インスタンス用の色情報VBOを有効にする
			gl.bindBuffer(gl.ARRAY_BUFFER, instColVBOArray[i]);
			gl.enableVertexAttribArray(attLocation[E_Att.instCol]);
			gl.vertexAttribPointer(attLocation[E_Att.instCol], attStride[E_Att.instCol], gl.FLOAT, false, 0, 0);

			// インスタンスを有効化し除数を指定する
			glExt.vertexAttribDivisorANGLE(attLocation[E_Att.instCol], 1)
			
			// Draw
			glExt.drawElementsInstancedANGLE(gl.TRIANGLES, modelDataArray[i].i.length, gl.UNSIGNED_SHORT, 0, instanceCount);

		}
		
		
		// gl command flush
		gl.flush();
		
        // recursive call for infinit loop		
		setTimeout(arguments.callee, 1000 / 30);
	})();

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
	
	function appendPosCol(posArray,colArray,modelSrc){
	
		var _g = [134.0/256.0,206.0/256.0,203.0/256.0,1.0];
		var _k = [16.0/256.0,16.0/256.0,16.0/256.0,1.0];
		var _y = [206.0/256.0,206.0/256.0,16.0/256.0,1.0];
		var _r = [206.0/256.0,16.0/256.0,16.0/256.0,1.0];
		var _w = [238.0/256.0,238.0/256.0,238.0/256.0,1.0];
		var _b = [16.0/256.0,16.0/256.0,206.0/256.0,1.0];
		var _f = [252.0/256.0,226.0/256.0,196.0/256.0,1.0];//R:252 G:226 B:196
		var _p = [235.0/256.0,211.0/256.0,207.0/256.0,1.0];//235/211/207
		var _c = [78.0/256.0,191.0/256.0,233.0/256.0,1.0];//78/191/233

		var x = 0.0;
		var y = 0.0;
		var z = 0.0;
		
		while(modelSrc.length!=0){
			var str = modelSrc.shift();
			
			if(isArray(str)){
				if(str.length==3){
					x = str[0];
					y = str[1];
					z = str[2];
				}
				continue;
			}

			var p = 0;
			var xSave = x;
			while(str.length>p){
				var c = str.substr(p,1);p++;
				var i = -1;	//model id
				var _color;
				switch(c){
				case('g'): i = 0 ; _color = _g; break;
				case('k'): i = 0 ; _color = _k; break;
				case('y'): i = 0 ; _color = _y; break;
				case('f'): i = 0 ; _color = _f; break;
				case('p'): i = 0 ; _color = _p; break;
				case('w'): i = 0 ; _color = _w; break;
				case('R'): i = 1 ; _color = _r; break;
				case('W'): i = 1 ; _color = _w; break;
				case('B'): i = 1 ; _color = _b; break;
				case('C'): i = 1 ; _color = _c; break;
				};
				if(i>=0){
					posArray[i].push(x,y,z);
					colArray[i].push(_color[0],_color[1],_color[2],_color[3]);
				}
				x++;
			}
			x = xSave;
			z++;
		}
		
		return;
	}
	
	function centeringPos(posArray){
		var instNum = 0

		var sumX =0.0;
		var sumY =0.0;
		var sumZ =0.0;

		for(var i=0;i<posArray.length;i++){
			for(var j =0;j<posArray[i].length /3;j++){
				sumX += posArray[i][j*3+0];
				sumY += posArray[i][j*3+1];
				sumZ += posArray[i][j*3+2];
				instNum += 1;
			}
		}
		
		var aveX = sumX / instNum;
		var aveY = sumY / instNum;
		var aveZ = sumZ / instNum;

		for(var i=0;i<posArray.length;i++){
			for(var j =0;j<posArray[i].length /3;j++){
				posArray[i][j*3+0] -= aveX;
				posArray[i][j*3+1] -= aveY;
				posArray[i][j*3+2] -= aveZ;
			}
		}

	}
	
	
    // シェーダを生成する関数
    function create_shader(id){
        // シェーダを格納する変数
        var shader;
        
        // HTMLからscriptタグへの参照を取得
        var scriptElement = document.getElementById(id);
        
        // scriptタグが存在しない場合は抜ける
        if(!scriptElement){return;}
        
        // scriptタグのtype属性をチェック
        switch(scriptElement.type){
            
            // 頂点シェーダの場合
            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
                
            // フラグメントシェーダの場合
            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default :
                return;
        }
        
        // 生成されたシェーダにソースを割り当てる
        gl.shaderSource(shader, scriptElement.text);
        
        // シェーダをコンパイルする
        gl.compileShader(shader);
        
        // シェーダが正しくコンパイルされたかチェック
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            
            // 成功していたらシェーダを返して終了
            return shader;
        }else{
            
            // 失敗していたらエラーログをアラートする
            alert(gl.getShaderInfoLog(shader));
        }
    }
    
    // プログラムオブジェクトを生成しシェーダをリンクする関数
    function create_program(vs, fs){
        // プログラムオブジェクトの生成
        var program = gl.createProgram();
        
        // プログラムオブジェクトにシェーダを割り当てる
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        
        // シェーダをリンク
        gl.linkProgram(program);
        
        // シェーダのリンクが正しく行なわれたかチェック
        if(gl.getProgramParameter(program, gl.LINK_STATUS)){
        
            // 成功していたらプログラムオブジェクトを有効にする
            gl.useProgram(program);
            
            // プログラムオブジェクトを返して終了
            return program;
        }else{
            
            // 失敗していたらエラーログをアラートする
            alert(gl.getProgramInfoLog(program));
        }
    }
    
    // VBOを生成する関数
    function create_vbo(data){
        // バッファオブジェクトの生成
        var vbo = gl.createBuffer();
        
        // バッファをバインドする
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        
        // バッファにデータをセット
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        
        // バッファのバインドを無効化
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        // 生成したVBOを返して終了
        return vbo;
    }
    
    // VBOをバインドし登録する関数
    function set_attribute(vbo, attL, attS){
        // 引数として受け取った配列を処理する
        for(var i in vbo){
            // バッファをバインドする
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
            
            // attributeLocationを有効にする
            gl.enableVertexAttribArray(attL[i]);
            
            // attributeLocationを通知し登録する
            gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
        }
    }
    
    // IBOを生成する関数
    function create_ibo(data){
        // バッファオブジェクトの生成
        var ibo = gl.createBuffer();
        
        // バッファをバインドする
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        
        // バッファにデータをセット
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
        
        // バッファのバインドを無効化
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
        // 生成したIBOを返して終了
        return ibo;
    }

};


