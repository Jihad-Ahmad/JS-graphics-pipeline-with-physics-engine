
function initBoxSkel()
{
	// this = skeleton object;
	// this.

	root = new Joint(false);
	root.jointname = "root";
	root.motionstep = 0.2;
	root.spinstep = 0.2;

	//this.skeleton_joints[0].child = [1, 3];
	root.setAbsPosition(20, 30, -50, 0);
	temp1 = new Point3D(-0.9667981925794609, 0, -0.2555411020268315);
	temp2 = new Point3D(0, 1, 0);
	temp3 = new Point3D(-0.2555411020268315, 0, 0.9667981925794609);
	root.setabscoords(temp1, temp2, temp3);
	delete temp1;
	delete temp2;
	delete temp3;


	this.addjointtoskel(root,"no parent",0);//√


	//for fancy movement complex rotations
	// the actual joint that holds the vertices
	// the fancy motion: rotate this around up continuously and root also rotates around some axis
	fancy = new Joint(false);
	fancy.jointname = "fancy";
	fancy.motionstep = 0.2;
	fancy.spinstep = 0.07;

	//this.skeleton_joints[0].child = [1, 3];
	fancy.setAbsPosition(20, 39, -48, 0);
	fancy.setRelPosition(0, 9, -2, 0);
	temp1 = new Point3D(-0.9667981925794609, 0, -0.2555411020268315);
	temp2 = new Point3D(0, 1, 0);
	temp3 = new Point3D(-0.2555411020268315, 0, 0.9667981925794609);
	fancy.setabscoords(temp1, temp2, temp3);
	delete temp1;
	delete temp2;
	delete temp3;

	this.addjointtoskel(fancy,"root",0);//√
	this.calAllRelVec(0);


}


function initBallSkel()
{
	root = new Joint(false);
	root.jointname = "root";
	root.motionstep = 0.2;
	root.spinstep = 0.07;

	//console.log("CREATING BALL ROOT JOINT");

	//this.skeleton_joints[0].child = [1, 3];
	root.setAbsPosition(-20, 40, -50, 0);
	temp1 = new Point3D(-0.9667981925794609, 0, -0.2555411020268315);
	temp2 = new Point3D(0, 1, 0);
	temp3 = new Point3D(-0.2555411020268315, 0, 0.9667981925794609);
	root.setabscoords(temp1, temp2, temp3);
	delete temp1;
	delete temp2;
	delete temp3;

	this.addjointtoskel(root,"no parent",0);//√

}


function buildBoxMesh(objptr,skel,array_of_vertices, array_of_lines)
{
	joint = skel.skeleton_joints[skel.findindex("fancy")];
	//alert("joint of fancy of index"+joint.jointname);
	var vi = 0;
	if(array_of_vertices[0]==-1){array_of_vertices[0] = new Vertex(joint);}
	else
	{vi = array_of_vertices.length;array_of_vertices[vi]= new Vertex(joint);}

	//array_of_vertices[vi].pos_data.getCurrentNodeValue().joint_weight = 1;
	array_of_vertices[vi].objPtr = objptr;

	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.x = 14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.y = 14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.z = 14;

	array_of_vertices[vi].tx = 0;
	array_of_vertices[vi].ty = 0;

	//68, 42, 8
	array_of_vertices[vi].red=68;// = red;
	array_of_vertices[vi].green=42;// = green;
	array_of_vertices[vi].blue=8;// = blue;
	array_of_vertices[vi].alpha=255;// = alpha;
	
	array_of_vertices[vi].calAbsPos();
	//hove no idea how to calculate a normal & tangent of a vertex in a mesh now
	array_of_vertices[vi].calAbsVectors();//??
	joint.addControlled(vi);
	//this.material_props;//may be will call it by objPtr;
	l1v1 = l4v1 = l12v1 = vi;
	vi++;


	array_of_vertices[vi]= new Vertex(joint);
	array_of_vertices[vi].objPtr = objptr;

	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.x = -14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.y = 14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.z = 14;

	array_of_vertices[vi].tx = 1;
	array_of_vertices[vi].ty = 0;

	//68, 42, 8
	array_of_vertices[vi].red=68;// = red;
	array_of_vertices[vi].green=42;// = green;
	array_of_vertices[vi].blue=8;// = blue;
	array_of_vertices[vi].alpha=255;// = alpha;
	
	array_of_vertices[vi].calAbsPos();
	//hove no idea how to calculate a normal & tangent of a vertex in a mesh now
	array_of_vertices[vi].calAbsVectors();//??
	joint.addControlled(vi);
	//this.material_props;//may be will call it by objPtr;

	l1v2 = l2v1 = l9v1 = vi;
	vi++;


	array_of_vertices[vi]= new Vertex(joint);
	array_of_vertices[vi].objPtr = objptr;

	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.x = 14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.y = -14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.z = 14;

	array_of_vertices[vi].tx = 0;
	array_of_vertices[vi].ty = 1;

	//68, 42, 8
	array_of_vertices[vi].red=68;// = red;
	array_of_vertices[vi].green=42;// = green;
	array_of_vertices[vi].blue=8;// = blue;
	array_of_vertices[vi].alpha=255;// = alpha;
	
	array_of_vertices[vi].calAbsPos();
	//hove no idea how to calculate a normal & tangent of a vertex in a mesh now
	array_of_vertices[vi].calAbsVectors();//??
	joint.addControlled(vi);
	//this.material_props;//may be will call it by objPtr;
	l4v2 = l11v1 = l3v1= vi;
	vi++;

	array_of_vertices[vi]= new Vertex(joint);
	array_of_vertices[vi].objPtr = objptr;

	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.x = -14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.y = -14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.z = 14;

	array_of_vertices[vi].tx = 1;
	array_of_vertices[vi].ty = 1;

	//68, 42, 8
	array_of_vertices[vi].red=68;// = red;
	array_of_vertices[vi].green=42;// = green;
	array_of_vertices[vi].blue=8;// = blue;
	array_of_vertices[vi].alpha=255;// = alpha;
	
	array_of_vertices[vi].calAbsPos();
	//hove no idea how to calculate a normal & tangent of a vertex in a mesh now
	array_of_vertices[vi].calAbsVectors();//??
	joint.addControlled(vi);
	//this.material_props;//may be will call it by objPtr;
	l2v2 = l3v2 = l10v1 =  vi;
	vi++;

	

	array_of_vertices[vi]= new Vertex(joint);
	array_of_vertices[vi].objPtr = objptr;

	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.x = 14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.y = 14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.z = -14;

	array_of_vertices[vi].tx = 0;
	array_of_vertices[vi].ty = 0;

	//68, 42, 8
	array_of_vertices[vi].red=68;// = red;
	array_of_vertices[vi].green=42;// = green;
	array_of_vertices[vi].blue=8;// = blue;
	array_of_vertices[vi].alpha=255;// = alpha;
	
	array_of_vertices[vi].calAbsPos();
	//hove no idea how to calculate a normal & tangent of a vertex in a mesh now
	array_of_vertices[vi].calAbsVectors();//??
	joint.addControlled(vi);
	//this.material_props;//may be will call it by objPtr;
	l12v2 = l8v1 = l5v1 =  vi;

	vi++;
	

	array_of_vertices[vi]= new Vertex(joint);
	array_of_vertices[vi].objPtr = objptr;

	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.x = -14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.y = 14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.z = -14;

	array_of_vertices[vi].tx = 1;
	array_of_vertices[vi].ty = 0;

	//68, 42, 8
	array_of_vertices[vi].red=68;// = red;
	array_of_vertices[vi].green=42;// = green;
	array_of_vertices[vi].blue=8;// = blue;
	array_of_vertices[vi].alpha=255;// = alpha;
	
	array_of_vertices[vi].calAbsPos();
	//hove no idea how to calculate a normal & tangent of a vertex in a mesh now
	array_of_vertices[vi].calAbsVectors();//??
	joint.addControlled(vi);
	//this.material_props;//may be will call it by objPtr;
	
	l9v2 = l5v2 = l6v1 = vi;
	vi++;

	array_of_vertices[vi]= new Vertex(joint);
	array_of_vertices[vi].objPtr = objptr;

	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.x = 14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.y = -14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.z = -14;

	array_of_vertices[vi].tx = 0;
	array_of_vertices[vi].ty = 1;

	//68, 42, 8
	array_of_vertices[vi].red=68;// = red;
	array_of_vertices[vi].green=42;// = green;
	array_of_vertices[vi].blue=8;// = blue;
	array_of_vertices[vi].alpha=255;// = alpha;
	
	array_of_vertices[vi].calAbsPos();
	//hove no idea how to calculate a normal & tangent of a vertex in a mesh now
	array_of_vertices[vi].calAbsVectors();//??
	joint.addControlled(vi);
	//this.material_props;//may be will call it by objPtr;

	l11v2 = l8v2 = l7v1 = vi;
	vi++;



	array_of_vertices[vi]= new Vertex(joint);
	array_of_vertices[vi].objPtr = objptr;

	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.x = -14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.y = -14;
	array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.z = -14;

	array_of_vertices[vi].tx = 1;
	array_of_vertices[vi].ty = 1;

	//68, 42, 8
	array_of_vertices[vi].red=68;// = red;
	array_of_vertices[vi].green=42;// = green;
	array_of_vertices[vi].blue=8;// = blue;
	array_of_vertices[vi].alpha=255;// = alpha;
	
	array_of_vertices[vi].calAbsPos();
	//hove no idea how to calculate a normal & tangent of a vertex in a mesh now
	array_of_vertices[vi].calAbsVectors();//??
	joint.addControlled(vi);
	//this.material_props;//may be will call it by objPtr;

	l10v2 = l6v2 = l7v2 = vi;


	if( array_of_lines[0] == -1){ array_of_lines[0] = new Line(l1v1,l1v2);}
	else
	{ array_of_lines[array_of_lines.length]= new Line(l1v1,l1v2); }
	l1 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l2v1,l2v2);
	l2 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l3v1,l3v2);
	l3 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l4v1,l4v2);
	l4 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l5v1,l5v2);
	l5 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l6v1,l6v2);
	l6 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l7v1,l7v2);
	l7 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l8v1,l8v2);
	l8 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l9v1,l9v2);
	l9 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l10v1,l10v2);
	l10 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l11v1,l11v2);
	l11 = array_of_lines.length-1;

	array_of_lines[array_of_lines.length]= new Line(l12v1,l12v2);
	l12 = array_of_lines.length-1;

	
}



function buildBallMesh(objptr,skel, array_of_vertices, array_of_lines)
{
buildRegularBall(objptr,skel, array_of_vertices, array_of_lines);
}




function buildRegularBall(objptr,skel, array_of_vertices, array_of_lines)
{


joint = skel.skeleton_joints[skel.findindex("root")];
	vi = 0;li=0;qi=0;
	if(array_of_vertices[0]==-1){vi=0;}
	else
	{vi = array_of_vertices.length;}
	start_v = vi;
	if(array_of_lines[0]==-1){li=0;}
	else
	{li = array_of_lines.length;}
	start_l = li;
	
	l1i=0;l2i=0;l3i=0;l4i=0;

	overall_first_vi = vi;

	line1 = [-1];
	line2 = [-1];
	line3 = [-1];
	line4 = [-1];

	radius = 3;
	rad1 = 0;//radius of current circle
	angl1 = 0; // angle to draw each vertex
	angl2 = Math.PI/2;
	distance = 3;//from joint in its up direction, is the center of a circle in a parallel plane to xz
	tx = 0; ty = 0;
	for(i=0;i<13;i++)
	{
		first_vi = vi;
		for(j=0;j<12;j++)
		{

				array_of_vertices[vi]= new Vertex(joint);
				array_of_vertices[vi].objPtr = objptr;
				array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.x = 3*rad1*Math.cos(angl1);
				array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.y = 3*distance;
				array_of_vertices[vi].pos_data.getCurrentNodeValue().relcoord.origin.z = 3*rad1*Math.sin(angl1);

				array_of_vertices[vi].tx = tx;
				array_of_vertices[vi].ty = ty;

				//68, 42, 8
				array_of_vertices[vi].red=68;// = red;
				array_of_vertices[vi].green=42;// = green;
				array_of_vertices[vi].blue=8;// = blue;
				array_of_vertices[vi].alpha=255;// = alpha;

				array_of_vertices[vi].calAbsPos();

				//hove no idea how to calculate a normal & tangent of a vertex in a mesh now
				array_of_vertices[vi].calAbsVectors();//??
				joint.addControlled(vi);


			angl1 += Math.PI/6;// 2 Pi / 12
			tx += 1/12;

			v1i = vi;
			vi++;
			v2i = vi;

			if(j<=10)
			{
				array_of_lines[li]= new Line(v1i,v2i);
				line1[l1i] = li;l1i++;
				if(i>0){line3[l3i] = li;l3i++;}
				li++;
				
			}
			if(j==11)
			{
				array_of_lines[li]= new Line(v1i,first_vi);
				if(i>0){line3[l3i] = li;l3i++;}
				li++;
			}

		}
		angl1 = 0;
		if(i<=5){angl2 += Math.PI/12;}//// 2 Pi / 12
		else {angl2 -= Math.PI/12;}
		rad1 = radius*Math.cos(angl2);
		if(i<=5){distance = radius*Math.sin(angl2);}
		else {distance = -radius*Math.sin(angl2);}
		ty += 1/12;
		tx = 0;
	}


	end = start_v + 144;//13*12;
	for(i=overall_first_vi;i<end;i++)
	{
		array_of_lines[li]= new Line(i,i+12);
		line2[l2i] = li;l2i++;
		line4[l4i] = li;l4i++;
		li++;

	}

	

	
}

