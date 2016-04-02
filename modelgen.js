// ------------------------------------------------------------------------------------------------
// model generator
// version 0.0.1
// Copyright (c) isao yamada
// 
// ------------------------------------------------------------------------------------------------

// p : vertex postion (xyz)
// n : normal vector (xyz)
// c : color (rgba)
// t : texture postion(st)
// i : index 

// ------------------------------------------------------------------------------------------------
// torus model
function modelTorus(row, column, irad, orad, color){
	var pos = new Array(), nor = new Array(),
	    col = new Array(), st  = new Array(), idx = new Array();
	for(var i = 0; i <= row; i++){
		var r = Math.PI * 2 / row * i;
		var rr = Math.cos(r);
		var ry = Math.sin(r);
		for(var ii = 0; ii <= column; ii++){
			var tr = Math.PI * 2 / column * ii;
			var tx = (rr * irad + orad) * Math.cos(tr);
			var ty = ry * irad;
			var tz = (rr * irad + orad) * Math.sin(tr);
			var rx = rr * Math.cos(tr);
			var rz = rr * Math.sin(tr);
			if(color){
				var tc = color;
			}else{
				tc = hsva2rgba(360 / column * ii, 1, 1, 1);
			}
			var rs = 1 / column * ii;
			var rt = 1 / row * i + 0.5;
			if(rt > 1.0){rt -= 1.0;}
			rt = 1.0 - rt;
			pos.push(tx, ty, tz);
			nor.push(rx, ry, rz);
			col.push(tc[0], tc[1], tc[2], tc[3]);
			st.push(rs, rt);
		}
	}
	for(i = 0; i < row; i++){
		for(ii = 0; ii < column; ii++){
			r = (column + 1) * i + ii;
			idx.push(r, r + column + 1, r + 1);
			idx.push(r + column + 1, r + column + 2, r + 1);
		}
	}
	return {p : pos, n : nor, c : col, t : st, i : idx};
}

// ------------------------------------------------------------------------------------------------
// sphere model
function modelSphere(row, column, rad, color){
	var pos = new Array(), nor = new Array(),
	    col = new Array(), st  = new Array(), idx = new Array();
	for(var i = 0; i <= row; i++){
		var r = Math.PI / row * i;
		var ry = Math.cos(r);
		var rr = Math.sin(r);
		for(var ii = 0; ii <= column; ii++){
			var tr = Math.PI * 2 / column * ii;
			var tx = rr * rad * Math.cos(tr);
			var ty = ry * rad;
			var tz = rr * rad * Math.sin(tr);
			var rx = rr * Math.cos(tr);
			var rz = rr * Math.sin(tr);
			if(color){
				var tc = color;
			}else{
				tc = hsva2rgba(360 / row * i, 1, 1, 1);
			}
			pos.push(tx, ty, tz);
			nor.push(rx, ry, rz);
			col.push(tc[0], tc[1], tc[2], tc[3]);
			st.push(1 - 1 / column * ii, 1 / row * i);
		}
	}
	r = 0;
	for(i = 0; i < row; i++){
		for(ii = 0; ii < column; ii++){
			r = (column + 1) * i + ii;
			idx.push(r, r + 1, r + column + 2);
			idx.push(r, r + column + 2, r + column + 1);
		}
	}
	return {p : pos, n : nor, c : col, t : st, i : idx};
}

// ------------------------------------------------------------------------------------------------
// cube model
function modelCube(side, color){
	var hs = side * 0.5;
	var pos = [
		-hs, -hs,  hs,  hs, -hs,  hs,  hs,  hs,  hs, -hs,  hs,  hs,
		-hs, -hs, -hs, -hs,  hs, -hs,  hs,  hs, -hs,  hs, -hs, -hs,
		-hs,  hs, -hs, -hs,  hs,  hs,  hs,  hs,  hs,  hs,  hs, -hs,
		-hs, -hs, -hs,  hs, -hs, -hs,  hs, -hs,  hs, -hs, -hs,  hs,
		 hs, -hs, -hs,  hs,  hs, -hs,  hs,  hs,  hs,  hs, -hs,  hs,
		-hs, -hs, -hs, -hs, -hs,  hs, -hs,  hs,  hs, -hs,  hs, -hs
	];
	var nor = [
		-1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
		-1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,
		-1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
		 1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,
		-1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0
	];
	var col = new Array();
	for(var i = 0; i < pos.length / 3; i++){
		if(color){
			var tc = color;
		}else{
			tc = hsva2rgba(360 / pos.length / 3 * i, 1, 1, 1);
		}
		col.push(tc[0], tc[1], tc[2], tc[3]);
	}
	var st = [
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
	];
	var idx = [
		 0,  1,  2,  0,  2,  3,
		 4,  5,  6,  4,  6,  7,
		 8,  9, 10,  8, 10, 11,
		12, 13, 14, 12, 14, 15,
		16, 17, 18, 16, 18, 19,
		20, 21, 22, 20, 22, 23
	];
	return {p : pos, n : nor, c : col, t : st, i : idx};
}


//*
// ------------------------------------------------------------------------------------------------
// cylinder model
// x-z palne: circle / y:height 
// column : 分割数
// rad : 円の半径
// height: 高さ
// color :色
//TODO テクスチャ座標
function modelCylinder(column, rad, height, color){
	var pos = new Array(), nor = new Array(),
	    col = new Array(), st  = new Array(), idx = new Array();

	for(var i = 0; i < 2; i++){
		if(i==0) var ty = height*0.5;
		else ty = -1.0*height*0.5;
		
		var ry = 0.0;
		
		for(var ii = 0; ii <= column; ii++){
			var tr = Math.PI * 2 / column * ii;
			var tx = Math.cos(tr)*rad;
			var tz = Math.sin(tr)*rad;
			var rx = Math.cos(tr);
			var rz = Math.sin(tr);
			if(color){
				var tc = color;
			}else{
				tc = hsva(360 / column * ii, 1, 1, 1);
			}
			pos.push(tx, ty, tz);
			nor.push(rx, ry, rz);
			col.push(tc[0], tc[1], tc[2], tc[3]);
//			st.push(1 - 1 / column * ii, (1 - i)*0.5);
		}
	}
	
	if(color){
		var tc = color;
	}else{
		tc = [1.0,1.0,1.0,1.0];
	}
	
	//上面中心
	pos.push(0.0, height*0.5, 0.0);
	nor.push(0.0, 1.0, 0.0);
	col.push(tc[0], tc[1], tc[2], tc[3]);
	
	//下面中心
	pos.push(0.0, -1.0*height*0.5, 0.0);
	nor.push(0.0, -1.0, 0.0);
	col.push(tc[0], tc[1], tc[2], tc[3]);
	

	//側面
	for(j = 0; j < column; j++){
		idx.push(j, j + 1, j + column + 2);
		idx.push(j, j + column + 2, j + column + 1);
	}

	//上面
	r = (column + 1) * 2;
	for(j = 0; j < column; j++){
		idx.push(r, j + 1, j );
	}
	
	//下面中心
	r = (column + 1) * 2 + 1;
	for(j = 0; j < column; j++){
		idx.push(r, (column + 1) + j, (column + 1) + j +1);
	}
	
//	return {p : pos, n : nor, c : col, t : st, i : idx};
	return {p : pos, n : nor, c : col, i : idx};

}
//*/

// ------------------------------------------------------------------------------------------------
// Lego block model
function modelLegoBlock(color){
	var wid = 0.98;
	var cylHight = wid*0.2;
	
	var modelDataCube = modelCube(wid,color);
	var modelDataCylinder = modelCylinder(32,wid/2*0.8,wid*0.5,color);
	
	
	return modelDataMarge(modelDataCube,modelDataCylinder,
	                     [0.0,0.0,0.0],[0.0,(wid+cylHight)/2.0 ,0.0]);
}

// ------------------------------------------------------------------------------------------------
// Lego block model
function modelLegoCylinder(color){
	var wid = 0.98;
	var cylHight = wid*0.2;
	
	var modelDataCylinderBody = modelCylinder(32,wid/2,wid,color);
	var modelDataCylinder = modelCylinder(32,wid/2*0.8,wid*0.5,color);
	
	
	return modelDataMarge(modelDataCylinderBody,modelDataCylinder,
	                     [0.0,0.0,0.0],[0.0,(wid+cylHight)/2.0 ,0.0]);
}




// ------------------------------------------------------------------------------------------------
// model data marge 
// vec3 ofsA 
// vec3 ofsB

function modelDataMarge(modelDataA,modelDataB,ofsA,ofsB){
	var pos = new Array(), nor = new Array(),
	    col = new Array(), st  = new Array(), idx = new Array();

	//console.assert(
		
	var vertexNumA = modelDataA.p.length/3;
	var vertexNumB = modelDataB.p.length/3;

	if(ofsA) var _ofsA = ofsA;
	else _ofsA = [0.0,0.0,0.0];

	if(ofsB) var _ofsB = ofsB;
	else _ofsB = [0.0,0.0,0.0];
	
	for(var i = 0;i<vertexNumA;i++){
		pos.push(modelDataA.p[i*3+0] + _ofsA[0] );
		pos.push(modelDataA.p[i*3+1] + _ofsA[1] );
		pos.push(modelDataA.p[i*3+2] + _ofsA[2] );
	}
	
	for(var i = 0;i<vertexNumB;i++){
		pos.push(modelDataB.p[i*3+0] + _ofsB[0] );
		pos.push(modelDataB.p[i*3+1] + _ofsB[1] );
		pos.push(modelDataB.p[i*3+2] + _ofsB[2] );
	}

	for(var i = 0;i<modelDataA.n.length;i++){
		nor.push(modelDataA.n[i]);
	}

	for(var i = 0;i<modelDataB.n.length;i++){
		nor.push(modelDataB.n[i]);
	}
	
	for(var i = 0;i<modelDataA.c.length;i++){
		col.push(modelDataA.c[i]);
	}

	for(var i = 0;i<modelDataB.c.length;i++){
		col.push(modelDataB.c[i]);
	}
	
	
	for(var i = 0;i<modelDataA.i.length;i++){
		idx.push(modelDataA.i[i]);
	}
	
	for(var i=0;i<modelDataB.i.length;i++){
		idx.push(modelDataB.i[i]+vertexNumA);
	}

	
	return {p : pos, n : nor, c : col, t : st, i : idx};

}



function hsva2rgba(h, s, v, a){
	if(s > 1 || v > 1 || a > 1){return;}
	var th = h % 360;
	var i = Math.floor(th / 60);
	var f = th / 60 - i;
	var m = v * (1 - s);
	var n = v * (1 - s * f);
	var k = v * (1 - s * (1 - f));
	var color = new Array();
	if(!s > 0 && !s < 0){
		color.push(v, v, v, a); 
	} else {
		var r = new Array(v, n, m, m, k, v);
		var g = new Array(k, v, v, n, m, m);
		var b = new Array(m, m, k, v, v, n);
		color.push(r[i], g[i], b[i], a);
	}
	return color;
}
