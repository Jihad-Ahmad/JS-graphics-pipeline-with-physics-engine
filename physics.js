/*

LIMITATION: - in many balls2 the impulse of ball room collision
		is mass of 1 ball * velocity of it, but
		when they are all stand on each other,
		mass must be calculated by them all, not 
		mass of 1 ball!, in reality this happens
		how would this apply here ? it is an error
		if physics engime would be complete but
		not important for cloth simulation prog
		i guess................................XXXX

*/


//obj = {pos:{x,y,z}}
var Spring = function(obj1=0,obj2=0,k=0,minx=0,maxx=0)
{
	this.obj1 = obj1;
	this.obj2 = obj2;
	this.k = k;
	this.minx = minx;//scalar values
	this.maxx = maxx;

	this.getForceOnObj1 = getForceOnObj1;
	this.getForceOnObj2 = getForceOnObj2;

	//given 2 objects and k, returns the force that applies on [obj1,obj2]
	//according to its k
	this.getForceGeneral = getForceGeneral;
};

function getForceOnObj1()
{
	//get rel position vector not normalized of obj1 with respect to obj2
	// and the oposite (just -ve the x,y,z)

	// -ve X
	vec1 = {x: this.obj2.pos.x - this.obj1.pos.x,
	     y: this.obj2.pos.y - this.obj1.pos.y,
	     z: this.obj2.pos.z - this.obj1.pos.z};

	force1 = {x: this.k*vec1.x, y: this.k*vec1.y,z: this.k*vec1.z};
	return force1;
}


function getForceOnObj2()
{
	//get rel position vector not normalized of obj1 with respect to obj2
	// and the oposite (just -ve the x,y,z)

	// -ve X
	vec1 = {x: this.obj1.pos.x - this.obj2.pos.x,
	     y: this.obj1.pos.y - this.obj2.pos.y,
	     z: this.obj1.pos.z - this.obj2.pos.z};

	relocate = false;
	dist = Math.sqrt(vec1.x*vec1.x + vec1.y *vec1.y + vec1.z*vec1.z);

	if(dist < this.minx)
	{
		diff = this.minx - dist;
		relocate = true;

		//return 
		if(dist == 0){dist  = 1;}
		vec1.x/=dist;
		vec1.y/=dist;
		vec1.z/=dist;

		//relocate obj1 and update vec1
		this.obj1.pos.x += diff * vec1.x;
		this.obj1.pos.y += diff * vec1.y;
		this.obj1.pos.z += diff * vec1.z;

		vec1.x *=this.minx;
		vec1.y *=this.minx;
		vec1.z *=this.minx;
 
	}


	if(dist < this.maxx)
	{
		diff = this.maxx - dist;
		relocate = true;

		//return 
		if(dist == 0){dist  = 1;}
		vec1.x/=dist;
		vec1.y/=dist;
		vec1.z/=dist;

		//relocate obj1 and update vec1
		this.obj1.pos.x -= diff * vec1.x;
		this.obj1.pos.y -= diff * vec1.y;
		this.obj1.pos.z -= diff * vec1.z;

		vec1.x *=this.maxx;
		vec1.y *=this.maxx;
		vec1.z *=this.maxx;
 
	}


	force1 = {x: this.k*vec1.x, y: this.k*vec1.y,z: this.k*vec1.z};
	return force1;

}


//obj1 = {pos:{x,y,z}}
//according to hooke's law, F = -kx;
function getForceGeneral(obj1,obj2,k,minx,maxx)
{
	//get rel position vector not normalized of obj1 with respect to obj2
	// and the oposite (just -ve the x,y,z)

	vec1 = {x: obj1.pos.x - obj2.pos.x,
	     y:obj1.pos.y - obj2.pos.y,
	     z:obj1.pos.z - obj2.pos.z};

	relocate = false;

	dist = Math.sqrt(vec1.x*vec1.x + vec1.y *vec1.y + vec1.z*vec1.z);

	//normalize
	if(dist == 0){dist  = 1;}
	vec1.x/=dist;
	vec1.y/=dist;
	vec1.z/=dist;

	if(dist < minx)
	{
		diff = minx - dist;
		relocate = true;

		//relocate obj1 and update vec1
		obj1.pos.x += .5* diff * vec1.x;
		obj1.pos.y += .5* diff * vec1.y;
		obj1.pos.z += .5* diff * vec1.z;

		obj2.pos.x -= .5* diff * vec1.x;
		obj2.pos.y -= .5* diff * vec1.y;
		obj2.pos.z -= .5* diff * vec1.z;

		/*
		vec1.x *=minx;
		vec1.y *=minx;
		vec1.z *=minx;
		*/

		dist = minx;
	}

	if(dist > maxx)
	{
		diff = dist - maxx ;
		relocate = true;

		obj1.pos.x -= .5* diff * vec1.x;
		obj1.pos.y -= .5* diff * vec1.y;
		obj1.pos.z -= .5* diff * vec1.z;

		obj2.pos.x += .5* diff * vec1.x;
		obj2.pos.y += .5* diff * vec1.y;
		obj2.pos.z += .5* diff * vec1.z;

		/*
		vec1.x *=maxx;
		vec1.y *=maxx;
		vec1.z *=maxx;
		*/

		dist = maxx;
	}
	
	avg = (minx + maxx)*.5;//inertia position at which force is zero
	deltaX = dist - avg;

	// this is the right one
	force1 = {x: -k*deltaX*(vec1.x), y: -k*deltaX*(vec1.y), z: -k*deltaX*(vec1.z)};

	/*
		vec1.x *=dist;
		vec1.y *=dist;
		vec1.z *=dist;

	force3 = {x: -k*(vec1.x-avg), y: -k*(vec1.y-avg), z: -k*(vec1.z-avg)};
	

	console.log("2 forces computed differently but i think must have same value");
	console.log("force A  (-k.delta.normalized_vector) = ("+force1.x+","+force1.y+","+force1.z+")");
	console.log("force B  (-k.vector.x-ave,..etc)      = ("+force3.x+","+force3.y+","+force3.z+")");
	*/

	force2 = {x: -force1.x, y: -force1.y, z: -force1.z};

	return[relocate,force1,force2,obj1,obj2];

}



//obj1 = {pos:{x,y,z}}
//according to hooke's law, F = -kx;
function getForceGeneralPinned(obj1,obj2,k,minx,maxx)
{
	//get rel position vector not normalized of obj1 with respect to obj2
	// and the oposite (just -ve the x,y,z)

	vec1 = {x: obj1.pos.x - obj2.pos.x,
	     y:obj1.pos.y - obj2.pos.y,
	     z:obj1.pos.z - obj2.pos.z};

	relocate = false;

	dist = Math.sqrt(vec1.x*vec1.x + vec1.y *vec1.y + vec1.z*vec1.z);

	//normalize
	if(dist == 0){dist  = 1;}
	vec1.x/=dist;
	vec1.y/=dist;
	vec1.z/=dist;

	if(dist < minx)
	{
		diff = minx - dist;
		relocate = true;

		obj2.pos.x -=  diff * vec1.x;
		obj2.pos.y -=  diff * vec1.y;
		obj2.pos.z -=  diff * vec1.z;

		/*
		vec1.x *=minx;
		vec1.y *=minx;
		vec1.z *=minx;
		*/

		dist = minx;
	}

	if(dist > maxx)
	{
		diff = dist - maxx ;
		relocate = true;

		obj2.pos.x +=  diff * vec1.x;
		obj2.pos.y +=  diff * vec1.y;
		obj2.pos.z +=  diff * vec1.z;

		/*
		vec1.x *=maxx;
		vec1.y *=maxx;
		vec1.z *=maxx;
		*/

		dist = maxx;
	}
	
	avg = (minx + maxx)*.5;//inertia position at which force is zero
	deltaX = dist - avg;

	// this is the right one
	force1 = {x: -k*deltaX*(vec1.x), y: -k*deltaX*(vec1.y), z: -k*deltaX*(vec1.z)};

	/*
		vec1.x *=dist;
		vec1.y *=dist;
		vec1.z *=dist;

	force3 = {x: -k*(vec1.x-avg), y: -k*(vec1.y-avg), z: -k*(vec1.z-avg)};
	

	console.log("2 forces computed differently but i think must have same value");
	console.log("force A  (-k.delta.normalized_vector) = ("+force1.x+","+force1.y+","+force1.z+")");
	console.log("force B  (-k.vector.x-ave,..etc)      = ("+force3.x+","+force3.y+","+force3.z+")");
	*/

	force2 = {x: -force1.x, y: -force1.y, z: -force1.z};

	return[relocate,{x:0,y:0,z:0},force2,obj1,obj2];

}

var ClothSpring = function(vi1,vi2,k,minx,maxx)
{
	this.vi1 = vi1;
	this.vi2 = vi2;
	this.k = k;
	this.minx = minx;//scalar values
	this.maxx = maxx;

	this.getClothSpringForce = getClothSpringForce;
	this.updateSpringProps = updateSpringProps;
};


function getClothSpringForce(array_of_vertices)
{
	//get rel position vector not normalized of obj1 with respect to obj2
	// and the oposite (just -ve the x,y,z)

	obj1 = array_of_vertices[this.vi1].abscoords.origin;
	obj2 = array_of_vertices[this.vi2].abscoords.origin;

	vec1 = {x: obj1.x - obj2.x,
	     y:obj1.y - obj2.y,
	     z:obj1.z - obj2.z};

	relocate = false;

	dist = Math.sqrt(vec1.x*vec1.x + vec1.y *vec1.y + vec1.z*vec1.z);

	//normalize
	if(dist == 0){dist  = 1;}
	vec1.x/=dist;
	vec1.y/=dist;
	vec1.z/=dist;

	if(dist < this.minx)
	{
		diff = this.minx - dist;
		relocate = true;

		//relocate obj1 and update vec1
		obj1.x += .5* diff * vec1.x;
		obj1.y += .5* diff * vec1.y;
		obj1.z += .5* diff * vec1.z;

		obj2.x -= .5* diff * vec1.x;
		obj2.y -= .5* diff * vec1.y;
		obj2.z -= .5* diff * vec1.z;

		dist = this.minx;
	}

	if(dist > this.maxx)
	{
		diff = dist - this.maxx ;
		relocate = true;

		obj1.x -= .5* diff * vec1.x;
		obj1.y -= .5* diff * vec1.y;
		obj1.z -= .5* diff * vec1.z;

		obj2.x += .5* diff * vec1.x;
		obj2.y += .5* diff * vec1.y;
		obj2.z += .5* diff * vec1.z;

		dist = this.maxx;
	}
	
	avg = (this.minx + this.maxx)*.5;//inertia position at which force is zero
	deltaX = dist - avg;

	// this is the right one
	force1 = {x: -this.k*deltaX*(vec1.x), y: -this.k*deltaX*(vec1.y), z: -this.k*deltaX*(vec1.z)};
	force2 = {x: -force1.x, y: -force1.y, z: -force1.z};

	return[relocate,force1,force2,obj1,obj2];

}

function updateSpringProps(k,minx,maxx)
{
	this.k = k;
	this.minx = minx;//scalar values
	this.maxx = maxx;

}
