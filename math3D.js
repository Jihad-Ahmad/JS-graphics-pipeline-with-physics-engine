
/*
there are some functions done in pre3D
that is not done here

still don't know what he is doing with them completely

1- averaging points: for centroid of a quad
2- pushing points far by 2 : technically i did it with slight diff: GetPointOnVector_v2
so i can call it twice, but why he did it that way?

*/


var Point3D = function(x1, y1, z1,w1=0) {
    this.x = x1;
    this.y = y1;
    this.z = z1;
    this.w = w1;


};




Point3D.prototype.checkEquals = function(value)
{
	return (
		((this.x == value.x))&&
		((this.y == value.y))&&
		((this.z == value.z))
//		((this.w == value.w))
				);
};


Point3D.prototype.AddToPoint = function(x1, y1, z1) {
    this.x += x1;
    this.y += y1;
    this.z += z1;

};


Point3D.prototype.CrossProduct = function(p) {
    rx = this.y * p.z - this.z * p.y;
    ry = this.z * p.x - this.x * p.z;
    rz = this.x * p.y - this.y * p.x;

/*
    var result = new Point3D(rx, ry, rz);

    return result;
*/


 return {x:rx,y:ry,z:rz};

};


Point3D.prototype.GetPointOnVector_v2 = function(directionV, lengthmag) {

    from = this;
    new_x = (directionV.x * lengthmag) + from.x;
    new_y = (directionV.y * lengthmag) + from.y;
    new_z = (directionV.z * lengthmag) + from.z;

/*
    p = new Point3D(new_x, new_y, new_z);

    return p;
*/


 return {x:new_x,y:new_y,z:new_z};

}


Point3D.prototype.GetPointOnVector = function(directionVector) {

/*
    p = new Point3D(this.x + directionVector.x,
        this.y + directionVector.y,
        this.z + directionVector.z);

    return p;
*/


 return {x:(this.x + directionVector.x),
	y:(this.y + directionVector.y),
	z:(this.z + directionVector.z)};

}




Point3D.prototype.GetVector = function(to) {
    from = this;
/*
    vector = new Point3D(to.x - from.x, to.y - from.y, to.z - from.z);
    return vector;
*/

 return {x:(to.x - from.x),
	y:(to.y - from.y),
	z:(to.z - from.z)};

}

//square length
Point3D.prototype.SquareDiff = function(p2){

	vector = this.GetVector(p2);
	return vector.GetDotProduct(vector);
}


Point3D.prototype.GetAbsolute = function(relVec, alfa, beta, gamma) {

/*
    abs = new Point3D(relVec.x * alfa.x + relVec.y * beta.x + relVec.z * gamma.x,
        relVec.x * alfa.y + relVec.y * beta.y + relVec.z * gamma.y,
        relVec.x * alfa.z + relVec.y * beta.z + relVec.z * gamma.z);
    return abs;
*/


 return {x:(relVec.x * alfa.x + relVec.y * beta.x + relVec.z * gamma.x),
	y:(relVec.x * alfa.y + relVec.y * beta.y + relVec.z * gamma.y),
	z:(relVec.x * alfa.z + relVec.y * beta.z + relVec.z * gamma.z)};


}




Point3D.prototype.GetDotProduct = function(B) {
    A = this;

    return ((A.x * B.x) + (A.y * B.y) + (A.z * B.z));
};

function GetDotProduct(A,B)
{
	return ((A.x * B.x) + (A.y * B.y) + (A.z * B.z));
}


Point3D.prototype.GetLength = function() {
    f = this.GetDotProduct(this);
    return Math.sqrt(f);
};

function GetLength(A)
{
	return Math.sqrt(((A.x * A.x) + (A.y * A.y) + (A.z * A.z)));
}


Point3D.prototype.MoveLinear = function(directVector, motionStep) {

    this.x += directVector.x * motionStep;
    this.y += directVector.y * motionStep;
    this.z += directVector.z * motionStep;

};

function MoveLinear(point3d, directVector, motionStep)
{
	return {
		x:(point3d.x+(directVector.x * motionStep)),
		y:(point3d.y+(directVector.y * motionStep)),
		z:(point3d.z+(directVector.z * motionStep))
		};
}


Point3D.prototype.NormalizeVector = function() {

    length1 = this.GetLength();
    if (length1 == 0) {

        this.x = 0;
        this.y = 0;
        this.z = 0;

    }

    factor = 1/length1;
    this.x *= factor;
    this.y *= factor;
    this.z *= factor;


};

function NormalizeVector(p)
{
	
    length1 = GetLength(p);
    if (length1 == 0) {

	return {x:0,y:0,z:0};
/*
        this.x = 0;
        this.y = 0;
        this.z = 0;
*/

    }

    factor = 1/length1;
/*
    this.x *= factor;
    this.y *= factor;
    this.z *= factor;
*/

   return {x:p.x*factor,y:p.y*factor,z:p.z*factor};


}

/*
Point3D.prototype.pointTimes = function(f, p) {
    this.x *= f;
    this.y *= f;
    this.z *= f;
}
*/

Point3D.prototype.Multiply = function(f) {
    this.x *= f;
    this.y *= f;
    this.z *= f;
}


Point3D.prototype.GetAbsoluteDirection = function(relativeVector, alfa, beta, gamma) {

/*
    abs_vector = new Point3D(relativeVector.x * alfa.x + relativeVector.y * beta.x + relativeVector.z * gamma.x,
        relativeVector.x * alfa.y + relativeVector.y * beta.y + relativeVector.z * gamma.y,
        relativeVector.x * alfa.z + relativeVector.y * beta.z + relativeVector.z * gamma.z);

    return abs_vector;

*/


 return {x:(relativeVector.x * alfa.x + relativeVector.y * beta.x + relativeVector.z * gamma.x),
	y:(relativeVector.x * alfa.y + relativeVector.y * beta.y + relativeVector.z * gamma.y),
	z:(relativeVector.x * alfa.z + relativeVector.y * beta.z + relativeVector.z * gamma.z)};

}



Point3D.prototype.Intersection = function(p1, v1, p2, v2) {
    /*
    	coef1 = 0.0;
    	coef2 = 0.0;

    	coefs_ratio = 0.0; // coef2/coef1
    			
    	p1.x+ v1.x * coef1 = p2.x + v2.x * coef2; // this.x;
    	p1.x+ v1.x * coef1 = p2.x + v2.x * coef2; // this.y;
    	p1.x+ v1.x * coef1 = p2.x + v2.x * coef2; // this.z;


    	coef1 = )p2.x + v2.x * coef2 - p1.x)/v1.x;
    */
}


var Plan3D = function(n, p) {
    this.normal = new Point3D(n.x, n.y, n.z);
    this.normal.NormalizeVector();
    this.point = new Point3D(p.x, p.y, p.z);

}

Plan3D.prototype.Delete = function() {
    delete this.normal;
    delete this.point;
}

Plan3D.prototype.IsPointOnPlan = function(p) {

    //given 3d point to check if it is on the plan
    // 0 if on the plan
    // +ve value if in normal direction out of the plan
    // -ve value if in the opposite direction

    pointOnNormal = this.point.GetPointOnVector_v2(this.normal, 1);//if frustum is polar it will be much cheaper 
    pnVector = new Point3D(pointOnNormal.x - this.point.x, pointOnNormal.y - this.point.y, pointOnNormal.z - this.point.z);
    ppVector = new Point3D(p.x - this.point.x, p.y - this.point.y, p.z - this.point.z);

    result = ppVector.GetDotProduct(pnVector);
    //this.normal.NormalizeVector();
    delete pnVector;
    delete ppVector;

    return result;
 
}

Plan3D.prototype.LineFindIntersection = function(start, end, distances) {

    distances = [0];
    line = new Point3D(end.x - start.x, end.y - start.y, end.z - start.z);
    len = line.GetLength();
    line.NormalizeVector();
    this.normal.NormalizeVector();


    if (((distances[0] = this.IsPointOnPlan(start) <= 0) && (distances[1] = this.IsPointOnPlan(end) <= 0)) ||
        ((distances[0] = this.IsPointOnPlan(start) > 0) && (distances[1] = this.IsPointOnPlan(end) > 0))
    ) {
        return 0;
    }


    if (((distances[0] = this.IsPointOnPlan(start)) <= 0) &&
        ((distances[1] = this.IsPointOnPlan(end)) > 0)) {
        t = Math.abs(distances[0]) / (Math.abs(distances[0]) + Math.abs(distances[1]));
        p = start.GetPointOnVector_v2(line, t * len);
        return p;
    }

    if (((distances[0] = this.IsPointOnPlan(start)) > 0) &&
        ((distances[1] = this.IsPointOnPlan(end)) <= 0)) {
        t = Math.abs(distances[0]) / (Math.abs(distances[0]) + Math.abs(distances[1]));
        p = start.GetPointOnVector_v2(line, t * len);
        return p;

    }

    return 0;

}

Plan3D.prototype.PlanFindIntersection = function(plan) {

}

//  e0  e1  e2 | e3
//  e4  e5  e6 | e7
//  e8  e9  e10| e11
// -----------------
//  0   0   0  | 1

var AffineMatrix3D = function(e0=1, e1=0, e2=0, e3=0, e4=0, e5=1, e6=0, e7=0, e8=0, e9=0, e10=1, e11=0)
{
    this.e0  = e0;
    this.e1  = e1;
    this.e2  = e2;
    this.e3  = e3;
    this.e4  = e4;
    this.e5  = e5;
    this.e6  = e6;
    this.e7  = e7;
    this.e8  = e8;
    this.e9  = e9;
    this.e10 = e10;
    this.e11 = e11;
    this.e12 = 0;
    this.e13 = 0;
    this.e14 = 0;
    this.e15 = 1;

}

AffineMatrix3D.prototype.getXvector = function()
{
	//return new Point3D(this.e0,this.e4,this.e8,this.e12);
	return {x:this.e0,y:this.e4,z:this.e8,w:this.e12};
}

AffineMatrix3D.prototype.getYvector = function()
{
	//return new Point3D(this.e1,this.e5,this.e9,this.e13);
	  return {x:this.e1,y:this.e5,z:this.e9,w:this.e13};
}

AffineMatrix3D.prototype.getZvector = function()
{
	//return new Point3D(this.e2,this.e6,this.e10,this.e14);
	return {x:this.e2,y:this.e6,z:this.e10,w:this.e14};
}

AffineMatrix3D.prototype.setXvector = function(x,y,z,w)
{
	this.e0=x;this.e4=y;this.e8=z;this.e12=w;
}

AffineMatrix3D.prototype.setYvector = function(x,y,z,w)
{
	this.e1=x;this.e5=y;this.e9=z;this.e13=w;
}

AffineMatrix3D.prototype.setZvector = function(x,y,z,w)
{
	this.e2=x;this.e6=y;this.e10=z;this.e14=w;
}





AffineMatrix3D.prototype.makeIdentityAffine = function()
{
return new AffineMatrix3D(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0
    );
}

AffineMatrix3D.prototype.multiplyAffine = function(a, b) {
    // Avoid repeated property lookups by accessing into the local frame.
    var a0 = a.e0, a1 = a.e1, a2 = a.e2, a3 = a.e3, a4 = a.e4, a5 = a.e5;
    var a6 = a.e6, a7 = a.e7, a8 = a.e8, a9 = a.e9, a10 = a.e10, a11 = a.e11;
    var b0 = b.e0, b1 = b.e1, b2 = b.e2, b3 = b.e3, b4 = b.e4, b5 = b.e5;
    var b6 = b.e6, b7 = b.e7, b8 = b.e8, b9 = b.e9, b10 = b.e10, b11 = b.e11;

    return new AffineMatrix3D(
      a0 * b0 + a1 * b4 + a2  * b8,
      a0 * b1 + a1 * b5 + a2  * b9,
      a0 * b2 + a1 * b6 + a2  * b10,
      a0 * b3 + a1 * b7 + a2  * b11 + a3,
      a4 * b0 + a5 * b4 + a6  * b8,
      a4 * b1 + a5 * b5 + a6  * b9,
      a4 * b2 + a5 * b6 + a6  * b10,
      a4 * b3 + a5 * b7 + a6  * b11 + a7,
      a8 * b0 + a9 * b4 + a10 * b8,
      a8 * b1 + a9 * b5 + a10 * b9,
      a8 * b2 + a9 * b6 + a10 * b10,
      a8 * b3 + a9 * b7 + a10 * b11 + a11
    );
  }


AffineMatrix3D.prototype.transformPoint = function(t, p)
{
	tempx = t.e0 * p.x + t.e1 * p.y + t.e2  * p.z + t.e3;
	tempy = t.e4 * p.x + t.e5 * p.y + t.e6  * p.z + t.e7;
	tempz = t.e8 * p.x + t.e9 * p.y + t.e10 * p.z + t.e11;
	tempw = t.e12 * p.x + t.e13 * p.y + t.e14 * p.z + t.e15;

	p.x = tempx;
	p.y = tempy;
	p.z = tempz; 
	p.w = tempw;			  

	return {x:tempx,y:tempy,z:tempz,w:tempw};

}


// Transform and return a new array of points with transform matrix |t|.
AffineMatrix3D.prototype.transformPoints = function(t, ps) {
    var il = ps.length;
    var out = Array(il);
    for (var i = 0; i < il; ++i) {
      out[i] = transformPoint(t, ps[i]);
    }
    return out;
  }


AffineMatrix3D.prototype.makeTranslateAffine = function(tx,ty,tz) {
    return new AffineMatrix3D(
      1, 0,  0, tx,
      0, 1,  0, ty,
      0, 0,  1, tz
    );
}

AffineMatrix3D.prototype.makeScaleAffine = function(dx,dy,dz) {
    return new AffineMatrix3D(
      dx, 0,  0, 0,
      0,  dy, 0, 0,
      0,  0,  dz, 0
    );
}



//rotates around arbitrary vector by theta, rotation is through origin
AffineMatrix3D.prototype.makeRotateAffineU = function(theta,U) {
    var s = Math.sin(theta);
    var c = Math.cos(theta);
    var i_c = 1 - c;

    temp = new AffineMatrix3D(
		1+ i_c * (-U.z*U.z - U.y*U.y),
		U.z*s  + i_c*U.x * U.y,
		-U.y*s + i_c*U.x * U.z,
		0,
		-U.z*s + i_c*U.x * U.y,
		1 + i_c* ( -U.z*U.z - U.x*U.x),
		U.x*s +  i_c* U.z * U.y,
		0,
		U.y*s + i_c* U.x * U.z,
		-U.x*s + i_c* U.z * U.y,
		1 + i_c*(-U.x*U.x - U.y*U.y),
		0);
	delete U;
	return temp;

}


AffineMatrix3D.prototype.dupAffine = function() {
    return new AffineMatrix3D(
        this.e0, this.e1, this.e2, this.e3,
        this.e4, this.e5, this.e6, this.e7,
        this.e8, this.e9, this.e10, this.e11);
}


AffineMatrix3D.prototype.transAdjoint =  function() {
    var a0 = this.e0, a1 = this.e1, a2 = this.e2, a4 = this.e4, a5 = this.e5;
    var a6 = this.e6, a8 = this.e8, a9 = this.e9, a10 = this.e10;
    return new AffineMatrix3D(
      a10 * a5 - a6 * a9,
      a6 * a8 - a4 * a10,
      a4 * a9 - a8 * a5,
      0,
      a2 * a9 - a10 * a1,
      a10 * a0 - a2 * a8,
      a8 * a1 - a0 * a9,
      0,
      a6 * a1 - a2 * a5,
      a4 * a2 - a6 * a0,
      a0 * a5 - a4 * a1,
      0
    );
  }

AffineMatrix3D.prototype.toString = function()
{ 
    txt = " ";
    txt += this.e0+", ";
    txt += this.e1+", ";
    txt += this.e2+", ";
    txt += this.e3+", ";
    txt += this.e4+", ";
    txt += this.e5+", ";
    txt += this.e6+", ";
    txt += this.e7+", ";
    txt += this.e8+", ";
    txt += this.e9+", ";
    txt += this.e10+", ";
    txt += this.e11+", ";
    txt += this.e12+", ";
    txt += this.e13+", ";
    txt += this.e14+", ";
    txt += this.e15+", ";

    return txt;

}

AffineMatrix3D.prototype.transpose = function(m)
{
	return new AffineMatrix3D(
	m.e0, m.e4, m.e8, 0,
	m.e1, m.e5, m.e9, 0,
	m.e2, m.e6, m.e10,1
);
}



//i might need reflect Affine, and shear affine and their 
//encapsulation functions in Transform

var Transform = function()
{
	this.reset();
}

Transform.prototype.reset = function() {
    if(this.m){delete this.m;}
    this.m = new AffineMatrix3D();
};

Transform.prototype.transpose = function()
{
	temp = this.m.transpose(this.m);
	delete this.m;
	this.m = temp;
}

Transform.prototype.rotateU = function(theta,U) {

    this.m =
        this.m.multiplyAffine(this.m.makeRotateAffineU(theta,U), this.m);
};

Transform.prototype.rotateUPre = function(theta) {

    this.m =
        this.m.multiplyAffine(this.m,this.m.makeRotateAffineU(theta,U));
};


Transform.prototype.translate = function(dx, dy, dz) {
    this.m =
        this.m.multiplyAffine(this.m.makeTranslateAffine(dx, dy, dz), this.m);
  };
  Transform.prototype.translatePre = function(dx, dy, dz) {
    this.m =
        this.m.multiplyAffine(this.m, this.m.makeTranslateAffine(dx, dy, dz));
  };

  Transform.prototype.scale = function(sx, sy, sz) {
    this.m =
        this.m.multiplyAffine(this.m.makeScaleAffine(sx, sy, sz), this.m);
  };

  Transform.prototype.scalePre = function(sx, sy, sz) {
    this.m =
        this.m.multiplyAffine(this.m, this.m.makeScaleAffine(sx, sy, sz));
  };


Transform.prototype.transformPoint = function(p) {
    return this.m.transformPoint(this.m, p);
  };


Transform.prototype.transformPoints = function(ps) {
    return this.m.transformPoints(this.m, ps);
  };


Transform.prototype.multTransform = function(t) {
    this.m = this.m.multiplyAffine(this.m, t.m);

};

//define column matrix of vectors u,v,w
//R = setDCM(right,up,front)
Transform.prototype.setDCM = function(u, v, w) {
    var m = this.m;
    m.e0 = u.x; m.e4 = u.y; m.e8 = u.z;
    m.e1 = v.x; m.e5 = v.y; m.e9 = v.z;
    m.e2 = w.x; m.e6 = w.y; m.e10 = w.z;
  };

//define row matrix of vectors u,v,w
//Rt = setDRM(right,up,front)
Transform.prototype.setDRM = function(u, v, w) {
    var m = this.m;
    m.e0 = u.x; m.e1 = u.y; m.e2 = u.z;
    m.e4 = v.x; m.e5 = v.y; m.e6 = v.z;
    m.e8 = w.x; m.e9 = w.y; m.e10 = w.z;
  };


Transform.prototype.dup = function() {
    var tm = new Transform();
    tm.m = this.m.dupAffine(this.m);
    return tm;

 };

var CoordSys = function(right_handed = true)
{
    this.origin = new Point3D(0,0,0,0);
    this.vectors = new Transform();

    if(!right_handed)
    {
	//get X vector
	temp = this.vectors.m.getXvector();
	//multiply by -1; set it back
	this.vectors.m.setXvector(temp.x*-1,temp.y*-1,temp.z*-1,temp.w*-1);

	//free memory now
	delete temp;
    }
    //interface
    this.howto = printCoordSysUsage;
    this.delete = deleteCoordSys;
    this.dup = duplicateCoordSys;
    
}


////////	COORD SYS FUNCTIONS	////////////////

function deleteCoordSys()
{delete this.vectors;}

function printCoordSysUsage()
{
	txt = "CoordSys class consists of origin object carries {x,y,z,w}<br/>";
	txt += "& Transformation object, to be able to move rotate make projection.. etc<br/>";
	txt += "about how to use: it is best that the object that owns this coordSys, define its usage functions and<br/>";
	txt += "its best ways to use matrices operations I have <br/>";
	txt += "To look at those, print usage of Transform() class<br/>";
	txt += "the values, for origin:{x:"+this.origin.x+",y:,z:,w:}<br/>";

	return txt;
}

function duplicateCoordSys()
{
	temp = new CoordSys();
	temp.origin.x = this.origin.x;
	temp.origin.y = this.origin.y;
	temp.origin.z = this.origin.z;
	temp.origin.w = this.origin.w;
	delete temp.vectors;
	temp.vectors = this.vectors.dup();

	return temp;
}

/////////////////////////////////
function test() {

    p1 = new Point3D(0, 0, 0);
    p2 = new Point3D(0, 1, 0);
    p3 = new Point3D(1.4, 2.4, 3.4);

    txt = "point b4 moving: (" + p1.x + "," + p1.y + "," + p1.z + ") and after moving: ";

    p3.MoveLinear(p2, 2);
    txt += "(" + p3.x + "," + p3.y + "," + p3.z + "). ";
    alert(txt);
};


var Quaternion = function(w=0,i=0,j=0,k=0)
{
	this.w = w;
	this.i = i;
	this.j = j;
	this.k = k;

};

Quaternion.prototype.add2Qs = function(q1,q2)
{
	this.w = q1.w + q2.w;
	this.i = q1.i + q2.i;
	this.j = q1.j + q2.j;
	this.k = q1.k + q2.k;

	return this;
}

Quaternion.prototype.sub2Qs = function(q1,q2)
{
	this.w = q1.w - q2.w;
	this.i = q1.i - q2.i;
	this.j = q1.j - q2.j;
	this.k = q1.k - q2.k;

	return this;
}

Quaternion.prototype.multiply2Qs = function(q1,q2)
{
	this.w = q1.w * q2.w - q1.i * q2.i - q1.j * q2.j - q1.k * q2.k;
	this.i = q1.w * q2.i + q1.i * q2.w + q1.j * q2.k - q1.k * q2.j;
	this.j = q1.w * q2.j - q1.i * q2.k + q1.j * q2.w + q1.k * q2.i;
	this.k = q1.w * q2.k + q1.i * q2.j - q1.j * q2.i + q1.k * q2.w;

	return this;
}

Quaternion.prototype.getConj = function(q)
{
	this.w = q.w;
	this.i = -q.i;
	this.j = -q.j;
	this.k = -q.k;

	return this;
}

Quaternion.prototype.getNorm = function(q)
{
	return (q.w*q.w + q.i*q.i + q.j*q.j + q.k*q.k);
}


Quaternion.prototype.getMultInv = function(q)
{
	return (q.getConj(q)/q.getNorm(q));
}

