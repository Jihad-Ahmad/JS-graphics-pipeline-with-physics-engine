

var skeleton = function()
{
	this.step = 2;
	this.skeleton_joints;
	this.frame_num = 0;
	//this.array_of_controlled;

	this.array_of_bones=[-1];

	// building a structured skeleton:
	this.init = buildHumanSkel;//buildonebyone;//buildHumanSkel;//√


	this.findindex = findIndex;//√
	this.findindexofbone = findIndexOfBone;//√

	this.addjointtoskel = addJoint;//(Joint,parent_name,child)//√

	this.saveframe = saveFrame;//√
	this.getnextframe = getNextFrame;//√
	this.getprevframe = getPrevFrame;//√

	this.getabspos = function(index){return this.skeleton_joints[index].getAbsPosition();};//√
	this.getrelpos = function(index){return this.skeleton_joints[index].getRelPosition();};//√

	this.calabspos = calpositionofjoint;//√
	this.calabsvec = calvectorsofjoint;//√
	this.calrelvec = calrelvectorsofjoint;//√
	this.calrelpos = calrelpositionofjoint;//√
	this.resetfollowedofjoint = resetfollowedofjoint;


	this.rotationeffect = rotationEffect;//(skel,joint_index)

	this.forSkel = fromParentToLeaves;//(start_from,delegate)//√
	
	this.calAllAbsPos = function(start_from){this.forSkel(start_from,this.calabspos);}//√
	this.calAllAbsVec = function(start_from){this.forSkel(start_from,this.calabsvec);}//√
	this.calAllRelVec = function(start_from){this.forSkel(start_from,this.calrelvec);}//√
	this.resetfollowed = function(start_from){this.forSkel(start_from,this.resetfollowedofjoint);}//√

	//these 14 motion funcs depend only on absolute coords
	//but affect rel coords if it has a parent
	this.moveFront = MoveSkelJointFront;//√
	this.moveBack  = MoveSkelJointBack;//√
	this.moveRight = MoveSkelJointRight;//√
	this.moveLeft  = MoveSkelJointLeft;//√
	this.moveUp    = MoveSkelJointUp;//√
	this.moveDown  = MoveSkelJointDown;//√
	this.moveLinear= MoveSkelJointLinear;//√

	//these depend on both, abs and rel
	this.rotateXcw = RotateSkelJointXcw;//√
	this.rotateXac = RotateSkelJointXac;//√
	this.rotateYcw = RotateSkelJointYcw;//√
	this.rotateYac = RotateSkelJointYac;//√
	this.rotateZcw = RotateSkelJointZcw;//√
	this.rotateZac = RotateSkelJointZac;//√

	this.rotateArbitrary = RotateSkelJointU;//√

	this.adjustmeasurements = adjustMeasurements;//√

	this.saveskeleton = savebuild;
	this.delete = deleteSkel;

	this.deleteControlled = function(jointi,inde)
	{this.skeleton_joints[jointi].deleteControlled(inde);}

	this.manikan_stand = manikanstand;
	this.straight_stand_rotate = straightstandrotate;
	this.manikan_stand_rotate = rotatemanikanstand;
	

	//animation and poses scripts
	this.poses = rotatemanikanstand;//manikanstand;//straightstandrotate;

};

skeleton.prototype.convertToMesh = function()
{
	//array of vertices and array of lines, and no quads
	//for each joint create a vertex, 

	txt = "qi = 0;";
	txt += "if (array_of_quads[0] == -1) {";
	txt +="    qi = 0;";
	txt += "} else {";
	txt += "    qi = array_of_quads.length;";
	txt += "}";

	txt += "li = 0;";
	txt += "if (array_of_lines[0] == -1) {";
	txt += "    li = 0;";
	txt += "} else {";
	txt += "    li = array_of_lines.length;";
	txt += "}";


	txt += "len = 0; if(array_of_vertices[0]==-1){len = 0;}else{len = array_of_vertices.length;} ";

	txt += "for(i=len;i&lt;skel.skeleton_joints.length+len;i++)";
	txt +="{";
		txt += "joint = skel.skeleton_joints[i];<br/>";
		txt += "array_of_vertices[i]= new Vertex(joint);<br/>";
		txt += "array_of_vertices[i].objPtr = objptr;<br/>";

		txt += "array_of_vertices[i].pos_data.current.value.joint_weight =1;";

		txt += "array_of_vertices[i].pos_data.current.value.relcoord.origin.x =0;";
		txt += "array_of_vertices[i].pos_data.current.value.relcoord.origin.y =0;";
		txt += "array_of_vertices[i].pos_data.current.value.relcoord.origin.z =0;";

		txt += "array_of_vertices[i].tx =0;";
		txt += "array_of_vertices[i].ty =0;";

		txt += "array_of_vertices[i].red=0;";
		txt += "array_of_vertices[i].green=0;";
		txt += "array_of_vertices[i].blue=100;";
		txt += "array_of_vertices[i].alpha=255;";

		txt += "array_of_vertices[i].calAbsPos();";

		/*
		//hove no idea how to calculate a normal & tangent of a vertex in a mesh now
		txt += "array_of_vertices[i].calAbsVectors();<br/>";
		txt += "joint.addControlled(i);<br/>";
		*/


		txt += "if(i&gt;0){";//line between i and joint of parent

			txt += "array_of_lines[li]= new Line(i,skel.skeleton_joints[i].parent+len);li++;";
			//no quads		
		txt+="}/*array_of_quads[qi] = new Quad(0,0,0,0,1,1,1,1);*/}";


	document.write(txt);


}

function deleteSkel()
{}

function findIndex(name)
{
	for(i=0;i<this.skeleton_joints.length;i++)
	{
		if(name == this.skeleton_joints[i].jointname){return i;};	
	}
	return -1;
	
}


function findIndexOfBone(name)
{
	for(i=0;i<this.array_of_bones.length;i++)
	{
		if(name == this.array_of_bones[i].name){return i;};	
	}
	return -1;
	
}


//need to be tested -  not sure child will survive
function addJoint(joint,parent_name,child)
{
	joint_index = 0;
	if(!this.skeleton_joints){this.skeleton_joints = [joint];}
	else{joint_index = this.skeleton_joints.length;}

	//find parent index
	parent_index = this.findindex(parent_name);
	if(parent_index>=0){
	if(this.skeleton_joints[parent_index].child==0)
	{
		this.skeleton_joints[parent_index].child = [joint_index];
	}
	else{
	this.skeleton_joints[parent_index].child[this.skeleton_joints[parent_index].child.length] = joint_index;}
	}
	this.skeleton_joints[joint_index] = joint;
	this.skeleton_joints[joint_index].child = child;
	this.skeleton_joints[joint_index].index = joint_index;
	this.skeleton_joints[joint_index].parent = parent_index;
	//get relative every thing to parent
}



function saveFrame()
{
	for(i=0;i<this.skeleton_joints.length;i++)
	{
		this.skeleton_joints[i].push();	
	}
	this.frame_num++;
}

function getNextFrame()
{
	for(i=0;i<this.skeleton_joints.length;i++)
	{
		this.skeleton_joints[i].popnext();
		this.skeleton_joints[i].followbones();
	
	}

}

function getPrevFrame()
{
	for(i=0;i<this.skeleton_joints.length;i++)
	{
		this.skeleton_joints[i].popprev();	
	}

}
//abs pos - working correct
function calpositionofjoint(skel,joint_index)
{
	//has no parent
	if(joint_index<=0){return;}
	//transformPoint(relposition,parent.abscoords);
	pm = skel.skeleton_joints[skel.skeleton_joints[joint_index].parent].getabscoords();

	rm = new Point3D(skel.skeleton_joints[joint_index].getRelPosition().x,
			skel.skeleton_joints[joint_index].getRelPosition().y,
			skel.skeleton_joints[joint_index].getRelPosition().z);
	temppos = pm.transformPoint(rm);
	ppos = new Point3D(skel.skeleton_joints[skel.skeleton_joints[joint_index].parent].getAbsPosition().x,
				skel.skeleton_joints[skel.skeleton_joints[joint_index].parent].getAbsPosition().y,
				skel.skeleton_joints[skel.skeleton_joints[joint_index].parent].getAbsPosition().z);

	//transformed point += joint_index joint pos
	skel.skeleton_joints[joint_index].setAbsPosition(temppos.x+ppos.x,temppos.y+ppos.y,temppos.z+ppos.z,temppos.w+ppos.w);
	delete temppox; delete rm;
}

//abs vecs - not sure
function calvectorsofjoint(skel,joint_index)
{
	if(joint_index<=0){return;}
	//joint abs coords = parentabs * jointrel
	
	pm = skel.skeleton_joints[skel.skeleton_joints[joint_index].parent].getabscoords().dup();
	cm = skel.skeleton_joints[joint_index].getrelcoords().dup();

	//console.log(pm.m.toString());
	pm.multTransform(cm);
	//console.log("\n"+pm.m.toString());
	skel.skeleton_joints[joint_index].setabscoords(pm.m.getXvector(),pm.m.getYvector(),pm.m.getZvector());

}

//sure
function calrelvectorsofjoint(skel,joint_index)
{
	if(joint_index<=0){return;}
	m1 = skel.skeleton_joints[joint_index].getabscoords().dup();
	m2 = skel.skeleton_joints[skel.skeleton_joints[joint_index].parent].getabscoords().dup();
	m1.transpose();
	m1.multTransform(m2);
	m1.transpose();//relative coordinates of this joint
	skel.skeleton_joints[joint_index].setrelcoords(m1.m.getXvector(),m1.m.getYvector(),m1.m.getZvector());

	if(skel.skeleton_joints[joint_index].bones.count > 0)
	{
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 1)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 2)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 3)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 4)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}


}

function resetfollowedofjoint(skel,joint_index)
{
	skel.skeleton_joints[joint_index].followbones();

	if(skel.skeleton_joints[joint_index].bones.count > 0)
	{
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 1)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 2)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 3)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 4)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}

}

function calrelpositionofjoint(skel,joint_index)
{

	if(joint_index<=0){return;}

	//abs position dot each of parent's vector = rel pos

	m2 = skel.skeleton_joints[skel.skeleton_joints[joint_index].parent].getabscoords().dup();

	pos = new Point3D(skel.skeleton_joints[joint_index].getAbsPosition().x,
			  skel.skeleton_joints[joint_index].getAbsPosition().y,
			  skel.skeleton_joints[joint_index].getAbsPosition().z);

	skel.skeleton_joints[joint_index].setRelPosition(pos.GetDotProduct(m2.m.getXvector()),
							pos.GetDotProduct(m2.m.getYvector()),
							pos.GetDotProduct(m2.m.getZvector()),
							0);

	if(skel.skeleton_joints[joint_index].bones.count > 0)
	{
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 1)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 2)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 3)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 4)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}

	
}


//start debugging with this
function rotationEffect(skel,joint_index)
{
	skel.skeleton_joints[joint_index].followbones(/*skel*/);// = false;

	skel.calabspos(skel,joint_index);
	skel.calabsvec(skel,joint_index);

	if(skel.skeleton_joints[joint_index].bones.count > 0)
	{
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 1)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 2)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 3)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}
	if(skel.skeleton_joints[joint_index].bones.count > 4)
	{
		skel.skeleton_joints[joint_index].bones.pointToNext();
		skel.skeleton_joints[joint_index].bones.current.value.calLength(skel);	
	}


	/*
	if(!skel.array_of_controlled){skel.array_of_controlled = [skel.skeleton_joints[joint_index].controlled];}
	else {skel.array_of_controlled[skel.array_of_controlled.length] = skel.skeleton_joints[joint_index].controlled;}
	*/

}
//.resetfollowed(activated_joints);

function MoveSkelJointFront()
{	
	front= this.skeleton_joints[0].getAbsZvector();
	for(r=0;r<this.skeleton_joints.length;r++)
	{this.getabspos(r).MoveLinear(front,this.step);	this.skeleton_joints[r].followbones();}

	this.resetfollowed(0);
}

function MoveSkelJointBack()
{	
	front= this.skeleton_joints[0].getAbsZvector();
	for(r=0;r<this.skeleton_joints.length;r++)
	{this.getabspos(r).MoveLinear(front,-this.step);this.skeleton_joints[r].followbones();}

	this.resetfollowed(0);
}

function MoveSkelJointUp()
{	
	vec= this.skeleton_joints[0].getAbsYvector();
	for(r=0;r<this.skeleton_joints.length;r++)
	{this.getabspos(r).MoveLinear(vec,this.step);this.skeleton_joints[r].followbones();}

	this.resetfollowed(0);
}

function MoveSkelJointDown()
{	
	vec= this.skeleton_joints[0].getAbsYvector();
	for(r=0;r<this.skeleton_joints.length;r++)
	{this.getabspos(r).MoveLinear(vec,-this.step);this.skeleton_joints[r].followbones();}

	this.resetfollowed(0);
}

function MoveSkelJointRight()
{	
	vec= this.skeleton_joints[0].getAbsXvector();
	for(r=0;r<this.skeleton_joints.length;r++)
	{this.getabspos(r).MoveLinear(vec,this.step);this.skeleton_joints[r].followbones();}

	this.resetfollowed(0);
}

function MoveSkelJointLeft()
{	
	vec= this.skeleton_joints[0].getAbsXvector();
	for(r=0;r<this.skeleton_joints.length;r++)
	{this.getabspos(r).MoveLinear(vec,-this.step);this.skeleton_joints[r].followbones();}
	//{this.skeleton_joints[r].moveLinear(vec.x*-this.step,vec.y*-this.step,vec.z*-this.step);this.skeleton_joints[r].followbones();}

	this.resetfollowed(0);
}

function MoveSkelJointLinear(U)
{	
	for(r=0;r<this.skeleton_joints.length;r++)
	{this.getabspos(r).MoveLinear(U,this.step);this.skeleton_joints[r].followbones();}

	this.resetfollowed(0);
}

function RotateSkelJointXcw(joint_index)
{
	if(joint_index<0){return;}

	this.skeleton_joints[joint_index].rotateXcw();
	this.skeleton_joints[joint_index].followbones();

	this.calrelvec(this,joint_index);

	/*
	if(!this.array_of_controlled){this.array_of_controlled = [this.skeleton_joints[joint_index].controlled];}
	else {this.array_of_controlled[this.array_of_controlled.length] = this.skeleton_joints[joint_index].controlled;}
	*/

	this.forSkel(joint_index,this.rotationeffect,false);

}

function RotateSkelJointXac(joint_index)
{
	if(joint_index<0){return;}
	this.skeleton_joints[joint_index].rotateXac();
	this.skeleton_joints[joint_index].followbones();

	this.calrelvec(this,joint_index);

	this.forSkel(joint_index,this.rotationeffect,false);

}

function RotateSkelJointYcw(joint_index)
{
	if(joint_index<0){return;}
	this.skeleton_joints[joint_index].rotateYcw();
	this.skeleton_joints[joint_index].followbones();

	this.calrelvec(this,joint_index);

	this.forSkel(joint_index,this.rotationeffect,false);

/*


	//this.GetAllPos(joint_index);
	this.EvaluateRelativeUp(joint_index);
	this.EvaluateRelativeRight(joint_index);
	this.EvaluateRelativeFront(joint_index);

	this.RotationEffect(joint_index);

*/

}
function RotateSkelJointYac(joint_index)
{
	if(joint_index<0){return;}
	this.skeleton_joints[joint_index].rotateYac();
	this.skeleton_joints[joint_index].followbones();

	this.calrelvec(this,joint_index);

	this.forSkel(joint_index,this.rotationeffect,false);

}

function RotateSkelJointZcw(joint_index)
{
	if(joint_index<0){return;}
	this.skeleton_joints[joint_index].rotateZcw();
	this.skeleton_joints[joint_index].followbones();

	this.calrelvec(this,joint_index);

	this.forSkel(joint_index,this.rotationeffect,false);

}

function RotateSkelJointZac(joint_index)
{
	if(joint_index<0){return;}
	this.skeleton_joints[joint_index].rotateZac();
	this.skeleton_joints[joint_index].followbones();

	this.calrelvec(this,joint_index);

	this.forSkel(joint_index,this.rotationeffect,false);

}

function RotateSkelJointU(joint_index,U)
{
	if(joint_index<0){return;}
	this.skeleton_joints[joint_index].rotateArbitrary(U);
	this.skeleton_joints[joint_index].followbones();

	this.calrelvec(this,joint_index);
	this.forSkel(joint_index,this.rotationeffect,false);

}

function fromParentToLeaves(start_from,delegate,start_with_first = true)
{
		dcll = new DoublyCircularLinkedList();
		dcll.append(start_from);
	

		counter = 0;
		index = start_from;

		while(counter>=0){
		index = dcll.getHeadNodeValue();
		if(index == start_from && !start_with_first){}
		else{delegate(this,index);}
		dcll.deleteHeadNode();
		if(this.skeleton_joints[index].child==0){}
		else
		{
			for(j=0;j<this.skeleton_joints[index].child.length;j++)
			{
				next_index = this.skeleton_joints[index].child[j];
				dcll.append(next_index);
			}
			
		}
		if(dcll.count>0){counter = 0;}
		else{counter--;}
		}

		dcll.deleteList()
		delete dcll;
}


function adjustMeasurements(meas)
{

	//have to change indecies into variables of found joint names.
	//this because if skeleton is changed the find will adapt it correctly

	//waist_to_hip
	var ipwth = meas.waist_to_hip;
	if(!isNaN(ipwth))
	{

	this.skeleton_joints[3].motion.current.value.relcoords.origin.y = 0 - ipwth/2;
	this.skeleton_joints[10].motion.current.value.relcoords.origin.y = 0 - ipwth/2;
	this.skeleton_joints[11].motion.current.value.relcoords.origin.y = 0 - ipwth/2;

	}

/*
	//shoulder
	var ipsh = meas.shoulder;
	if(!isNaN(ipsh))
	{
	fraction = ipsh/5;
	this.skeleton_joints[7].motion.current.value.relcoords.origin.x = (ipsh-fraction)/20;
	this.skeleton_joints[8].motion.current.value.relcoords.origin.x = (ipsh-fraction)/20;

	}

	

	//nape_to_waist
	var ipstw = meas.nape_to_waist;
	if(!isNaN(ipstw))
	{
	fraction = ipstw/5;
	this.skeleton_joints[1].motion.current.value.relcoords.origin.y = (ipstw)/100;
	this.skeleton_joints[2].motion.current.value.relcoords.origin.y = (ipstw)/100;
	}


	//sleeve
	var ips = meas.sleeve;
	if(!isNaN(ips))
	{

	//l. arm	
	this.skeleton_joints[12].motion.current.value.relcoords.origin.y = 0-(ips*1.618)/60;
	this.skeleton_joints[16].motion.current.value.relcoords.origin.y = 0-(ips)/60;

	//r. arm
	this.skeleton_joints[13].motion.current.value.relcoords.origin.y = 0-(ips*1.618)/60;
	this.skeleton_joints[17].motion.current.value.relcoords.origin.y = 0-(ips)/60;

	}



	//waist to knee
	var ipwtk = meas.waist_to_knee;
	if(!isNaN(ipwtk))
	{

	var htk =  ipwtk - ipwth;;

	//knee	
	this.skeleton_joints[14].motion.current.value.relcoords.origin.y = 0-(htk)/20;
	this.skeleton_joints[15].motion.current.value.relcoords.origin.y = 0-(htk)/20;

	this.skeleton_joints[18].motion.current.value.relcoords.origin.y = 0-(htk)/23;
	this.skeleton_joints[19].motion.current.value.relcoords.origin.y = 0-(htk)/23;

	}


	//side seam
	var ipss = meas.side_seam;

	if(!isNaN(ipss)&&!isNaN(ipwtk))
	{

	var kta = ipss - ipwtk;


	this.skeleton_joints[18].motion.current.value.relcoords.origin.y = 0-(kta)/26;
	this.skeleton_joints[19].motion.current.value.relcoords.origin.y = 0-(kta)/26;

	}
*/


	this.calAllAbsPos(0);
	

}




function savebuild()
{
	txt = "this.skeleton_joints = [-1];";
	for(j=0;j<this.skeleton_joints.length;j++)
	{
		txt += "this.skeleton_joints["+j+"] = new Joint("+!this.skeleton_joints[j].left_hand+");";
		txt += "this.skeleton_joints["+j+"].jointname = '"+this.skeleton_joints[j].jointname+"';";
		txt += "this.skeleton_joints["+j+"].index = "+j+";";
		txt += "this.skeleton_joints["+j+"].parent ="+this.skeleton_joints[j].parent+";";
		txt += "this.skeleton_joints["+j+"].motionstep = "+this.skeleton_joints[j].motionstep+";";
		txt += "this.skeleton_joints["+j+"].spinstep = "+this.skeleton_joints[j].spinstep+";";

		txt += "this.skeleton_joints["+j+"].setRelPosition("+this.skeleton_joints[j].getRelPosition().x+","+
							this.skeleton_joints[j].getRelPosition().y+","+
							this.skeleton_joints[j].getRelPosition().z+","+0+");";

		txt += "temp1 = {x:"+this.skeleton_joints[j].getAbsXvector().x+",y:"+
				    this.skeleton_joints[j].getAbsXvector().y+",z:"+
				    this.skeleton_joints[j].getAbsXvector().z+"};";

		txt += "temp2 = {x:"+this.skeleton_joints[j].getAbsYvector().x+",y:"+
				    this.skeleton_joints[j].getAbsYvector().y+",z:"+
				    this.skeleton_joints[j].getAbsYvector().z+"};";

		txt += "temp3 = {x:"+this.skeleton_joints[j].getAbsZvector().x+",y:"+
				    this.skeleton_joints[j].getAbsZvector().y+",z:"+
				    this.skeleton_joints[j].getAbsZvector().z+"};";

		txt += "this.skeleton_joints["+j+"].setabscoords(temp1, temp2, temp3);";

		//txt+"delete temp1;delete temp2;delete temp3;";

		txt += "this.skeleton_joints["+j+"].child = [";
		for(i=0;i<this.skeleton_joints[j].child.length-1;i++)
		{txt += ""+this.skeleton_joints[j].child[i]+",";}
		txt += ""+this.skeleton_joints[j].child[this.skeleton_joints[j].child.length-1]+"];";
	}
	txt += "this.calAllAbsPos(0);this.calAllRelVec(0);";

	txt += "bi = 0;";bi=0;
	for(bi=0;bi<this.array_of_bones.length;bi++)
	{
		pj = this.array_of_bones[bi].pj;
		cj = this.array_of_bones[bi].cj; 

		txt += "this.array_of_bones[bi] = { <bi/>";

		txt += "name : '"+this.array_of_bones[bi].name+"',<br/>";
		txt += "index : "+bi+", <br/>";
		txt += "pj : "+this.array_of_bones[bi].pj+",<br/>";
		txt += "cj : "+this.array_of_bones[bi].cj+",<br/>";
		txt += "length: -1,<br/>";
		txt += "skel:this,<br/>";
		txt += "vector:0,Xvector:0,Zvector:0,left_hand:false,<br/>";
		txt += "calLength : calBoneLength, <br/>";
		txt += "getLength : getBoneLength,<br/>";
		txt += "controlled : [-1], <br/>";

		txt += "addControlled : addBoneControlled,<br/>";
		txt += "deleteControlled : deleteBoneControlled,<br/>";
		txt += "followed :false, <br/>";
		txt += "lastVertex : -1, <br/>";
		txt += "calVertexData : calVertexData,<br/>";
		txt += "calVertexData_v2 : calVertexData_v2,<br/>";

		txt += "addSelfToJoint : addSelfToJoint}; <br/>";

		txt += "this.array_of_bones[bi].addSelfToJoint(this.skeleton_joints["+pj+"]); <br/>";
		txt += "this.array_of_bones[bi].addSelfToJoint(this.skeleton_joints["+cj+"]); <br/>";
		txt += "this.array_of_bones[bi].calLength(this); ";

		txt += "bi++; <br/><br/>";
	}


	document.write(txt);
}





function buildonebyone()
{

	upper_abs = new Joint(false);
	upper_abs.jointname = "upper abs";
	upper_abs.motionstep = 0.2;
	upper_abs.spinstep = 0.2;
	//this.skeleton_joints[0].child = [1, 3];
	upper_abs.setAbsPosition(31.97953730953703, 30, -49.29951027886902, 0);
	temp1 = new Point3D(-0.9667981925794609, 0, -0.2555411020268315);
	temp2 = new Point3D(0, 1, 0);
	temp3 = new Point3D(-0.2555411020268315, 0, 0.9667981925794609);
	upper_abs.setabscoords(temp1, temp2, temp3);
	delete temp1;
	delete temp2;
	delete temp3;

	this.addjointtoskel(upper_abs,"no parent",0);//√

	chest = new Joint(false); //left hand
	chest.setAbsPosition(32.490619513590694, 39, -51.23310666402794, 0);
	chest.setRelPosition(0, 9, -2, 0);
	temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
	temp2 = new Point3D(0, 1, 0);
	temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
	chest.setabscoords(temp1, temp2, temp3);
	delete temp1;
	delete temp2;
	delete temp3;
	temp1 = new Point3D(1, 0, 0);
	temp2 = new Point3D(0, 1, 0);
	temp3 = new Point3D(0, 0, 1);
	chest.setrelcoords(temp1, temp2, temp3);
	delete temp1;
	delete temp2;
	delete temp3;

	chest.jointname = "chest";
	chest.motionstep = 0.2;
	chest.spinstep = 0.2;

	this.addjointtoskel(chest,"upper abs",0);//√


upper_back = new Joint(false); //left hand
upper_back.setAbsPosition(33.00170171764436, 48, -53.166703049186864, 0);
upper_back.setRelPosition(0, 9, -2, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
upper_back.setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
upper_back.setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
upper_back.jointname = "upper back";
upper_back.motionstep = 0.2;
upper_back.spinstep = 0.2;

	this.addjointtoskel(upper_back,"chest",0);//√


	this.calAllRelVec(0);
}

function buildHumanSkel()
{

this.skeleton_joints = [new Joint(false)]; //left hand
this.skeleton_joints[0].jointname = "upper abs";
this.skeleton_joints[0].index = 0;
this.skeleton_joints[0].parent = -1;
this.skeleton_joints[0].motionstep = 0.2;
this.skeleton_joints[0].spinstep = 0.2;
this.skeleton_joints[0].child = [1, 3];
this.skeleton_joints[0].setAbsPosition(31.97953730953703, 30, -49.29951027886902, 0);
this.skeleton_joints[0].setRelPosition(1, 1, 1, 0);
temp1 = new Point3D(-0.9667981925794609, 0, -0.2555411020268315);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.2555411020268315, 0, 0.9667981925794609);
this.skeleton_joints[0].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 1, 1);
temp2 = new Point3D(1, 1, 1);
temp3 = new Point3D(1, 1, 1);
this.skeleton_joints[0].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[1] = new Joint(false); //left hand
this.skeleton_joints[1].setAbsPosition(32.490619513590694, 39, -51.23310666402794, 0);
this.skeleton_joints[1].setRelPosition(0, 9, -2, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[1].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[1].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[1].jointname = "chest";
this.skeleton_joints[1].index = 1;
this.skeleton_joints[1].parent = 0;
this.skeleton_joints[1].motionstep = 0.2;
this.skeleton_joints[1].spinstep = 0.2;
this.skeleton_joints[1].child = [2];

this.skeleton_joints[2] = new Joint(false); //left hand
this.skeleton_joints[2].setAbsPosition(33.00170171764436, 48, -53.166703049186864, 0);
this.skeleton_joints[2].setRelPosition(0, 9, -2, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[2].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[2].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[2].jointname = "upper back";
this.skeleton_joints[2].index = 2;
this.skeleton_joints[2].parent = 1;
this.skeleton_joints[2].motionstep = 0.2;
this.skeleton_joints[2].spinstep = 0.2;
this.skeleton_joints[2].child = [4, 5, 6];
this.skeleton_joints[3] = new Joint(false); //left hand
this.skeleton_joints[3].setAbsPosition(33.12947226865777, 18.5, -53.650102145476595, 0);
this.skeleton_joints[3].setRelPosition(0, -11.5, -4.5, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[3].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[3].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[3].jointname = "lower abs";
this.skeleton_joints[3].index = 3;
this.skeleton_joints[3].parent = 0;
this.skeleton_joints[3].motionstep = 0.2;
this.skeleton_joints[3].spinstep = 0.2;
this.skeleton_joints[3].child = [10, 11];
this.skeleton_joints[4] = new Joint(false); //left hand
this.skeleton_joints[4].setAbsPosition(33.00170171764436, 57, -53.166703049186864, 0);
this.skeleton_joints[4].setRelPosition(0, 9, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[4].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[4].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[4].jointname = "neck";
this.skeleton_joints[4].index = 4;
this.skeleton_joints[4].parent = 2;
this.skeleton_joints[4].motionstep = 0.2;
this.skeleton_joints[4].spinstep = 0.2;
this.skeleton_joints[4].child = [9];
this.skeleton_joints[5] = new Joint(false); //left hand
this.skeleton_joints[5].setAbsPosition(31.012739116957572, 52, -49.555051380895854, 0);
this.skeleton_joints[5].setRelPosition(1, 4, 4, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[5].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[5].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[5].jointname = "l. shoulder";
this.skeleton_joints[5].index = 5;
this.skeleton_joints[5].parent = 2;
this.skeleton_joints[5].motionstep = 0.2;
this.skeleton_joints[5].spinstep = 0.2;
this.skeleton_joints[5].child = [7];
this.skeleton_joints[6] = new Joint(true); //left hand
this.skeleton_joints[6].setAbsPosition(32.94633550211649, 52, -49.04396917684219, 0);
this.skeleton_joints[6].setRelPosition(-1, 4, 4, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[6].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(-1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[6].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[6].jointname = "r. shoulder";
this.skeleton_joints[6].index = 6;
this.skeleton_joints[6].parent = 2;
this.skeleton_joints[6].motionstep = 0.2;
this.skeleton_joints[6].spinstep = 0.2;
this.skeleton_joints[6].child = [8];
this.skeleton_joints[7] = new Joint(false); //left hand
this.skeleton_joints[7].setAbsPosition(21.462304870201766, 50, -57.251102686493674, 0);
this.skeleton_joints[7].setRelPosition(11.2, -2, -5, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[7].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[7].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[7].jointname = "l. arm";
this.skeleton_joints[7].index = 7;
this.skeleton_joints[7].parent = 5;
this.skeleton_joints[7].motionstep = 0.2;
this.skeleton_joints[7].spinstep = 0.2;
this.skeleton_joints[7].child = [12];
this.skeleton_joints[8] = new Joint(true); //left hand
this.skeleton_joints[8].setAbsPosition(45.05218076914061, 50, -51.01589979703898, 0);
this.skeleton_joints[8].setRelPosition(11.2, -2, -5, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[8].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[8].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[8].jointname = "r. arm";
this.skeleton_joints[8].index = 8;
this.skeleton_joints[8].parent = 6;
this.skeleton_joints[8].motionstep = 0.2;
this.skeleton_joints[8].spinstep = 0.2;
this.skeleton_joints[8].child = [13];
this.skeleton_joints[9] = new Joint(false); //left hand
this.skeleton_joints[9].setAbsPosition(33.00170171764436, 61, -53.166703049186864, 0);
this.skeleton_joints[9].setRelPosition(0, 4, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[9].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[9].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[9].jointname = "upper neck";
this.skeleton_joints[9].index = 9;
this.skeleton_joints[9].parent = 4;
this.skeleton_joints[9].motionstep = 0.2;
this.skeleton_joints[9].spinstep = 0.2;
this.skeleton_joints[9].child = [undefined];
this.skeleton_joints[10] = new Joint(false); //left hand
this.skeleton_joints[10].setAbsPosition(23.917206331388957, 9.299999999999999, -54.01637567855916, 0);
this.skeleton_joints[10].setRelPosition(9, -9.200000000000001, 2, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[10].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[10].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[10].jointname = "l. hip";
this.skeleton_joints[10].index = 10;
this.skeleton_joints[10].parent = 3;
this.skeleton_joints[10].motionstep = 0.2;
this.skeleton_joints[10].spinstep = 0.2;
this.skeleton_joints[10].child = [14];
this.skeleton_joints[11] = new Joint(true); //left hand
this.skeleton_joints[11].setAbsPosition(41.31957379781926, 9.299999999999999, -49.41663584207619, 0);
this.skeleton_joints[11].setRelPosition(-9, -9.200000000000001, 2, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[11].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(-1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[11].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[11].jointname = "r. hip";
this.skeleton_joints[11].index = 11;
this.skeleton_joints[11].parent = 3;
this.skeleton_joints[11].motionstep = 0.2;
this.skeleton_joints[11].spinstep = 0.2;
this.skeleton_joints[11].child = [15];
this.skeleton_joints[12] = new Joint(false); //left hand
this.skeleton_joints[12].setAbsPosition(20.505301294297592, 21.30746666666667, -61.84829140958376, 0);
this.skeleton_joints[12].setRelPosition(2.1, -28.69253333333333, -4.2, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[12].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[12].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[12].jointname = "l. elbow";
this.skeleton_joints[12].index = 12;
this.skeleton_joints[12].parent = 7;
this.skeleton_joints[12].motionstep = 0.2;
this.skeleton_joints[12].spinstep = 0.2;
this.skeleton_joints[12].child = [16];
this.skeleton_joints[13] = new Joint(true); //left hand
this.skeleton_joints[13].setAbsPosition(48.155729602070174, 21.30746666666667, -54.53981589161637, 0);
this.skeleton_joints[13].setRelPosition(2.1, -28.69253333333333, -4.2, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[13].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[13].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[13].jointname = "r. elbow";
this.skeleton_joints[13].index = 13;
this.skeleton_joints[13].parent = 8;
this.skeleton_joints[13].motionstep = 0.2;
this.skeleton_joints[13].spinstep = 0.2;
this.skeleton_joints[13].child = [17];
this.skeleton_joints[14] = new Joint(false); //left hand
this.skeleton_joints[14].setAbsPosition(23.917206331388957, -30.700000000000003, -54.01637567855916, 0);
this.skeleton_joints[14].setRelPosition(0, -40, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[14].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[14].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[14].jointname = "l. knee";
this.skeleton_joints[14].index = 14;
this.skeleton_joints[14].parent = 10;
this.skeleton_joints[14].motionstep = 0.2;
this.skeleton_joints[14].spinstep = 0.2;
this.skeleton_joints[14].child = [18];
this.skeleton_joints[15] = new Joint(true); //left hand
this.skeleton_joints[15].setAbsPosition(41.31957379781926, -30.700000000000003, -49.41663584207619, 0);

this.skeleton_joints[15].setRelPosition(0, -40, 0, 0);

temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[15].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[15].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[15].jointname = "r. knee";
this.skeleton_joints[15].index = 15;
this.skeleton_joints[15].parent = 11;
this.skeleton_joints[15].motionstep = 0.2;
this.skeleton_joints[15].spinstep = 0.2;
this.skeleton_joints[15].child = [19];
this.skeleton_joints[16] = new Joint(false); //left hand
this.skeleton_joints[16].setAbsPosition(20.505301294297592, 9.907466666666672, -61.84829140958376, 0);

this.skeleton_joints[16].setRelPosition(0, -11.399999999999999, 0, 0);

temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[16].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[16].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[16].jointname = "l. hand";
this.skeleton_joints[16].index = 16;
this.skeleton_joints[16].parent = 12;
this.skeleton_joints[16].motionstep = 0.2;
this.skeleton_joints[16].spinstep = 0.2;
this.skeleton_joints[16].child = [20, 21, 22, 23, 24];
this.skeleton_joints[17] = new Joint(true); //left hand
this.skeleton_joints[17].setAbsPosition(48.155729602070174, 9.907466666666672, -54.53981589161637, 0);
this.skeleton_joints[17].setRelPosition(0, -11.399999999999999, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[17].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[17].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[17].jointname = "r. hand";
this.skeleton_joints[17].index = 17;
this.skeleton_joints[17].parent = 13;
this.skeleton_joints[17].motionstep = 0.2;
this.skeleton_joints[17].spinstep = 0.2;
this.skeleton_joints[17].child = [25, 26, 27, 28, 29];

this.skeleton_joints[18] = new Joint(false); //left hand
this.skeleton_joints[18].setAbsPosition(23.917206331388957, -65.31538461538462, -54.01637567855916, 0);
this.skeleton_joints[18].setRelPosition(0, -34.61538461538461, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[18].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[18].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[18].jointname = "l. foot";
this.skeleton_joints[18].index = 18;
this.skeleton_joints[18].parent = 14;
this.skeleton_joints[18].motionstep = 0.2;
this.skeleton_joints[18].spinstep = 0.2;
this.skeleton_joints[18].child = [30, 31, 32, 33, 34, 78];
this.skeleton_joints[19] = new Joint(true); //left hand
this.skeleton_joints[19].setAbsPosition(41.31957379781926, -65.31538461538462, -49.41663584207619, 0);
this.skeleton_joints[19].setRelPosition(0, -34.61538461538461, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[19].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[19].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[19].jointname = "r. foot";
this.skeleton_joints[19].index = 19;
this.skeleton_joints[19].parent = 15;
this.skeleton_joints[19].motionstep = 0.2;
this.skeleton_joints[19].spinstep = 0.2;
this.skeleton_joints[19].child = [35, 36, 37, 38, 39, 79];
this.skeleton_joints[20] = new Joint(false); //left hand
this.skeleton_joints[20].setAbsPosition(22.285573018240417, 6.9074666666666715, -60.75713028998242, 0);
this.skeleton_joints[20].setRelPosition(-2, -3, 0.6, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[20].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[20].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[20].jointname = "l. hand 1st finger";
this.skeleton_joints[20].index = 20;
this.skeleton_joints[20].parent = 16;
this.skeleton_joints[20].motionstep = 0.2;
this.skeleton_joints[20].spinstep = 0.2;
this.skeleton_joints[20].child = [40];
this.skeleton_joints[21] = new Joint(false); //left hand
this.skeleton_joints[21].setAbsPosition(20.73869591011328, 5.707466666666671, -61.16599605322535, 0);
this.skeleton_joints[21].setRelPosition(-0.4, -4.2, 0.6, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[21].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[21].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[21].jointname = "l. hand 2nd finger";
this.skeleton_joints[21].index = 21;
this.skeleton_joints[21].parent = 16;
this.skeleton_joints[21].motionstep = 0.2;
this.skeleton_joints[21].spinstep = 0.2;
this.skeleton_joints[21].child = [41];
this.skeleton_joints[22] = new Joint(false); //left hand
this.skeleton_joints[22].setAbsPosition(19.38517844050203, 5.507466666666671, -61.52375359606291, 0);
this.skeleton_joints[22].setRelPosition(1, -4.4, 0.6, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[22].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[22].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[22].jointname = "l. hand 3rd finger";
this.skeleton_joints[22].index = 22;
this.skeleton_joints[22].parent = 16;
this.skeleton_joints[22].motionstep = 0.2;
this.skeleton_joints[22].spinstep = 0.2;
this.skeleton_joints[22].child = [42];
this.skeleton_joints[23] = new Joint(false); //left hand
this.skeleton_joints[23].setAbsPosition(18.611739886438464, 5.707466666666671, -61.72818647768438, 0);
this.skeleton_joints[23].setRelPosition(1.7999999999999998, -4.2, 0.6, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[23].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[23].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[23].jointname = "l. hand 4th finger";
this.skeleton_joints[23].index = 23;
this.skeleton_joints[23].parent = 16;
this.skeleton_joints[23].motionstep = 0.2;
this.skeleton_joints[23].spinstep = 0.2;
this.skeleton_joints[23].child = [43];
this.skeleton_joints[24] = new Joint(false); //left hand
this.skeleton_joints[24].setAbsPosition(17.644941693859003, 5.9074666666666715, -61.98372757971121, 0);
this.skeleton_joints[24].setRelPosition(2.8000000000000003, -4, 0.6, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[24].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[24].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[24].jointname = "l. hand 5th finger";
this.skeleton_joints[24].index = 24;
this.skeleton_joints[24].parent = 16;
this.skeleton_joints[24].motionstep = 0.2;
this.skeleton_joints[24].spinstep = 0.2;
this.skeleton_joints[24].child = [44];
this.skeleton_joints[25] = new Joint(true); //left hand
this.skeleton_joints[25].setAbsPosition(46.068808555695156, 6.9074666666666715, -54.470819180122355, 0);
this.skeleton_joints[25].setRelPosition(-2, -3, 0.6, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[25].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[25].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[25].jointname = "r. hand 1st finger";
this.skeleton_joints[25].index = 25;
this.skeleton_joints[25].parent = 17;
this.skeleton_joints[25].motionstep = 0.2;
this.skeleton_joints[25].spinstep = 0.2;
this.skeleton_joints[25].child = [45];
this.skeleton_joints[26] = new Joint(true); //left hand
this.skeleton_joints[26].setAbsPosition(47.61568566382229, 5.707466666666671, -54.061953416879426, 0);
this.skeleton_joints[26].setRelPosition(-0.4, -4.2, 0.6, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[26].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[26].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[26].jointname = "r. hand 2nd finger";
this.skeleton_joints[26].index = 26;
this.skeleton_joints[26].parent = 17;
this.skeleton_joints[26].motionstep = 0.2;
this.skeleton_joints[26].spinstep = 0.2;
this.skeleton_joints[26].child = [46];
this.skeleton_joints[27] = new Joint(true); //left hand
this.skeleton_joints[27].setAbsPosition(48.96920313343354, 5.507466666666671, -53.704195874041865, 0);
this.skeleton_joints[27].setRelPosition(1, -4.4, 0.6, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[27].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[27].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[27].jointname = "r. hand 3rd finger";
this.skeleton_joints[27].index = 27;
this.skeleton_joints[27].parent = 17;
this.skeleton_joints[27].motionstep = 0.2;
this.skeleton_joints[27].spinstep = 0.2;
this.skeleton_joints[27].child = [47];
this.skeleton_joints[28] = new Joint(true); //left hand
this.skeleton_joints[28].setAbsPosition(49.742641687497105, 5.707466666666671, -53.4997629924204, 0);
this.skeleton_joints[28].setRelPosition(1.7999999999999998, -4.2, 0.6, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[28].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[28].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[28].jointname = "r. hand 4th finger";
this.skeleton_joints[28].index = 28;
this.skeleton_joints[28].parent = 17;
this.skeleton_joints[28].motionstep = 0.2;
this.skeleton_joints[28].spinstep = 0.2;
this.skeleton_joints[28].child = [48];
this.skeleton_joints[29] = new Joint(true); //left hand
this.skeleton_joints[29].setAbsPosition(50.709439880076566, 5.9074666666666715, -53.24422189039357, 0);
this.skeleton_joints[29].setRelPosition(2.8000000000000003, -4, 0.6, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[29].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[29].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[29].jointname = "r. hand 5th finger";
this.skeleton_joints[29].index = 29;
this.skeleton_joints[29].parent = 17;
this.skeleton_joints[29].motionstep = 0.2;
this.skeleton_joints[29].spinstep = 0.2;
this.skeleton_joints[29].child = [49];
this.skeleton_joints[30] = new Joint(false); //left hand
this.skeleton_joints[30].setAbsPosition(23.171028769257685, -65.31538461538462, -41.80149872274123, 0);
this.skeleton_joints[30].setRelPosition(-2.4, 0, 12, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[30].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[30].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[30].jointname = "l. leg 1st finger";
this.skeleton_joints[30].index = 30;
this.skeleton_joints[30].parent = 18;
this.skeleton_joints[30].motionstep = 0.2;
this.skeleton_joints[30].spinstep = 0.2;
this.skeleton_joints[30].child = [68];
this.skeleton_joints[31] = new Joint(false); //left hand
this.skeleton_joints[31].setAbsPosition(22.01087093816233, -65.31538461538462, -42.10814804517342, 0);
this.skeleton_joints[31].setRelPosition(-1.2, 0, 12, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[31].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[31].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[31].jointname = "l. leg 2nd finger";
this.skeleton_joints[31].index = 31;
this.skeleton_joints[31].parent = 18;
this.skeleton_joints[31].motionstep = 0.2;
this.skeleton_joints[31].spinstep = 0.2;
this.skeleton_joints[31].child = [70];
this.skeleton_joints[32] = new Joint(false); //left hand
this.skeleton_joints[32].setAbsPosition(20.85071310706698, -65.31538461538462, -42.41479736760562, 0);
this.skeleton_joints[32].setRelPosition(0, 0, 12, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[32].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[32].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[32].jointname = "l. leg 3rd finger";
this.skeleton_joints[32].index = 32;
this.skeleton_joints[32].parent = 18;
this.skeleton_joints[32].motionstep = 0.2;
this.skeleton_joints[32].spinstep = 0.2;
this.skeleton_joints[32].child = [72];
this.skeleton_joints[33] = new Joint(false); //left hand
this.skeleton_joints[33].setAbsPosition(19.690555275971626, -65.31538461538462, -42.72144669003782, 0);
this.skeleton_joints[33].setRelPosition(1.2, 0, 12, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[33].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[33].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[33].jointname = "l. leg 4th finger";
this.skeleton_joints[33].index = 33;
this.skeleton_joints[33].parent = 18;
this.skeleton_joints[33].motionstep = 0.2;
this.skeleton_joints[33].spinstep = 0.2;
this.skeleton_joints[33].child = [74];
this.skeleton_joints[34] = new Joint(false); //left hand
this.skeleton_joints[34].setAbsPosition(18.53039744487627, -65.31538461538462, -43.028096012470016, 0);
this.skeleton_joints[34].setRelPosition(2.4, 0, 12, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[34].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[34].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[34].jointname = "l. leg 5th finger";
this.skeleton_joints[34].index = 34;
this.skeleton_joints[34].parent = 18;
this.skeleton_joints[34].motionstep = 0.2;
this.skeleton_joints[34].spinstep = 0.2;
this.skeleton_joints[34].child = [76];
this.skeleton_joints[35] = new Joint(true); //left hand
this.skeleton_joints[35].setAbsPosition(40.57339623568799, -65.31538461538462, -37.20175888625826, 0);
this.skeleton_joints[35].setRelPosition(2.4, 0, 12, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[35].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[35].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[35].jointname = "r. leg 1st finger";
this.skeleton_joints[35].index = 35;
this.skeleton_joints[35].parent = 19;
this.skeleton_joints[35].motionstep = 0.2;
this.skeleton_joints[35].spinstep = 0.2;
this.skeleton_joints[35].child = [69];
this.skeleton_joints[36] = new Joint(true); //left hand
this.skeleton_joints[36].setAbsPosition(39.41323840459263, -65.31538461538462, -37.508408208690454, 0);
this.skeleton_joints[36].setRelPosition(1.2, 0, 12, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[36].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[36].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[36].jointname = "r. leg 2nd finger";
this.skeleton_joints[36].index = 36;
this.skeleton_joints[36].parent = 19;
this.skeleton_joints[36].motionstep = 0.2;
this.skeleton_joints[36].spinstep = 0.2;
this.skeleton_joints[36].child = [71];
this.skeleton_joints[37] = new Joint(true); //left hand
this.skeleton_joints[37].setAbsPosition(38.25308057349728, -65.31538461538462, -37.815057531122655, 0);
this.skeleton_joints[37].setRelPosition(0, 0, 12, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[37].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[37].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[37].jointname = "r. leg 3rd finger";
this.skeleton_joints[37].index = 37;
this.skeleton_joints[37].parent = 19;
this.skeleton_joints[37].motionstep = 0.2;
this.skeleton_joints[37].spinstep = 0.2;
this.skeleton_joints[37].child = [73];
this.skeleton_joints[38] = new Joint(true); //left hand
this.skeleton_joints[38].setAbsPosition(37.092922742401925, -65.31538461538462, -38.121706853554855, 0);
this.skeleton_joints[38].setRelPosition(-1.2, 0, 12, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[38].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[38].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[38].jointname = "r. leg 4th finger";
this.skeleton_joints[38].index = 38;
this.skeleton_joints[38].parent = 19;
this.skeleton_joints[38].motionstep = 0.2;
this.skeleton_joints[38].spinstep = 0.2;
this.skeleton_joints[38].child = [75];
this.skeleton_joints[39] = new Joint(true); //left hand
this.skeleton_joints[39].setAbsPosition(35.93276491130658, -65.31538461538462, -38.42835617598705, 0);
this.skeleton_joints[39].setRelPosition(-2.4, 0, 12, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[39].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[39].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[39].jointname = "r. leg 5th finger";
this.skeleton_joints[39].index = 39;
this.skeleton_joints[39].parent = 19;
this.skeleton_joints[39].motionstep = 0.2;
this.skeleton_joints[39].spinstep = 0.2;
this.skeleton_joints[39].child = [77];
this.skeleton_joints[40] = new Joint(false); //left hand
this.skeleton_joints[40].setAbsPosition(22.285573018240417, 5.4074666666666715, -60.75713028998242, 0);
this.skeleton_joints[40].setRelPosition(0, -1.5, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[40].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[40].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[40].jointname = "l. hand 1st finger 1st fringe";
this.skeleton_joints[40].index = 40;
this.skeleton_joints[40].parent = 20;
this.skeleton_joints[40].motionstep = 0.2;
this.skeleton_joints[40].spinstep = 0.2;
this.skeleton_joints[40].child = [50];
this.skeleton_joints[41] = new Joint(false); //left hand
this.skeleton_joints[41].setAbsPosition(20.73869591011328, 4.207466666666671, -61.16599605322535, 0);
this.skeleton_joints[41].setRelPosition(0, -1.5, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[41].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[41].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[41].jointname = "l. hand 2nd finger 1st fringe";
this.skeleton_joints[41].index = 41;
this.skeleton_joints[41].parent = 21;
this.skeleton_joints[41].motionstep = 0.2;
this.skeleton_joints[41].spinstep = 0.2;
this.skeleton_joints[41].child = [51];
this.skeleton_joints[42] = new Joint(false); //left hand
this.skeleton_joints[42].setAbsPosition(19.38517844050203, 4.007466666666671, -61.52375359606291, 0);
this.skeleton_joints[42].setRelPosition(0, -1.5, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[42].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[42].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[42].jointname = "l. hand 3rd finger 1st fringe";
this.skeleton_joints[42].index = 42;
this.skeleton_joints[42].parent = 22;
this.skeleton_joints[42].motionstep = 0.2;
this.skeleton_joints[42].spinstep = 0.2;
this.skeleton_joints[42].child = [52];
this.skeleton_joints[43] = new Joint(false); //left hand
this.skeleton_joints[43].setAbsPosition(18.611739886438464, 4.207466666666671, -61.72818647768438, 0);
this.skeleton_joints[43].setRelPosition(0, -1.5, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[43].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[43].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[43].jointname = "l. hand 4th finger 1st fringe";
this.skeleton_joints[43].index = 43;
this.skeleton_joints[43].parent = 23;
this.skeleton_joints[43].motionstep = 0.2;
this.skeleton_joints[43].spinstep = 0.2;
this.skeleton_joints[43].child = [53];
this.skeleton_joints[44] = new Joint(false); //left hand
this.skeleton_joints[44].setAbsPosition(17.644941693859003, 4.807466666666672, -61.98372757971121, 0);
this.skeleton_joints[44].setRelPosition(0, -1.1, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[44].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[44].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[44].jointname = "l. hand 5th finger 1st fringe";
this.skeleton_joints[44].index = 44;
this.skeleton_joints[44].parent = 24;
this.skeleton_joints[44].motionstep = 0.2;
this.skeleton_joints[44].spinstep = 0.2;
this.skeleton_joints[44].child = [54];
this.skeleton_joints[45] = new Joint(true); //left hand
this.skeleton_joints[45].setAbsPosition(46.068808555695156, 5.4074666666666715, -54.470819180122355, 0);
this.skeleton_joints[45].setRelPosition(0, -1.5, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[45].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[45].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[45].jointname = "r. hand 1st finger 1st fringe";
this.skeleton_joints[45].index = 45;
this.skeleton_joints[45].parent = 25;
this.skeleton_joints[45].motionstep = 0.2;
this.skeleton_joints[45].spinstep = 0.2;
this.skeleton_joints[45].child = [55];
this.skeleton_joints[46] = new Joint(true); //left hand
this.skeleton_joints[46].setAbsPosition(47.61568566382229, 4.207466666666671, -54.061953416879426, 0);
this.skeleton_joints[46].setRelPosition(0, -1.5, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[46].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[46].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[46].jointname = "r. hand 2nd finger 1st fringe";
this.skeleton_joints[46].index = 46;
this.skeleton_joints[46].parent = 26;
this.skeleton_joints[46].motionstep = 0.2;
this.skeleton_joints[46].spinstep = 0.2;
this.skeleton_joints[46].child = [56];
this.skeleton_joints[47] = new Joint(true); //left hand
this.skeleton_joints[47].setAbsPosition(48.96920313343354, 4.007466666666671, -53.704195874041865, 0);
this.skeleton_joints[47].setRelPosition(0, -1.5, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[47].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[47].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[47].jointname = "r. hand 3rd finger 1st fringe";
this.skeleton_joints[47].index = 47;
this.skeleton_joints[47].parent = 27;
this.skeleton_joints[47].motionstep = 0.2;
this.skeleton_joints[47].spinstep = 0.2;
this.skeleton_joints[47].child = [57];
this.skeleton_joints[48] = new Joint(true); //left hand
this.skeleton_joints[48].setAbsPosition(49.742641687497105, 4.207466666666671, -53.4997629924204, 0);
this.skeleton_joints[48].setRelPosition(0, -1.5, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[48].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[48].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[48].jointname = "r. hand 4th finger 1st fringe";
this.skeleton_joints[48].index = 48;
this.skeleton_joints[48].parent = 28;
this.skeleton_joints[48].motionstep = 0.2;
this.skeleton_joints[48].spinstep = 0.2;
this.skeleton_joints[48].child = [58];
this.skeleton_joints[49] = new Joint(true); //left hand
this.skeleton_joints[49].setAbsPosition(50.709439880076566, 4.807466666666672, -53.24422189039357, 0);
this.skeleton_joints[49].setRelPosition(0, -1.1, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[49].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[49].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[49].jointname = "r. hand 5th finger 1st fringe";
this.skeleton_joints[49].index = 49;
this.skeleton_joints[49].parent = 29;
this.skeleton_joints[49].motionstep = 0.2;
this.skeleton_joints[49].spinstep = 0.2;
this.skeleton_joints[49].child = [59];
this.skeleton_joints[50] = new Joint(false); //left hand
this.skeleton_joints[50].setAbsPosition(22.285573018240417, 4.1574666666666715, -60.75713028998242, 0);
this.skeleton_joints[50].setRelPosition(0, -1.25, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[50].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[50].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[50].jointname = "l. hand 1st finger 2nd fringe";
this.skeleton_joints[50].index = 50;
this.skeleton_joints[50].parent = 40;
this.skeleton_joints[50].motionstep = 0.2;
this.skeleton_joints[50].spinstep = 0.2;
this.skeleton_joints[50].child = [undefined];
this.skeleton_joints[51] = new Joint(false); //left hand
this.skeleton_joints[51].setAbsPosition(20.73869591011328, 2.807466666666671, -61.16599605322535, 0);
this.skeleton_joints[51].setRelPosition(0, -1.4000000000000001, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[51].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[51].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[51].jointname = "l. hand 2nd finger 2nd fringe";
this.skeleton_joints[51].index = 51;
this.skeleton_joints[51].parent = 41;
this.skeleton_joints[51].motionstep = 0.2;
this.skeleton_joints[51].spinstep = 0.2;
this.skeleton_joints[51].child = [60];
this.skeleton_joints[52] = new Joint(false); //left hand
this.skeleton_joints[52].setAbsPosition(19.38517844050203, 2.607466666666671, -61.52375359606291, 0);
this.skeleton_joints[52].setRelPosition(0, -1.4000000000000001, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[52].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[52].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[52].jointname = "l. hand 3rd finger 2nd fringe";
this.skeleton_joints[52].index = 52;
this.skeleton_joints[52].parent = 42;
this.skeleton_joints[52].motionstep = 0.2;
this.skeleton_joints[52].spinstep = 0.2;
this.skeleton_joints[52].child = [61];
this.skeleton_joints[53] = new Joint(false); //left hand
this.skeleton_joints[53].setAbsPosition(18.611739886438464, 2.807466666666671, -61.72818647768438, 0);
this.skeleton_joints[53].setRelPosition(0, -1.4000000000000001, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[53].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[53].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[53].jointname = "l. hand 4th finger 2nd fringe";
this.skeleton_joints[53].index = 53;
this.skeleton_joints[53].parent = 43;
this.skeleton_joints[53].motionstep = 0.2;
this.skeleton_joints[53].spinstep = 0.2;
this.skeleton_joints[53].child = [62];
this.skeleton_joints[54] = new Joint(false); //left hand
this.skeleton_joints[54].setAbsPosition(17.644941693859003, 3.507466666666672, -61.98372757971121, 0);
this.skeleton_joints[54].setRelPosition(0, -1.3, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[54].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[54].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[54].jointname = "l. hand 5th finger 2nd fringe";
this.skeleton_joints[54].index = 54;
this.skeleton_joints[54].parent = 44;
this.skeleton_joints[54].motionstep = 0.2;
this.skeleton_joints[54].spinstep = 0.2;
this.skeleton_joints[54].child = [63];
this.skeleton_joints[55] = new Joint(true); //left hand
this.skeleton_joints[55].setAbsPosition(46.068808555695156, 4.1574666666666715, -54.470819180122355, 0);
this.skeleton_joints[55].setRelPosition(0, -1.25, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[55].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[55].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[55].jointname = "r. hand 1st finger 2nd fringe";
this.skeleton_joints[55].index = 55;
this.skeleton_joints[55].parent = 45;
this.skeleton_joints[55].motionstep = 0.2;
this.skeleton_joints[55].spinstep = 0.2;
this.skeleton_joints[55].child = [undefined];
this.skeleton_joints[56] = new Joint(true); //left hand
this.skeleton_joints[56].setAbsPosition(47.61568566382229, 2.807466666666671, -54.061953416879426, 0);
this.skeleton_joints[56].setRelPosition(0, -1.4000000000000001, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[56].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[56].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[56].jointname = "r. hand 2nd finger 2nd fringe";
this.skeleton_joints[56].index = 56;
this.skeleton_joints[56].parent = 46;
this.skeleton_joints[56].motionstep = 0.2;
this.skeleton_joints[56].spinstep = 0.2;
this.skeleton_joints[56].child = [64];
this.skeleton_joints[57] = new Joint(true); //left hand
this.skeleton_joints[57].setAbsPosition(48.96920313343354, 2.607466666666671, -53.704195874041865, 0);
this.skeleton_joints[57].setRelPosition(0, -1.4000000000000001, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[57].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[57].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[57].jointname = "r. hand 3rd finger 2nd fringe";
this.skeleton_joints[57].index = 57;
this.skeleton_joints[57].parent = 47;
this.skeleton_joints[57].motionstep = 0.2;
this.skeleton_joints[57].spinstep = 0.2;
this.skeleton_joints[57].child = [65];
this.skeleton_joints[58] = new Joint(true); //left hand
this.skeleton_joints[58].setAbsPosition(49.742641687497105, 2.807466666666671, -53.4997629924204, 0);
this.skeleton_joints[58].setRelPosition(0, -1.4000000000000001, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[58].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[58].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[58].jointname = "r. hand 4th finger 2nd fringe";
this.skeleton_joints[58].index = 58;
this.skeleton_joints[58].parent = 48;
this.skeleton_joints[58].motionstep = 0.2;
this.skeleton_joints[58].spinstep = 0.2;
this.skeleton_joints[58].child = [66];
this.skeleton_joints[59] = new Joint(true); //left hand
this.skeleton_joints[59].setAbsPosition(50.709439880076566, 3.507466666666672, -53.24422189039357, 0);
this.skeleton_joints[59].setRelPosition(0, -1.3, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[59].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[59].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[59].jointname = "r. hand 5th finger 2nd fringe";
this.skeleton_joints[59].index = 59;
this.skeleton_joints[59].parent = 49;
this.skeleton_joints[59].motionstep = 0.2;
this.skeleton_joints[59].spinstep = 0.2;
this.skeleton_joints[59].child = [67];
this.skeleton_joints[60] = new Joint(false); //left hand
this.skeleton_joints[60].setAbsPosition(20.73869591011328, 1.907466666666671, -61.16599605322535, 0);
this.skeleton_joints[60].setRelPosition(0, -0.8999999999999999, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[60].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[60].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[60].jointname = "l. hand 2nd finger 3rd fringe";
this.skeleton_joints[60].index = 60;
this.skeleton_joints[60].parent = 51;
this.skeleton_joints[60].motionstep = 0.2;
this.skeleton_joints[60].spinstep = 0.2;
this.skeleton_joints[60].child = [undefined];
this.skeleton_joints[61] = new Joint(false); //left hand
this.skeleton_joints[61].setAbsPosition(19.38517844050203, 1.707466666666671, -61.52375359606291, 0);
this.skeleton_joints[61].setRelPosition(0, -0.8999999999999999, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[61].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[61].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[61].jointname = "l. hand 3rd finger 3rd fringe";
this.skeleton_joints[61].index = 61;
this.skeleton_joints[61].parent = 52;
this.skeleton_joints[61].motionstep = 0.2;
this.skeleton_joints[61].spinstep = 0.2;
this.skeleton_joints[61].child = [undefined];
this.skeleton_joints[62] = new Joint(false); //left hand
this.skeleton_joints[62].setAbsPosition(18.611739886438464, 1.907466666666671, -61.72818647768438, 0);
this.skeleton_joints[62].setRelPosition(0, -0.8999999999999999, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[62].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[62].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[62].jointname = "l. hand 4th finger 3rd fringe";
this.skeleton_joints[62].index = 62;
this.skeleton_joints[62].parent = 53;
this.skeleton_joints[62].motionstep = 0.2;
this.skeleton_joints[62].spinstep = 0.2;
this.skeleton_joints[62].child = [undefined];
this.skeleton_joints[63] = new Joint(false); //left hand
this.skeleton_joints[63].setAbsPosition(17.644941693859003, 2.607466666666672, -61.98372757971121, 0);
this.skeleton_joints[63].setRelPosition(0, -0.8999999999999999, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[63].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[63].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[63].jointname = "l. hand 5th finger 3rd fringe";
this.skeleton_joints[63].index = 63;
this.skeleton_joints[63].parent = 54;
this.skeleton_joints[63].motionstep = 0.2;
this.skeleton_joints[63].spinstep = 0.2;
this.skeleton_joints[63].child = [undefined];
this.skeleton_joints[64] = new Joint(true); //left hand
this.skeleton_joints[64].setAbsPosition(47.61568566382229, 1.907466666666671, -54.061953416879426, 0);
this.skeleton_joints[64].setRelPosition(0, -0.8999999999999999, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[64].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[64].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[64].jointname = "r. hand 2nd finger 3rd fringe";
this.skeleton_joints[64].index = 64;
this.skeleton_joints[64].parent = 56;
this.skeleton_joints[64].motionstep = 0.2;
this.skeleton_joints[64].spinstep = 0.2;
this.skeleton_joints[64].child = [undefined];
this.skeleton_joints[65] = new Joint(true); //left hand
this.skeleton_joints[65].setAbsPosition(48.96920313343354, 1.707466666666671, -53.704195874041865, 0);
this.skeleton_joints[65].setRelPosition(0, -0.8999999999999999, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[65].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[65].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[65].jointname = "r. hand 3rd finger 3rd fringe";
this.skeleton_joints[65].index = 65;
this.skeleton_joints[65].parent = 57;
this.skeleton_joints[65].motionstep = 0.2;
this.skeleton_joints[65].spinstep = 0.2;
this.skeleton_joints[65].child = [undefined];
this.skeleton_joints[66] = new Joint(true); //left hand
this.skeleton_joints[66].setAbsPosition(49.742641687497105, 1.907466666666671, -53.4997629924204, 0);
this.skeleton_joints[66].setRelPosition(0, -0.8999999999999999, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[66].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[66].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[66].jointname = "r. hand 4th finger 3rd fringe";
this.skeleton_joints[66].index = 66;
this.skeleton_joints[66].parent = 58;
this.skeleton_joints[66].motionstep = 0.2;
this.skeleton_joints[66].spinstep = 0.2;
this.skeleton_joints[66].child = [undefined];
this.skeleton_joints[67] = new Joint(true); //left hand
this.skeleton_joints[67].setAbsPosition(50.709439880076566, 2.607466666666672, -53.24422189039357, 0);
this.skeleton_joints[67].setRelPosition(0, -0.8999999999999999, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[67].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(0, 0, 1);
this.skeleton_joints[67].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[67].jointname = "r. hand 5th finger 3rd fringe";
this.skeleton_joints[67].index = 67;
this.skeleton_joints[67].parent = 59;
this.skeleton_joints[67].motionstep = 0.2;
this.skeleton_joints[67].spinstep = 0.2;
this.skeleton_joints[67].child = [undefined];
this.skeleton_joints[68] = new Joint(false); //left hand
this.skeleton_joints[68].setAbsPosition(23.141841697543896, -65.31538461538462, -41.302351334843856, 0);
this.skeleton_joints[68].setRelPosition(0, -0.5, 0, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[68].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, 1);
temp3 = new Point3D(0, -1, 0);
this.skeleton_joints[68].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[68].jointname = "l. leg 1st finger 1st fringe";
this.skeleton_joints[68].index = 68;
this.skeleton_joints[68].parent = 30;
this.skeleton_joints[68].motionstep = 0.2;
this.skeleton_joints[68].spinstep = 0.2;
this.skeleton_joints[68].child = [undefined];
this.skeleton_joints[69] = new Joint(true); //left hand
this.skeleton_joints[69].setAbsPosition(40.544209163974195, -65.31538461538462, -36.70261149836089, 0);
this.skeleton_joints[69].setRelPosition(0, -0.5, 0, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[69].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, 1);
temp3 = new Point3D(0, -1, 0);
this.skeleton_joints[69].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[69].jointname = "r. leg 1st finger 1st fringe";
this.skeleton_joints[69].index = 69;
this.skeleton_joints[69].parent = 35;
this.skeleton_joints[69].motionstep = 0.2;
this.skeleton_joints[69].spinstep = 0.2;
this.skeleton_joints[69].child = [undefined];
this.skeleton_joints[70] = new Joint(false); //left hand
this.skeleton_joints[70].setAbsPosition(21.97584645210578, -65.11538461538461, -41.50917117969657, 0);
this.skeleton_joints[70].setRelPosition(0, -0.6, 0.2, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[70].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, 1);
temp3 = new Point3D(0, -1, 0);
this.skeleton_joints[70].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[70].jointname = "l. leg 2nd finger 1st fringe";
this.skeleton_joints[70].index = 70;
this.skeleton_joints[70].parent = 31;
this.skeleton_joints[70].motionstep = 0.2;
this.skeleton_joints[70].spinstep = 0.2;
this.skeleton_joints[70].child = [undefined];
this.skeleton_joints[71] = new Joint(true); //left hand
this.skeleton_joints[71].setAbsPosition(39.38405133287884, -65.11538461538461, -37.00926082079308, 0);
this.skeleton_joints[71].setRelPosition(0, -0.5, 0.2, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[71].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, 1);
temp3 = new Point3D(0, -1, 0);
this.skeleton_joints[71].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[71].jointname = "r. leg 2nd finger 1st fringe";
this.skeleton_joints[71].index = 71;
this.skeleton_joints[71].parent = 36;
this.skeleton_joints[71].motionstep = 0.2;
this.skeleton_joints[71].spinstep = 0.2;
this.skeleton_joints[71].child = [undefined];
this.skeleton_joints[72] = new Joint(false); //left hand
this.skeleton_joints[72].setAbsPosition(20.81568862101043, -65.11538461538461, -41.81582050212877, 0);
this.skeleton_joints[72].setRelPosition(0, -0.6, 0.2, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[72].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, 1);
temp3 = new Point3D(0, -1, 0);
this.skeleton_joints[72].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[72].jointname = "l. leg 3rd finger 1st fringe";
this.skeleton_joints[72].index = 72;
this.skeleton_joints[72].parent = 32;
this.skeleton_joints[72].motionstep = 0.2;
this.skeleton_joints[72].spinstep = 0.2;
this.skeleton_joints[72].child = [undefined];
this.skeleton_joints[73] = new Joint(true); //left hand
this.skeleton_joints[73].setAbsPosition(38.21805608744073, -65.11538461538461, -37.216080665645805, 0);
this.skeleton_joints[73].setRelPosition(0, -0.6, 0.2, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[73].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, 1);
temp3 = new Point3D(0, -1, 0);
this.skeleton_joints[73].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[73].jointname = "r. leg 3rd finger 1st fringe";
this.skeleton_joints[73].index = 73;
this.skeleton_joints[73].parent = 37;
this.skeleton_joints[73].motionstep = 0.2;
this.skeleton_joints[73].spinstep = 0.2;
this.skeleton_joints[73].child = [undefined];
this.skeleton_joints[74] = new Joint(false); //left hand
this.skeleton_joints[74].setAbsPosition(19.655530789915076, -65.11538461538461, -42.12246982456097, 0);
this.skeleton_joints[74].setRelPosition(0, -0.6, 0.2, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[74].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, 1);
temp3 = new Point3D(0, -1, 0);
this.skeleton_joints[74].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[74].jointname = "l. leg 4th finger 1st fringe";
this.skeleton_joints[74].index = 74;
this.skeleton_joints[74].parent = 33;
this.skeleton_joints[74].motionstep = 0.2;
this.skeleton_joints[74].spinstep = 0.2;
this.skeleton_joints[74].child = [undefined];
this.skeleton_joints[75] = new Joint(true); //left hand
this.skeleton_joints[75].setAbsPosition(37.057898256345375, -65.11538461538461, -37.522729988078005, 0);
this.skeleton_joints[75].setRelPosition(0, -0.6, 0.2, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[75].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, 1);
temp3 = new Point3D(0, -1, 0);
this.skeleton_joints[75].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[75].jointname = "r. leg 4th finger 1st fringe";
this.skeleton_joints[75].index = 75;
this.skeleton_joints[75].parent = 38;
this.skeleton_joints[75].motionstep = 0.2;
this.skeleton_joints[75].spinstep = 0.2;
this.skeleton_joints[75].child = [undefined];
this.skeleton_joints[76] = new Joint(false); //left hand
this.skeleton_joints[76].setAbsPosition(18.512885201847997, -65.21538461538462, -42.72860757973159, 0);
this.skeleton_joints[76].setRelPosition(0, -0.3, 0.1, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[76].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, 1);
temp3 = new Point3D(0, -1, 0);
this.skeleton_joints[76].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[76].jointname = "l. leg 5th finger 1st fringe";
this.skeleton_joints[76].index = 76;
this.skeleton_joints[76].parent = 34;
this.skeleton_joints[76].motionstep = 0.2;
this.skeleton_joints[76].spinstep = 0.2;
this.skeleton_joints[76].child = [undefined];
this.skeleton_joints[77] = new Joint(true); //left hand
this.skeleton_joints[77].setAbsPosition(35.915252668278306, -65.21538461538462, -38.12886774324862, 0);
this.skeleton_joints[77].setRelPosition(0, -0.3, 0.1, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0, 1, 0);
temp3 = new Point3D(-0.25554110202683156, 0, 0.9667981925794611);
this.skeleton_joints[77].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, 1);
temp3 = new Point3D(0, -1, 0);
this.skeleton_joints[77].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[77].jointname = "r. leg 5th finger 1st fringe";
this.skeleton_joints[77].index = 77;
this.skeleton_joints[77].parent = 39;
this.skeleton_joints[77].motionstep = 0.2;
this.skeleton_joints[77].spinstep = 0.2;
this.skeleton_joints[77].child = [undefined];
this.skeleton_joints[78] = new Joint(false); //left hand
this.skeleton_joints[78].setAbsPosition(24.17274743341579, -66.06538461538462, -54.98317387113862, 0);
this.skeleton_joints[78].setRelPosition(0, -0.75, -1, 0);
temp1 = new Point3D(-0.9667981925794611, 0, -0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[78].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[78].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[78].jointname = "l. anckle";
this.skeleton_joints[78].index = 78;
this.skeleton_joints[78].parent = 18;
this.skeleton_joints[78].motionstep = 0.2;
this.skeleton_joints[78].spinstep = 0.2;
this.skeleton_joints[78].child = [undefined];
this.skeleton_joints[79] = new Joint(true); //left hand
this.skeleton_joints[79].setAbsPosition(41.57511489984609, -66.06538461538462, -50.38343403465565, 0);
this.skeleton_joints[79].setRelPosition(0, -0.75, -1, 0);
temp1 = new Point3D(0.9667981925794611, 0, 0.25554110202683156);
temp2 = new Point3D(0.25554110202683156, 0, -0.9667981925794611);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[79].setabscoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
temp1 = new Point3D(1, 0, 0);
temp2 = new Point3D(0, 0, -1);
temp3 = new Point3D(0, 1, 0);
this.skeleton_joints[79].setrelcoords(temp1, temp2, temp3);
delete temp1;
delete temp2;
delete temp3;
this.skeleton_joints[79].jointname = "r. anckle";
this.skeleton_joints[79].index = 79;
this.skeleton_joints[79].parent = 19;
this.skeleton_joints[79].motionstep = 0.2;
this.skeleton_joints[79].spinstep = 0.2;
this.skeleton_joints[79].child = [undefined];



//	this.skeleton_joints[2].motion.current.value.relcoords.origin.y += 10;	
//	this.calAllAbsPos(2);
/*
	graphics_manager.scene_objs[0].skel.skeleton_joints[15].motion.current.value.relcoords.origin.y += 1;
	graphics_manager.scene_objs[0].skel.skeleton_joints[18].motion.current.value.relcoords.origin.y += 1;
	graphics_manager.scene_objs[0].skel.skeleton_joints[19].motion.current.value.relcoords.origin.y += 1;

	graphics_manager.scene_objs[1].skel.skeleton_joints[14].motion.current.value.relcoords.origin.y += 1;
	graphics_manager.scene_objs[1].skel.skeleton_joints[15].motion.current.value.relcoords.origin.y += 1;
	graphics_manager.scene_objs[1].skel.skeleton_joints[18].motion.current.value.relcoords.origin.y += 1;
	graphics_manager.scene_objs[1].skel.skeleton_joints[19].motion.current.value.relcoords.origin.y += 1;


	graphics_manager.scene_objs[0].skel.calAllAbsPos(0);
	graphics_manager.scene_objs[1].skel.calAllAbsPos(0);
*/


this.calAllRelVec(0);

//this.poses();
}


function straightstand()
{
this.saveframe();
}

function straightstandrotate()
{
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();
this.rotateYac(0);
this.saveframe();

}

function manikanstand()
{
this.rotateZac(3);
this.rotateZac(3);
this.rotateXcw(8);
this.rotateXac(8);
this.rotateXac(8);
this.rotateXac(8);
this.rotateZcw(10);
this.rotateZcw(10);
this.rotateXcw(10);
this.rotateXcw(10);
this.rotateZac(11);
this.rotateZac(11);
this.rotateXcw(13);
this.rotateXcw(13);
this.rotateXcw(13);
this.rotateXcw(13);
this.rotateXcw(13);
this.rotateXcw(13);
this.rotateXcw(13);
this.rotateXcw(14);
this.rotateXac(14);
this.rotateXac(14);
this.rotateXac(14);
this.rotateXac(14);
this.rotateXac(14);
this.saveframe();
}

function modelerstand()
{

this.rotateZcw(7);
this.rotateZcw(7);
this.rotateZcw(7);
this.rotateZcw(7);
this.rotateZcw(7);
this.rotateZcw(7);
this.rotateZac(8);
this.rotateZcw(8);
this.rotateZcw(8);
this.rotateZcw(8);
this.rotateZcw(8);
this.rotateZcw(8);
this.rotateZcw(8);
this.rotateZcw(8);
this.saveframe();

}

function rotatemanikanstand()
{
	this.manikan_stand();// = manikanstand;
	this.straight_stand_rotate();// = straightstandrotate;
	//this.manikan_stand_rotate = rotatemanikanstand;
 
}


function refinedstand()
{this.rotateZcw(7);
this.rotateZcw(8);
this.rotateYac(8);
this.rotateYcw(8);
this.rotateYcw(8);
this.rotateYcw(8);
this.rotateYcw(8);
this.rotateYcw(8);
this.rotateYcw(8);
this.rotateYcw(8);
this.rotateYcw(8);
this.rotateYcw(8);
this.rotateYcw(8);
this.rotateYcw(8);
this.rotateZac(8);
this.rotateYac(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateYcw(7);
this.rotateZcw(7);
this.rotateZac(7);
this.rotateZac(7);
this.saveframe();
}


function try_stand()
{

this.rotateXcw(13);
this.rotateXcw(13);
this.rotateXcw(13);
this.rotateXcw(13);
this.rotateXcw(13);
this.rotateXcw(8);
this.rotateXcw(8);
this.rotateXcw(8);
this.rotateXac(8);
this.rotateXac(8);
this.rotateXac(8);
this.rotateXac(8);
this.rotateXac(8);
this.rotateXac(8);
this.rotateXac(8);
this.rotateZac(8);
this.rotateXcw(8);
this.rotateXac(8);
this.rotateXac(8);
this.rotateXcw(10);
this.rotateXcw(10);
this.rotateXcw(10);
this.rotateXac(14);
this.rotateXac(14);
this.rotateXac(14);
this.rotateXac(14);
this.rotateXac(14);
this.rotateZac(3);
this.rotateZcw(3);
this.rotateZcw(3);
this.rotateZac(11);
this.rotateZac(11);
this.rotateZcw(11);
this.rotateZcw(11);
this.rotateZcw(11);
this.rotateZcw(10);
this.rotateZac(10);
this.rotateZac(10);
this.rotateZac(10);
this.rotateZcw(10);
this.saveframe();

}