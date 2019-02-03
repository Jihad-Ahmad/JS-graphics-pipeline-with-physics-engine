var Point2D = function(x1,y1)
{
	this.x = x1;
	this.y = y1;

};


Point2D.prototype.AddToPoint = function(p)
{
	this.x += p.x;
	this.y += p.y;
};



Point2D.prototype.GetCartesianProduct = function(B)
{
	A = this; 
	
	return new Point2D((A.x*B.x),(A.y*B.y));
};




Point2D.prototype.GetLength = function()
{
	f = this.x*this.x+this.y*this.y;
	return Math.sqrt(f);
};


var AffineMatrix2D = function(e0=1, e1=0, e2=0, e3=0, e4=1, e5=0)
{
    this.e0  = e0;
    this.e1  = e1;
    this.e2  = e2;
    this.e3  = e3;
    this.e4  = e4;
    this.e5  = e5;
}


AffineMatrix2D.prototype.makeIdentityAffine = function()
{
return new AffineMatrix2D(
      1, 0, 0,
      0, 1, 0
    );
}

AffineMatrix2D.prototype.multiplyAffine = function(a, b) {
    // Avoid repeated property lookups by accessing into the local frame.
    var a0 = a.e0, a1 = a.e1, a2 = a.e2, a3 = a.e3, a4 = a.e4, a5 = a.e5;
    var b0 = b.e0, b1 = b.e1, b2 = b.e2, b3 = b.e3, b4 = b.e4, b5 = b.e5;

    return new AffineMatrix2D(
	a0*b0 + a1*b3,
	a0*b1 + a1*b4,
	a0*b2 + a1*b5 + a2,
	a3*b0 + a4*b3,
	a3*b1 + a4*b4,
	a3*b2 + a4*b5 + a5
    );
  }

AffineMatrix2D.prototype.makeRotateAffineX = function(theta) {
    var s = Math.sin(theta);
    var c = Math.cos(theta);
    return new AffineMatrix2D(
       c, -s, 0,
       s,  c, 0
    );
}

function test()
{

p1 = new Point2D(0,0);
p2 = new Point2D(3,4);
p3 = new Point2D(1.4,2.4);

txt = p2.GetLength();
alert(txt);

};