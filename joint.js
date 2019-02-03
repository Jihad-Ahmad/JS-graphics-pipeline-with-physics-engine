//has to include math2d & 3d

var JointVectors = function(right_handed = true)
{
	this.abscoords = new CoordSys(right_handed);
	this.relcoords = new CoordSys();

	this.dup = duplicateJointVectors;
	this.delete = deleteJointVectors;
}


var Joint = function(right_handed = true)
{

this.left_hand = !right_handed;

this.motion = new DoublyCircularLinkedList();
this.motion.append(new JointVectors(right_handed));

this.bones = new DoublyCircularLinkedList();
this.followbones = function(/*skele*/)
	{
		this.followed = false;
	
		if(this.bones.count>0){
		this.bones.current.value.followed = false;
		//this.bones.current.value.calLength(skele);
		if(this.bones.cound>1)
			{
				this.bones.pointToNext();
				this.bones.current.value.followed = false;
				//this.bones.current.value.calLength(skele);
			}
		}
	
	}


this.motionstep = 0.1;
this.spinstep = 0.1;

//joint name: ease up finding joints at initialization only
this.jointname = "";
this.index = -1;
this.parent = -1;//index of parent
//array of joint children
this.child = []; 

//array of controlled vertices' indices - returned on rotations or translation for updating
this.controlled = [-1];
//interface
this.addControlled = function(inde){if(!this.controlled){this.controlled = [inde];this.lastVertex = inde;return;}
if(this.controlled[0] == -1){this.controlled[0] = [inde];this.lastVertex = inde;return;} this.controlled[this.controlled.length]=inde;this.lastVertex = inde;}

this.deleteControlled = function(inde)
{
	if(!this.controlled){return;}

	found_i = -1;
	for(i=0;i<this.controlled.length;i++)
	{
		if(this.controlled[i]==inde)
		{
			found_i = i; break;
		}
	}
	if(found_i>=0)
	{
		for(d=found_i;d<this.controlled.length-1;d++)
		{
			this.controlled[d] = this.controlled[d+1];
		}
		delete  this.controlled[this.controlled.length-1];
		this.controlled.length -= 1;

	//delete if exists in any of the measControlled.
	}
	else //not found 
	{
		return;
	}


	};


//interface

this.getAbsXvector = function(){return this.motion.current.value.abscoords.vectors.m.getXvector();};
this.getAbsYvector = function(){return this.motion.current.value.abscoords.vectors.m.getYvector();};
this.getAbsZvector = function(){return this.motion.current.value.abscoords.vectors.m.getZvector();};
this.getAbsPosition = function(){return this.motion.current.value.abscoords.origin;}


this.getRelXvector = function(){return this.motion.current.value.relcoords.vectors.m.getXvector();};
this.getRelYvector = function(){return this.motion.current.value.relcoords.vectors.m.getYvector();};
this.getRelZvector = function(){return this.motion.current.value.relcoords.vectors.m.getZvector();};
this.getRelPosition = function(){return this.motion.current.value.relcoords.origin;};

this.getabscoords = function(){return this.motion.current.value.abscoords.vectors;};
this.getrelcoords = function(){ return this.motion.current.value.relcoords.vectors;};


this.setabscoords = function(X,Y,Z){this.motion.current.value.abscoords.vectors.setDCM(X,Y,Z);};
this.setrelcoords = function(X,Y,Z){this.motion.current.value.relcoords.vectors.setDCM(X,Y,Z);};

this.setAbsPosition = function(x,y,z,w)
{this.motion.current.value.abscoords.origin.x=x;
					this.motion.current.value.abscoords.origin.y=y;
					this.motion.current.value.abscoords.origin.z=z;
					this.motion.current.value.abscoords.origin.w=w;};

this.setRelPosition = function(x,y,z,w){this.motion.current.value.relcoords.origin.x=x;
					this.motion.current.value.relcoords.origin.y=y;
					this.motion.current.value.relcoords.origin.z=z;
					this.motion.current.value.relcoords.origin.w=w;};


//these 14 motion funcs depend only on absolute coords
//but affect rel coords if it has a parent
this.moveFront = MoveJointFront;
this.moveBack = MoveJointBack;
this.moveRight = MoveJointRight;
this.moveLeft = MoveJointLeft;
this.moveUp = MoveJointUp;
this.moveDown = MoveJointDown;
this.moveLinear = MoveJointLinear;

//these depend on both, abs and rel
this.rotateXcw = RotateJointXcw;
this.rotateXac = RotateJointXac;
this.rotateYcw = RotateJointYcw;
this.rotateYac = RotateJointYac;
this.rotateZcw = RotateJointZcw;
this.rotateZac = RotateJointZac;
this.rotateArbitrary = RotateJointU;


this.push = function()
{
temp = this.motion.current.value.dup();
this.motion.append(temp);
this.motion.pointToNext();
};
this.popnext = function(){this.motion.pointToNext();};
this.popprev = function(){this.motion.pointToPrev();};
this.resetmotion = resetJointMotion; 

this.delete = deleteJoint;

this.followed = false;
this.lastVertex = -1;


//for physics
//before_pos = {x:0,y:0,z:0};

}
////////	JOINT VECTORS FUNCTIONS		////////

function duplicateJointVectors()
{

temp2 = new JointVectors();
temp2.abscoords = this.abscoords.dup();
temp2.relcoords = this.relcoords.dup();

return temp2;

}

function deleteJointVectors()
{
	this.abscoords.delete();
	this.relcoords.delete();
}

////////	JOINT FUNCTIONS		////////////////

function deleteJoint()
{
	for(i=0;i<this.motion.count;i++){this.motion.current.value.delete();}
	this.motion.deleteList();delete this.motion;
}

function resetJointMotion()
{
	for(i=0;i<this.motion.count;i++){this.motion.current.value.delete();}
	this.motion.deleteList();
	this.motion.append(new JointVectors());
}

// debug for linear motion, may cause a problem in total skeleton linear motion
// if so the solution is so simple: if lefthanded value is the same as skel root
// move the same as root, else opposite.


function MoveJointFront()
{
	this.motion.current.value.abscoords.origin.MoveLinear(this.getAbsZvector(),this.motionstep);
	//this.followed = false;
	this.followbones();
	//return this.controlled;
}

function MoveJointBack()
{
	this.motion.current.value.abscoords.origin.MoveLinear(this.getAbsZvector(),-this.motionstep);
	//this.followed = false;
	this.followbones();
	//return this.controlled;

}

function MoveJointRight()
{
	this.motion.current.value.abscoords.origin.MoveLinear(this.getAbsXvector(),this.motionstep);
	//this.followed = false;
	this.followbones();
	//return this.controlled;

}
function MoveJointLeft()
{
	this.motion.current.value.abscoords.origin.MoveLinear(this.getAbsXvector(),-this.motionstep);
	//this.followed = false;
	this.followbones();
	//return this.controlled;

}
function MoveJointUp()
{
	this.motion.current.value.abscoords.origin.MoveLinear(this.getAbsYvector(),this.motionstep);
	//this.followed = false;
	this.followbones();
	//return this.controlled;

}
function MoveJointDown()
{
	this.motion.current.value.abscoords.origin.MoveLinear(this.getAbsYvector(),-this.motionstep);
	//this.followed = false;
	this.followbones();
	//return this.controlled;

}

function MoveJointLinear(tx,ty,tz)
{
	ox = this.motion.current.value.abscoords.origin.x;
	oy = this.motion.current.value.abscoords.origin.y;
	oz = this.motion.current.value.abscoords.origin.z;

	MoveLinear({x:ox,y:oy,z:oz}, {x:tx,y:ty,z:tz},this.motionstep);
	this.motion.current.value.abscoords.origin.x = ox;
	this.motion.current.value.abscoords.origin.y = oy;
	this.motion.current.value.abscoords.origin.z = oz;

	//this.motion.current.value.abscoords.origin.MoveLinear({x:tx,y:ty,z:tz},this.motionstep);
	//this.followed = false;

	this.followbones();
	//return this.controlled;

}


function RotateJointXcw()
{
if(this.left_hand==true)
{
	this.motion.current.value.abscoords.vectors.rotateU(-this.spinstep,this.getAbsXvector());
}
else
{
	this.motion.current.value.abscoords.vectors.rotateU(this.spinstep,this.getAbsXvector());
}

	//this.followed = false;
	this.followbones();
	//return this.controlled;

}

function RotateJointXac()
{
if(this.left_hand==true)
{
	this.motion.current.value.abscoords.vectors.rotateU(this.spinstep,this.getAbsXvector());
}
else
{
	this.motion.current.value.abscoords.vectors.rotateU(-this.spinstep,this.getAbsXvector());
}
	//this.followed = false;
	this.followbones();
	//return this.controlled;

}

function  RotateJointYcw()
{

if(this.left_hand==true)
{
	this.motion.current.value.abscoords.vectors.rotateU(this.spinstep,this.getAbsYvector());
}
else
{
	this.motion.current.value.abscoords.vectors.rotateU(-this.spinstep,this.getAbsYvector());
}
	//this.followed = false;
	this.followbones();
	//return this.controlled;


}

function RotateJointYac()
{

if(this.left_hand==true)
{
	this.motion.current.value.abscoords.vectors.rotateU(-this.spinstep,this.getAbsYvector());
}
else
{
	this.motion.current.value.abscoords.vectors.rotateU(this.spinstep,this.getAbsYvector());
}
	//this.followed = false;
	this.followbones();
	//return this.controlled;

}

function RotateJointZcw()
{

if(this.left_hand==true)
{
	this.motion.current.value.abscoords.vectors.rotateU(this.spinstep,this.getAbsZvector());
}
else
{
	this.motion.current.value.abscoords.vectors.rotateU(-this.spinstep,this.getAbsZvector());
}
	//this.followed = false;
	this.followbones();
	//return this.controlled;

}

function RotateJointZac()
{

if(this.left_hand==true)
{
	this.motion.current.value.abscoords.vectors.rotateU(-this.spinstep,this.getAbsZvector());
}
else
{
	this.motion.current.value.abscoords.vectors.rotateU(this.spinstep,this.getAbsZvector());
}
	//this.followed = false;
	this.followbones();
	//return this.controlled;

}

function  RotateJointU(U)
{

if(this.left_hand==true)
{
	this.motion.current.value.abscoords.vectors.rotateU(-this.spinstep,U);
}
else
{
	this.motion.current.value.abscoords.vectors.rotateU(this.spinstep,U);
}
	//this.followed = false;
	this.followbones();
	//return this.controlled;


}



//testing: 
/*
test it just like smartcamera

draw it as an object with its directions
then test linear motion and rotations
then test pushing and poping, saving motion

then apply the skeleton (make it general)
        
*/