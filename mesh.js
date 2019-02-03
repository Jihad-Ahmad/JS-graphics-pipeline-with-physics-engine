var VertexJointsPolynomial = function(joint=0,bone=0,slot=0,sv_vector=0,sv_length=0,bw=0,eval_pos = true)
{

	if(eval_pos)
	{
	if(joint==0){return;}

	this.joint_data = joint;//to access its dynamic changing abs coord sys
	this.joint_weight = 1; //0 to 1 ratio of joint effect
	this.relcoord = new CoordSys(!joint.left_hand);//relative normals and tangents for weighted affecting joint

	this.delete = function(){this.relcoord.delete(); delete this.relcoord;};//√

	}

	else{//eval_pos = false means it depends on bone(s)

	if(bone==0){return;}

	this.bone = bone;
	this.slot = slot;
	this.sv_vector = sv_vector;
	this.sv_length = sv_length;
	this.bone_weight = bw;

	}
}


var Vertex = function(joint=0,bone=0,slot=0,sv_vector=0,sv_length=0,bw=0,eval_pos = true)
{
	// it appends a pointer to the object, it is not cloned, it is actually accessed from here
	// this is joint object (pointer), not index to it, and it is ok
	this.pos_data =  new DoublyCircularLinkedList();//√
	this.pos_data.append(new VertexJointsPolynomial(joint,bone,slot,sv_vector,sv_length,bw,eval_pos));//√
	
	// abs coords pos + normal + 2 ortho tangents
	this.abscoords = new CoordSys();//√

	//pointer to object it is involved in(!)
	this.objPtr;//√ points to SceneObj

	//vertex visual props, eg. material props, color is got at initiazation time from obj, either by coloring the obj, or from
	//obj texture
	this.tx = 0;//?
	this.ty = 0;//?

	this.red;// = red;
	this.green;// = green;
	this.blue;// = blue;
	this.alpha;// = alpha;

	//this.material_props;//may be will call it by objPtr;

	//interface
	this.calAbsPos = calpositionofvertex;//√
	this.calAbsVectors = calabsolutevectors;//?? normal & tanget how to cal them ??
	this.calRelPos = calrelpositionofvertex;//?? once abs got calculated this will be figured out isA
	this.getAbsPos = getAbsPos;//function(){return {x:this.abscoords.origin.x,y:this.abscoords.origin.y,z:this.abscoords.origin.z};}//√
	this.getAbsVectors = function(){return this.abscoords.vectors;}//√
	this.getNormal = getVertexNormal;//function(){return this.abscoords.vectors.m.getYvector();};//√
	this.getTangent = function(){return this.abscoords.vectors.m.getXvector();};//√getXvector or Z

	this.dup = duplicateVertex;
	this.converttopixel = convertToPixel;

	this.delete = deleteVertex;//√

	this.pos_eval = true;// "joint";// if false it is 'bone'
	this.covered = false;//covered by clothes, or any other thing
}

function getVertexNormal()
{
	return {x: this.abscoords.vectors.m.e1,
		y: this.abscoords.vectors.m.e5,
		z: this.abscoords.vectors.m.e9};

}

function createVertex(pos_by_joint/*true*/,objptr,txi,tyi,r,g,b,a,nx=0,ny=0,nz=0)
{
	return {pos_eval:pos_by_joint,
		objPtr:objptr,
		tx:txi,ty:tyi,
		red:r,green:g,blue:b,alpha:a,
		relnx:nx,relny:ny,relnz:nz,
		calAbsPos: calpositionofvertex,
		calAbsVectors: calabsolutevectors,
		calRelPos: calrelpositionofvertex,
		getAbsPos: getAbsPos,
		getAbsVectors: calabsolutevectors,//function(){return this.abscoords.vectors;},
		getNormal: getVertexNormal,//function(){return this.abscoords.vectors.m.getYvector();},
		getTangent: function(){return this.abscoords.vectors.m.getXvector();},
		dup: duplicateVertex,
		converttopixel: convertToPixel,
		flatX:0,
		flatY:0,
		transmit_flat:false,
		delete: deleteVertex,
		followed: false,
		vectors_followed:false,
		covered: false,
		pos_data: new DoublyCircularLinkedList(),
		abscoords: {origin:{x:0,y:0,z:0},vectors:new Transform(),
		delete:deleteCoordSys,dup:duplicateCoordSys}};
}

function getAbsPos()
{return this.abscoords.origin;}

function duplicateVertex()
{
	pos_data = new DoublyCircularLinkedList();
	for(i=0;i<this.pos_data.count;i++)
	{
		pos_data.append(this.pos_data.current.value);
		this.pos_data.pointToNext();
	}

	tempv = new Vertex();
	tempv.pos_data.deleteList();
	tempv.pos_data = pos_data;

	tempv.abscoords.delete();
	delete tempv.abscoords;

	tempv.abscoords = this.abscoords.dup();
	tempv.objPtr = this.objPtr;

	tempv.tx = this.tx;
	tempv.ty = this.ty;

	tempv.red = this.red;// = red;
	tempv.green = this.green;// = green;
	tempv.blue = this.blue;// = blue;
	tempv.alpha = this.alpha;// = alpha;

	if(this.original_vertex_index){temp.original_vertex_index = this.original_vertex_index;}

	//duplicate this.material_props;//may be will call it by objPtr;

	return tempv;
}

function calabsolutevectors(inde = -1)
{

/*

//no relative normals, normals will be calculated from mesh quads just like first call
// updated pos for vertex only will cause its normal to be recalculated

	if(this.vectors_followed){return;}
	
	//this.abscoords.vectors.
	if(this.pos_eval)//joint
	{
		ppos = this.pos_data.current.value.joint_data.getAbsPosition();
		diffx = this.abscoords.origin.x - ppos.x;
		diffy = this.abscoords.origin.y - ppos.y;
		diffz = this.abscoords.origin.z - ppos.z;

		mag = Math.sqrt(diffx*diffx + diffy*diffy + diffz*diffz );

		this.abscoords.vectors.m.e1 =  diffx/mag;
		this.abscoords.vectors.m.e5 =  diffy/mag;
		this.abscoords.vectors.m.e9 =  diffz/mag;
		this.abscoords.vectors.m.e13 =  0;

	}
	else//bone
	{

		pm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.pj];
		cm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.cj].getRelPosition().y;
		slot = this.pos_data.current.value.slot;
		blen = this.pos_data.current.value.bone.length;

		ry = slot*blen;
		sign = (cm < 0)?-1:1;

		diffx = this.abscoords.origin.x - pm.getAbsPosition().x + sign*ry*pm.getAbsYvector().x;
		diffy = this.abscoords.origin.y - pm.getAbsPosition().y + sign*ry*pm.getAbsYvector().y;
		diffz = this.abscoords.origin.z - pm.getAbsPosition().z + sign*ry*pm.getAbsYvector().z;
		

		mag = Math.sqrt(diffx*diffx + diffy*diffy + diffz*diffz );

		this.abscoords.vectors.m.e1 =  diffx/mag;
		this.abscoords.vectors.m.e5 =  diffy/mag;
		this.abscoords.vectors.m.e9 =  diffz/mag;
		this.abscoords.vectors.m.e13 =  0;

	}
	

	this.vectors_followed = true;

*/


}

function calpositionofvertex(inde = -1)
{

	acc_posx2 = 0;acc_posy2=0;acc_posz2=0;

	if(this.pos_eval)//joint
	{
		if(this.pos_data.count==1 && this.pos_data.current.value.joint_data.followed){return;}
		followed = false;
		if(this.pos_data.current.value.joint_data.followed){followed = true;}

		acc_posx = 0;acc_posy=0;acc_posz=0;
		acc_posx2 = 0;acc_posy2=0;acc_posz2=0;


		pm = this.pos_data.current.value.joint_data.getabscoords().dup();
		wt = this.pos_data.current.value.joint_weight;
		rm = new Point3D(this.pos_data.current.value.relcoord.origin.x,
				this.pos_data.current.value.relcoord.origin.y,
				this.pos_data.current.value.relcoord.origin.z);

		temppos = pm.transformPoint(rm);
		ppos = this.pos_data.current.value.joint_data.getAbsPosition();
		acc_posx += wt*(temppos.x+ppos.x); acc_posy += wt*(temppos.y+ppos.y); acc_posz += wt*(temppos.z+ppos.z);

		rm.x *= 1.1; rm.y *= 1.1; rm.z *= 1.1;
		temppos = pm.transformPoint(rm);
		//acc_posx2 += wt*(temppos.x+ppos.x); acc_posy2 += wt*(temppos.y+ppos.y); acc_posz2 += wt*(temppos.z+ppos.z);
		acc_posx2 += acc_posx*2; acc_posy2 += acc_posy*2; acc_posz2 +=acc_posz*2;


		/*
		 if( inde >=0 && this.pos_data.current.value.joint_data.lastVertex == inde)
		{this.pos_data.current.value.joint_data.followed = true;}
		*/

		//delete pm;delete rm;delete temppos;

		if(this.pos_data.count>1)
		{
			this.pos_data.pointToNext();

			if(followed && this.pos_data.current.value.joint_data.followed){return;}
			pm = this.pos_data.current.value.joint_data.getabscoords().dup();
			wt = this.pos_data.current.value.joint_weight;
			rm = new Point3D(this.pos_data.current.value.relcoord.origin.x,
				this.pos_data.current.value.relcoord.origin.y,
				this.pos_data.current.value.relcoord.origin.z);

			temppos = pm.transformPoint(rm);
			ppos = this.pos_data.current.value.joint_data.getAbsPosition();
			acc_posx += wt*(temppos.x+ppos.x); acc_posy += wt*(temppos.y+ppos.y); acc_posz += wt*(temppos.z+ppos.z);

		rm.x *= 1.1; rm.y *= 1.1; rm.z *= 1.1;
		temppos = pm.transformPoint(rm);
		//acc_posx2 += wt*(temppos.x+ppos.x); acc_posy2 += wt*(temppos.y+ppos.y); acc_posz2 += wt*(temppos.z+ppos.z);
		acc_posx2 += acc_posx*2; acc_posy2 += acc_posy*2; acc_posz2 +=acc_posz*2;


		/*
		 if( inde >=0 && this.pos_data.current.value.joint_data.lastVertex == inde)
		{this.pos_data.current.value.joint_data.followed = true;}
		*/

			//delete pm;delete rm;delete temppos;
		}

	this.vectors_followed = false;

	this.abscoords.origin.x = acc_posx;
	this.abscoords.origin.y = acc_posy;
	this.abscoords.origin.z = acc_posz;

	diffx = acc_posx2 - acc_posx;
	diffy = acc_posy2 - acc_posy;
	diffz = acc_posz2 - acc_posz;

	mag = Math.sqrt(diffx*diffx + diffy*diffy + diffz*diffz );

	this.abscoords.vectors.m.e1 =  diffx/mag;
	this.abscoords.vectors.m.e5 =  diffy/mag;
	this.abscoords.vectors.m.e9 =  diffz/mag;
	this.abscoords.vectors.m.e13 =  0;



	return;
	}
	else //bone evaluation
	{
		if(this.pos_data.count==1 &&
		this.pos_data.current.value.bone.followed ){return;}
		
		followed = false;

		if( this.pos_data.current.value.bone.followed){followed = true;}

		acc_posx = 0;acc_posy=0;acc_posz=0;
		pm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.pj];
		cm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.cj].getRelPosition().y;
		wt = this.pos_data.current.value.bone_weight;
		sv_vector = this.pos_data.current.value.sv_vector;
		sv_length = this.pos_data.current.value.sv_length;

		slot = this.pos_data.current.value.slot;
		blen = this.pos_data.current.value.bone.length;
		b_vector = this.pos_data.current.value.bone.vector;

		
		acc_posx += ( slot*blen*b_vector.x + 
				sv_length*(sv_vector.x*pm.getAbsXvector().x + sv_vector.y*pm.getAbsYvector().x + sv_vector.z*pm.getAbsZvector().x ) 
				+ pm.getAbsPosition().x)*wt;

		acc_posy += ( slot*blen*b_vector.y  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().y + sv_vector.y*pm.getAbsYvector().y + sv_vector.z*pm.getAbsZvector().y ) 
				+ pm.getAbsPosition().y)*wt;

		acc_posz += ( slot*blen*b_vector.z  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().z + sv_vector.y*pm.getAbsYvector().z + sv_vector.z*pm.getAbsZvector().z ) 
				+ pm.getAbsPosition().z)*wt;

		acc_posx2 += acc_posx*2; acc_posy2 += acc_posy*2; acc_posz2 +=acc_posz*2;


		/*
		 if( inde >=0 && this.pos_data.current.value.bone.lastVertex == inde)
		{this.pos_data.current.value.bone.followed = true;}
		*/

		if(this.pos_data.count>1)
		{
			this.pos_data.pointToNext();

		if(followed &&
		 this.pos_data.current.value.bone.followed ){return;}

		pm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.pj];
		cm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.cj].getRelPosition().y;
		wt = this.pos_data.current.value.bone_weight;
		sv_vector = this.pos_data.current.value.sv_vector;
		sv_length = this.pos_data.current.value.sv_length;

		slot = this.pos_data.current.value.slot;
		blen = this.pos_data.current.value.bone.length;
		b_vector = this.pos_data.current.value.bone.vector;

		
		acc_posx += ( slot*blen*b_vector.x + 
				sv_length*(sv_vector.x*pm.getAbsXvector().x + sv_vector.y*pm.getAbsYvector().x + sv_vector.z*pm.getAbsZvector().x ) 
				+ pm.getAbsPosition().x)*wt;

		acc_posy += ( slot*blen*b_vector.y  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().y + sv_vector.y*pm.getAbsYvector().y + sv_vector.z*pm.getAbsZvector().y ) 
				+ pm.getAbsPosition().y)*wt;

		acc_posz += ( slot*blen*b_vector.z  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().z + sv_vector.y*pm.getAbsYvector().z + sv_vector.z*pm.getAbsZvector().z ) 
				+ pm.getAbsPosition().z)*wt;

		acc_posx2 += acc_posx*2; acc_posy2 += acc_posy*2; acc_posz2 +=acc_posz*2;

		
		/*
		 if( inde >=0 && this.pos_data.current.value.bone.lastVertex == inde)
		{this.pos_data.current.value.bone.followed = true;}
		*/

		}

		if(this.pos_data.count>2)
		{
			this.pos_data.pointToNext();

		if(followed &&
		 this.pos_data.current.value.bone.followed ){return;}

		pm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.pj];
		cm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.cj].getRelPosition().y;
		wt = this.pos_data.current.value.bone_weight;
		sv_vector = this.pos_data.current.value.sv_vector;
		sv_length = this.pos_data.current.value.sv_length;

		slot = this.pos_data.current.value.slot;
		blen = this.pos_data.current.value.bone.length;
		b_vector = this.pos_data.current.value.bone.vector;

		
		acc_posx += ( slot*blen*b_vector.x + 
				sv_length*(sv_vector.x*pm.getAbsXvector().x + sv_vector.y*pm.getAbsYvector().x + sv_vector.z*pm.getAbsZvector().x ) 
				+ pm.getAbsPosition().x)*wt;

		acc_posy += ( slot*blen*b_vector.y  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().y + sv_vector.y*pm.getAbsYvector().y + sv_vector.z*pm.getAbsZvector().y ) 
				+ pm.getAbsPosition().y)*wt;

		acc_posz += ( slot*blen*b_vector.z  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().z + sv_vector.y*pm.getAbsYvector().z + sv_vector.z*pm.getAbsZvector().z ) 
				+ pm.getAbsPosition().z)*wt;

		acc_posx2 += acc_posx*2; acc_posy2 += acc_posy*2; acc_posz2 +=acc_posz*2;

		
		/*
		 if( inde >=0 && this.pos_data.current.value.bone.lastVertex == inde)
		{this.pos_data.current.value.bone.followed = true;}
		*/

		}
		if(this.pos_data.count>3)
		{
			this.pos_data.pointToNext();

		if(followed &&
		 this.pos_data.current.value.bone.followed ){return;}

		pm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.pj];
		cm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.cj].getRelPosition().y;
		wt = this.pos_data.current.value.bone_weight;
		sv_vector = this.pos_data.current.value.sv_vector;
		sv_length = this.pos_data.current.value.sv_length;

		slot = this.pos_data.current.value.slot;
		blen = this.pos_data.current.value.bone.length;
		b_vector = this.pos_data.current.value.bone.vector;

		
		acc_posx += ( slot*blen*b_vector.x + 
				sv_length*(sv_vector.x*pm.getAbsXvector().x + sv_vector.y*pm.getAbsYvector().x + sv_vector.z*pm.getAbsZvector().x ) 
				+ pm.getAbsPosition().x)*wt;

		acc_posy += ( slot*blen*b_vector.y  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().y + sv_vector.y*pm.getAbsYvector().y + sv_vector.z*pm.getAbsZvector().y ) 
				+ pm.getAbsPosition().y)*wt;

		acc_posz += ( slot*blen*b_vector.z  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().z + sv_vector.y*pm.getAbsYvector().z + sv_vector.z*pm.getAbsZvector().z ) 
				+ pm.getAbsPosition().z)*wt;

		acc_posx2 += acc_posx*2; acc_posy2 += acc_posy*2; acc_posz2 +=acc_posz*2;

		
		/*
		 if( inde >=0 && this.pos_data.current.value.bone.lastVertex == inde)
		{this.pos_data.current.value.bone.followed = true;}
		*/

		}
		if(this.pos_data.count>4)
		{
			this.pos_data.pointToNext();

		if(followed &&
		 this.pos_data.current.value.bone.followed ){return;}

		pm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.pj];
		cm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.cj].getRelPosition().y;
		wt = this.pos_data.current.value.bone_weight;
		sv_vector = this.pos_data.current.value.sv_vector;
		sv_length = this.pos_data.current.value.sv_length;

		slot = this.pos_data.current.value.slot;
		blen = this.pos_data.current.value.bone.length;
		b_vector = this.pos_data.current.value.bone.vector;

		
		acc_posx += ( slot*blen*b_vector.x + 
				sv_length*(sv_vector.x*pm.getAbsXvector().x + sv_vector.y*pm.getAbsYvector().x + sv_vector.z*pm.getAbsZvector().x ) 
				+ pm.getAbsPosition().x)*wt;

		acc_posy += ( slot*blen*b_vector.y  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().y + sv_vector.y*pm.getAbsYvector().y + sv_vector.z*pm.getAbsZvector().y ) 
				+ pm.getAbsPosition().y)*wt;

		acc_posz += ( slot*blen*b_vector.z  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().z + sv_vector.y*pm.getAbsYvector().z + sv_vector.z*pm.getAbsZvector().z ) 
				+ pm.getAbsPosition().z)*wt;

		acc_posx2 += acc_posx*2; acc_posy2 += acc_posy*2; acc_posz2 +=acc_posz*2;

		
		/*
		 if( inde >=0 && this.pos_data.current.value.bone.lastVertex == inde)
		{this.pos_data.current.value.bone.followed = true;}
		*/

		}
		if(this.pos_data.count>5)
		{
			this.pos_data.pointToNext();

		if(followed &&
		 this.pos_data.current.value.bone.followed ){return;}

		pm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.pj];
		cm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.cj].getRelPosition().y;
		wt = this.pos_data.current.value.bone_weight;
		sv_vector = this.pos_data.current.value.sv_vector;
		sv_length = this.pos_data.current.value.sv_length;

		slot = this.pos_data.current.value.slot;
		blen = this.pos_data.current.value.bone.length;
		b_vector = this.pos_data.current.value.bone.vector;

		
		acc_posx += ( slot*blen*b_vector.x + 
				sv_length*(sv_vector.x*pm.getAbsXvector().x + sv_vector.y*pm.getAbsYvector().x + sv_vector.z*pm.getAbsZvector().x ) 
				+ pm.getAbsPosition().x)*wt;

		acc_posy += ( slot*blen*b_vector.y  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().y + sv_vector.y*pm.getAbsYvector().y + sv_vector.z*pm.getAbsZvector().y ) 
				+ pm.getAbsPosition().y)*wt;

		acc_posz += ( slot*blen*b_vector.z  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().z + sv_vector.y*pm.getAbsYvector().z + sv_vector.z*pm.getAbsZvector().z ) 
				+ pm.getAbsPosition().z)*wt;

		acc_posx2 += acc_posx*2; acc_posy2 += acc_posy*2; acc_posz2 +=acc_posz*2;

		
		/*
		 if( inde >=0 && this.pos_data.current.value.bone.lastVertex == inde)
		{this.pos_data.current.value.bone.followed = true;}
		*/

		}

		if(this.pos_data.count>6)
		{
			this.pos_data.pointToNext();

		if(followed &&
		 this.pos_data.current.value.bone.followed ){return;}

		pm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.pj];
		cm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.cj].getRelPosition().y;
		wt = this.pos_data.current.value.bone_weight;
		sv_vector = this.pos_data.current.value.sv_vector;
		sv_length = this.pos_data.current.value.sv_length;

		slot = this.pos_data.current.value.slot;
		blen = this.pos_data.current.value.bone.length;
		b_vector = this.pos_data.current.value.bone.vector;

		
		acc_posx += ( slot*blen*b_vector.x + 
				sv_length*(sv_vector.x*pm.getAbsXvector().x + sv_vector.y*pm.getAbsYvector().x + sv_vector.z*pm.getAbsZvector().x ) 
				+ pm.getAbsPosition().x)*wt;

		acc_posy += ( slot*blen*b_vector.y  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().y + sv_vector.y*pm.getAbsYvector().y + sv_vector.z*pm.getAbsZvector().y ) 
				+ pm.getAbsPosition().y)*wt;

		acc_posz += ( slot*blen*b_vector.z  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().z + sv_vector.y*pm.getAbsYvector().z + sv_vector.z*pm.getAbsZvector().z ) 
				+ pm.getAbsPosition().z)*wt;

		acc_posx2 += acc_posx*2; acc_posy2 += acc_posy*2; acc_posz2 +=acc_posz*2;

		
		/*
		 if( inde >=0 && this.pos_data.current.value.bone.lastVertex == inde)
		{this.pos_data.current.value.bone.followed = true;}
		*/

		}

		if(this.pos_data.count>7)
		{
			this.pos_data.pointToNext();

		if(followed &&
		 this.pos_data.current.value.bone.followed ){return;}

		pm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.pj];
		cm = this.objPtr.skel.skeleton_joints[this.pos_data.current.value.bone.cj].getRelPosition().y;
		wt = this.pos_data.current.value.bone_weight;
		sv_vector = this.pos_data.current.value.sv_vector;
		sv_length = this.pos_data.current.value.sv_length;

		slot = this.pos_data.current.value.slot;
		blen = this.pos_data.current.value.bone.length;
		b_vector = this.pos_data.current.value.bone.vector;

		
		acc_posx += ( slot*blen*b_vector.x + 
				sv_length*(sv_vector.x*pm.getAbsXvector().x + sv_vector.y*pm.getAbsYvector().x + sv_vector.z*pm.getAbsZvector().x ) 
				+ pm.getAbsPosition().x)*wt;

		acc_posy += ( slot*blen*b_vector.y  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().y + sv_vector.y*pm.getAbsYvector().y + sv_vector.z*pm.getAbsZvector().y ) 
				+ pm.getAbsPosition().y)*wt;

		acc_posz += ( slot*blen*b_vector.z  + 
				sv_length*(sv_vector.x*pm.getAbsXvector().z + sv_vector.y*pm.getAbsYvector().z + sv_vector.z*pm.getAbsZvector().z ) 
				+ pm.getAbsPosition().z)*wt;

		acc_posx2 += acc_posx*2; acc_posy2 += acc_posy*2; acc_posz2 +=acc_posz*2;

		
		/*
		 if( inde >=0 && this.pos_data.current.value.bone.lastVertex == inde)
		{this.pos_data.current.value.bone.followed = true;}
		*/

		}


	this.vectors_followed = false;
	this.abscoords.origin.x = acc_posx;
	this.abscoords.origin.y = acc_posy;
	this.abscoords.origin.z = acc_posz;

	diffx = acc_posx2 - acc_posx;
	diffy = acc_posy2 - acc_posy;
	diffz = acc_posz2 - acc_posz;

	mag = Math.sqrt(diffx*diffx + diffy*diffy + diffz*diffz );

	this.abscoords.vectors.m.e1 =  diffx/mag;
	this.abscoords.vectors.m.e5 =  diffy/mag;
	this.abscoords.vectors.m.e9 =  diffz/mag;
	this.abscoords.vectors.m.e13 =  0;


		
	}




}

function calrelpositionofvertex()
{


	if(this.pos_eval)
	{

	pj = this.pos_data.current.value.joint_data;
	w = this.pos_data.current.value.joint_weight;
	jpos = pj.getAbsPosition();


	vpos = new Point3D(this.abscoords.origin.x,this.abscoords.origin.y,this.abscoords.origin.z);
	
	jv = new Point3D(vpos.x - jpos.x, vpos.y - jpos.y, vpos.z - jpos.z );

	this.pos_data.current.value.relcoord.origin.x = jv.GetDotProduct(pj.getAbsXvector())/w;
	this.pos_data.current.value.relcoord.origin.y = jv.GetDotProduct(pj.getAbsYvector())/w;
	this.pos_data.current.value.relcoord.origin.z = jv.GetDotProduct(pj.getAbsZvector())/w;

	delete jv;

	if(this.pos_data.count>1)
	{
		this.pos_data.pointToNext();
		pj = this.pos_data.current.value.joint_data;
		w = this.pos_data.current.value.joint_weight;
		jpos = pj.getAbsPosition();
		jv = new Point3D(vpos.x - jpos.x, vpos.y - jpos.y, vpos.z - jpos.z );

		this.pos_data.current.value.relcoord.origin.x += jv.GetDotProduct(pj.getAbsXvector())/w;
		this.pos_data.current.value.relcoord.origin.y += jv.GetDotProduct(pj.getAbsYvector())/w;
		this.pos_data.current.value.relcoord.origin.z += jv.GetDotProduct(pj.getAbsZvector())/w;

		delete jv;
	}

	return;
	}
	else//bone evaluation
	{
		// use calVertexData given each bone, in pos_data
		// weight will be automatically used via calAbsPos
		bone = this.pos_data.current.value.bone;
		[this.pos_data.current.value.slot,
		this.pos_data.current.value.sv_vector,
		this.pos_data.current.value.sv_length] = bone.calVertexData_v2(bone.skel,this);

		if(this.pos_data.count>1)
		{
			this.pos_data.pointToNext();
			bone = this.pos_data.current.value.bone;
			[this.pos_data.current.value.slot,
			this.pos_data.current.value.sv_vector,
			this.pos_data.current.value.sv_length] = bone.calVertexData_v2(bone.skel,this);

		}
		if(this.pos_data.count>2)
		{
			this.pos_data.pointToNext();
			bone = this.pos_data.current.value.bone;
			[this.pos_data.current.value.slot,
			this.pos_data.current.value.sv_vector,
			this.pos_data.current.value.sv_length] = bone.calVertexData_v2(bone.skel,this);

		}
		if(this.pos_data.count>3)
		{
			this.pos_data.pointToNext();
			bone = this.pos_data.current.value.bone;
			[this.pos_data.current.value.slot,
			this.pos_data.current.value.sv_vector,
			this.pos_data.current.value.sv_length] = bone.calVertexData_v2(bone.skel,this);

		}
		if(this.pos_data.count>4)
		{
			this.pos_data.pointToNext();
			bone = this.pos_data.current.value.bone;
			[this.pos_data.current.value.slot,
			this.pos_data.current.value.sv_vector,
			this.pos_data.current.value.sv_length] = bone.calVertexData_v2(bone.skel,this);

		}
		if(this.pos_data.count>5)
		{
			this.pos_data.pointToNext();
			bone = this.pos_data.current.value.bone;
			[this.pos_data.current.value.slot,
			this.pos_data.current.value.sv_vector,
			this.pos_data.current.value.sv_length] = bone.calVertexData_v2(bone.skel,this);

		}
		if(this.pos_data.count>6)
		{
			this.pos_data.pointToNext();
			bone = this.pos_data.current.value.bone;
			[this.pos_data.current.value.slot,
			this.pos_data.current.value.sv_vector,
			this.pos_data.current.value.sv_length] = bone.calVertexData_v2(bone.skel,this);

		}

		if(this.pos_data.count>7)
		{
			this.pos_data.pointToNext();
			bone = this.pos_data.current.value.bone;
			[this.pos_data.current.value.slot,
			this.pos_data.current.value.sv_vector,
			this.pos_data.current.value.sv_length] = bone.calVertexData_v2(bone.skel,this);

		}


		
	}

}



function convertToPixel(vertex_index = -1)
{

return {
	abscoords:this.abscoords.dup(),
	objPtr:this.objPtr,
	tx:this.tx,ty:this.ty,
	red:this.red,green:this.green,blue:this.blue,alpha:this.alpha,
	original_vertex_index:vertex_index,
	dup:duplicate,
	checkEquals:checkEquals
	};
}

function checkEquals(p)
{
	return (
		(p.abscoords.origin.x == this.abscoords.origin.x)&&
		(p.abscoords.origin.y == this.abscoords.origin.y)&&

		(p.z_buffer == this.z_buffer)&&

		(p.red == this.red)&&
		(p.green == this.green)&&
		(p.blue == this.blue)&&
		(p.alpha == this.alpha)

		);

}

function deleteVertex()
{
	//call the delete this.abscoords.delete
	this.abscoords.delete();
	delete this.abscoords;

	//for each element in pos_data, delete its this.relcoords
	for(i=0;i<this.pos_data.count;i++)
	{
		this.pos_data.getHeadNodeValue().delete();
		this.pos_data.deleteHeadNode();
	}
}


var Line = function(vi1=0,vi2=0)
{
	this.vi1 = vi1;
	this.vi2 = vi2;

	this.len = -1;
}

var Mesh = function(){this.build;}


