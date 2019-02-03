function box_ball_1_viewport()//scene inititialize in graphics manager, this function is to be put in
{
	//alert("entered GraphicsAppMnger.InitializeScene()");
	//construct a cube and a ball to test the whole graphics pipeline efficiency , 
	
	
	// the ball
	this.scene_objs = [new SceneObj(this)];
	this.scene_objs[0].skel.init = initBallSkel;
	this.scene_objs[0].skel.poses = null;
	// initialize mesh holder too
	this.scene_objs[0].mesh.build = buildBallMesh;
	this.scene_objs[0].skel.init();
	this.scene_objs[0].mesh.build(this.scene_objs[0],this.scene_objs[0].skel,this.vertices_pool,this.lines_pool,this.quads_pool);
	
	this.scene_objs[0].skel.skeleton_joints[0].motion.current.value.abscoords.origin.y -= 75;

	//physics parameters
	this.scene_objs[0].collision_param = 9;//radius of this particular ball
	// gravity 
	this.scene_objs[0].acceleration.x = 0;
	this.scene_objs[0].acceleration.y = -.0000098;
	this.scene_objs[0].acceleration.z = 0;
	//velocity already initialized with zeros, position already initialized

	
	//scene object 1 is ground and walls to be colliding obstacles.
	// just create room.js including skel definition for the walls and gound and buildMesh for the room
	// having the vertices,lines and quads of the room
	// add the room object here and call its functions
	this.scene_objs[1] = new SceneObj(this);
	this.scene_objs[1].skel.init = initRoomSkel;
	this.scene_objs[1].skel.poses = null;
	// initialize mesh holder too
	this.scene_objs[1].mesh.build = buildRoomMesh;
	this.scene_objs[1].skel.init();
	this.scene_objs[1].mesh.build(this.scene_objs[1],this.scene_objs[1].skel,this.vertices_pool,this.lines_pool,this.quads_pool);	
	this.scene_objs[1].collision_param = 100;//half edge of room



	// another ball
	this.scene_objs[2] = new SceneObj(this);
	this.scene_objs[2].skel.init = initBallSkel;
	this.scene_objs[2].skel.poses = null;
	// initialize mesh holder too
	this.scene_objs[2].mesh.build = buildBallMesh;
	this.scene_objs[2].skel.init();
	this.scene_objs[2].mesh.build(this.scene_objs[2],this.scene_objs[2].skel,this.vertices_pool,this.lines_pool,this.quads_pool);
	this.scene_objs[2].textureData = this.scene_objs[0].textureData;

	this.scene_objs[2].skel.skeleton_joints[0].motion.current.value.abscoords.origin.y += 75;
	this.scene_objs[2].skel.skeleton_joints[0].motion.current.value.abscoords.origin.x += 75;

	//physics parameters
	this.scene_objs[2].collision_param = 9;//radius of this particular ball
	// gravity 
	this.scene_objs[2].acceleration.x = 0;
	this.scene_objs[2].acceleration.y = -.0000098;
	this.scene_objs[2].acceleration.z = 0;
	//velocity already initialized with zeros, position already initialized


	// another ball
	this.scene_objs[3] = new SceneObj(this);
	this.scene_objs[3].skel.init = initBallSkel;
	this.scene_objs[3].skel.poses = null;
	// initialize mesh holder too
	this.scene_objs[3].mesh.build = buildBallMesh;
	this.scene_objs[3].skel.init();
	this.scene_objs[3].mesh.build(this.scene_objs[3],this.scene_objs[3].skel,this.vertices_pool,this.lines_pool,this.quads_pool);
	this.scene_objs[3].textureData = this.scene_objs[0].textureData;

	this.scene_objs[3].skel.skeleton_joints[0].motion.current.value.abscoords.origin.y += 50;
	this.scene_objs[3].skel.skeleton_joints[0].motion.current.value.abscoords.origin.x += 20;

	//physics parameters
	this.scene_objs[3].collision_param = 9;//radius of this particular ball
	// gravity 
	this.scene_objs[3].acceleration.x = 0;
	this.scene_objs[3].acceleration.y = -.0000098;
	this.scene_objs[3].acceleration.z = 0;
	//velocity already initialized with zeros, position already initialized



	// another ball
	this.scene_objs[4] = new SceneObj(this);
	this.scene_objs[4].skel.init = initBallSkel;
	this.scene_objs[4].skel.poses = null;
	// initialize mesh holder too
	this.scene_objs[4].mesh.build = buildBallMesh;
	this.scene_objs[4].skel.init();
	this.scene_objs[4].mesh.build(this.scene_objs[4],this.scene_objs[4].skel,this.vertices_pool,this.lines_pool,this.quads_pool);
	this.scene_objs[4].textureData = this.scene_objs[0].textureData;

	this.scene_objs[4].skel.skeleton_joints[0].motion.current.value.abscoords.origin.z += 20;
	this.scene_objs[4].skel.skeleton_joints[0].motion.current.value.abscoords.origin.x += 20;

	//physics parameters
	this.scene_objs[4].collision_param = 9;//radius of this particular ball
	// gravity 
	this.scene_objs[4].acceleration.x = 0;
	this.scene_objs[4].acceleration.y = -.0000098;
	this.scene_objs[4].acceleration.z = 0;
	//velocity already initialized with zeros, position already initialized



	// another ball
	this.scene_objs[5] = new SceneObj(this);
	this.scene_objs[5].skel.init = initBallSkel;
	this.scene_objs[5].skel.poses = null;
	// initialize mesh holder too
	this.scene_objs[5].mesh.build = buildBallMesh;
	this.scene_objs[5].skel.init();
	this.scene_objs[5].mesh.build(this.scene_objs[5],this.scene_objs[5].skel,this.vertices_pool,this.lines_pool,this.quads_pool);
	this.scene_objs[5].textureData = this.scene_objs[0].textureData;

	this.scene_objs[5].skel.skeleton_joints[0].motion.current.value.abscoords.origin.y -= 20;
	this.scene_objs[5].skel.skeleton_joints[0].motion.current.value.abscoords.origin.z -= 20;

	//physics parameters
	this.scene_objs[5].collision_param = 9;//radius of this particular ball
	// gravity 
	this.scene_objs[5].acceleration.x = 0;
	this.scene_objs[5].acceleration.y = -.0000098;
	this.scene_objs[5].acceleration.z = 0;
	//velocity already initialized with zeros, position already initialized


	// initializing cameras
	this.cameras[0] = new SmartCamera();
	this.cameras[0].motionstep = 5;
	this.cameras[0].setOrigin(-9, -3, 111);
	this.cameras[0].setXvector(-1, 0, 0, 0);
	this.cameras[0].setYvector(0, 1, 0, 0);
	this.cameras[0].setZvector(0, 0, -1, 0);
	this.cameras[0].near_dist=1;
	this.cameras[0].far_dist=1400;
	this.cameras[0].heightf = this.canvas.height;//1/2 height window height or 1/2 height of canvas
	this.cameras[0].aspect_ratio = this.canvas.height//this.canvas.width;//1.32;
	this.cameras[0].frustumheightscale = this.far_dist/this.near_dist;
	
	
	// WORKING! full window view port
	this.cameras[0].viewport.origin_x = 0;
	this.cameras[0].viewport.origin_y = 0;
	this.cameras[0].viewport.width = this.canvas.width;
	this.cameras[0].viewport.height = this.canvas.height;
	this.cameras[0].viewport.whole_win_width = this.canvas.width;
	this.cameras[0].viewport.whole_win_height= this.canvas.height;
	this.cameras[0].viewport.r1w = 1;
	this.cameras[0].viewport.r1h = 1;
	this.cameras[0].perspective = true;
	
	//forces applied to ball scene object
	this.scene_objs[0].appliedForces[0] = [permenantForce,gravitational_force,gravitational_force(this.scene_objs[0])];
	this.scene_objs[0].appliedForces[1] = [if_ball_room_collide,if_ball_room_collide];
	this.scene_objs[0].appliedForces[2] = [if_ball_balls_collide,if_ball_balls_collide];

	this.scene_objs[2].appliedForces[0] = [permenantForce,gravitational_force,gravitational_force(this.scene_objs[2])];
	this.scene_objs[2].appliedForces[1] = [if_ball_room_collide,if_ball_room_collide];
	this.scene_objs[2].appliedForces[2] = [if_ball_balls_collide,if_ball_balls_collide];

	this.scene_objs[3].appliedForces[0] = [permenantForce,gravitational_force,gravitational_force(this.scene_objs[3])];
	this.scene_objs[3].appliedForces[1] = [if_ball_room_collide,if_ball_room_collide];
	this.scene_objs[3].appliedForces[2] = [if_ball_balls_collide,if_ball_balls_collide];

	this.scene_objs[4].appliedForces[0] = [permenantForce,gravitational_force,gravitational_force(this.scene_objs[4])];
	this.scene_objs[4].appliedForces[1] = [if_ball_room_collide,if_ball_room_collide];
	this.scene_objs[4].appliedForces[2] = [if_ball_balls_collide,if_ball_balls_collide];

	this.scene_objs[5].appliedForces[0] = [permenantForce,gravitational_force,gravitational_force(this.scene_objs[5])];
	this.scene_objs[5].appliedForces[1] = [if_ball_room_collide,if_ball_room_collide];
	this.scene_objs[5].appliedForces[2] = [if_ball_balls_collide,if_ball_balls_collide];


	this.scene_objs[0].physicsFunction = ballAllPhys;
	this.scene_objs[2].physicsFunction = ballAllPhys;
	this.scene_objs[3].physicsFunction = ballAllPhys;
	this.scene_objs[4].physicsFunction = ballAllPhys;
	this.scene_objs[5].physicsFunction = ballAllPhys;

	// this is called in render physics in the html application button, then returns to empty to render freely
	//this.applyPhysics = ballApplyPhysics;
	//this.setHiddenCanvasRender();

	this.scene_objs[1].physicsFunction = emptyFunction;

}

function ballApplyPhysics()
{
 this.scene_objs[0].physicsFunction(this.scene_objs[0]);
 this.scene_objs[1].physicsFunction(this.scene_objs[1]);
 this.scene_objs[2].physicsFunction(this.scene_objs[2]);
 this.scene_objs[3].physicsFunction(this.scene_objs[3]);
 this.scene_objs[4].physicsFunction(this.scene_objs[4]);
 this.scene_objs[5].physicsFunction(this.scene_objs[5]);
}


function roomTestingMotion(objptr)
{
	//using randome integer from 0 to 5,
	//then call testing[rand_i](0); it contains room's motion function
	rand_i = Math.floor(Math.random()*6);
	switch(rand_i)
	{	
		case 0:this.skel.rotateXcw(0);
		case 1:this.skel.rotateXac(0);
		case 2:this.skel.rotateYcw(0);
		case 3:this.skel.rotateYac(0);
		case 4:this.skel.rotateZcw(0);
		case 5:this.skel.rotateZac(0);

		default:this.skel.rotateXcw(0);
	}
}


//been called each render for object ball
function ballAllPhys(objptr)
{

	//saving a before 
	objbeforex = objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x;
	objbeforey = objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y;
	objbeforez = objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z;

	//get new position according to current velocity
	objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x = (objptr.velocity.x * objptr.time_accum )
	+ objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x;
	objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y = (objptr.velocity.y * objptr.time_accum )
	+ objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y;
	objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z = (objptr.velocity.z * objptr.time_accum )
	+ objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z;


	if(isNaN(objptr.velocity.x)){objptr.velocity.x = 0;console.log("dealing with NaN vel.x");}
	if(isNaN(objptr.velocity.y)){objptr.velocity.y = 0;console.log("dealing with NaN vel.y");}
	if(isNaN(objptr.velocity.z)){objptr.velocity.z = 0;console.log("dealing with NaN vel.z");}

	if(isNaN(objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x))
	{
		objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x = (objptr.velocity.x * objptr.time_accum )
		+ objbeforex;
	}
	if(isNaN(objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y))
	{
		objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y = (objptr.velocity.y * objptr.time_accum )
		+ objbeforey;
	}
	if(isNaN(objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z))
	{
		objptr.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z = (objptr.velocity.z * objptr.time_accum )
		+ objbeforez;
	}


	//if ball room collides
	[collided,f] = objptr.appliedForces[1][0](objptr);
	if(collided)
	{
	objptr.velocity.x = f.x / objptr.mass * objptr.graphics_manager.time_interval;
	objptr.velocity.y = f.y / objptr.mass * objptr.graphics_manager.time_interval;
	objptr.velocity.z = f.z / objptr.mass * objptr.graphics_manager.time_interval;

	}

	if(isNaN(objptr.velocity.x)){objptr.velocity.x = 0;console.log("dealing with NaN vel.x");}
	if(isNaN(objptr.velocity.y)){objptr.velocity.y = 0;console.log("dealing with NaN vel.y");}
	if(isNaN(objptr.velocity.z)){objptr.velocity.z = 0;console.log("dealing with NaN vel.z");}


	//if ball balls collides
	[collided,f] = objptr.appliedForces[2][0](objptr);
	if(collided)
	{
	objptr.velocity.x = f.x / objptr.mass * objptr.graphics_manager.time_interval;
	objptr.velocity.y = f.y / objptr.mass * objptr.graphics_manager.time_interval;
	objptr.velocity.z = f.z / objptr.mass * objptr.graphics_manager.time_interval;
	}

	if(isNaN(objptr.velocity.x)){objptr.velocity.x = 0;console.log("dealing with NaN vel.x");}
	if(isNaN(objptr.velocity.y)){objptr.velocity.y = 0;console.log("dealing with NaN vel.y");}
	if(isNaN(objptr.velocity.z)){objptr.velocity.z = 0;console.log("dealing with NaN vel.z");}



	//update velocity:
	objptr.velocity.x += objptr.acceleration.x * objptr.graphics_manager.time_interval;
	objptr.velocity.y += objptr.acceleration.y * objptr.graphics_manager.time_interval;
	objptr.velocity.z += objptr.acceleration.z * objptr.graphics_manager.time_interval;
	
	objptr.time_accum += objptr.graphics_manager.time_interval;

	if(objptr == null){console.log("ball vanished on ball object physics function");}

}



function gravitational_force(objptr)
{
	return {x:0,y:-.0000098*objptr.mass,z:0};
}



function if_ball_room_collide(objptr)
{

	obj_ball = objptr;
	obj_room = objptr.graphics_manager.scene_objs[1];

	distx = obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x - 
		obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x;
	disty = obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y - 
		obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y;
	distz = obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z - 
		obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z;

	boundary = obj_room.collision_param - obj_ball.collision_param;
	neg_boundary =  0 - boundary;
	outside = false;

	ball_x_comp =distx*obj_room.skel.skeleton_joints[0].getAbsXvector().x + 
	disty*obj_room.skel.skeleton_joints[0].getAbsXvector().y + 
	distz*obj_room.skel.skeleton_joints[0].getAbsXvector().z;

	ball_y_comp = distx*obj_room.skel.skeleton_joints[0].getAbsYvector().x + 
	disty*obj_room.skel.skeleton_joints[0].getAbsYvector().y + 
	distz*obj_room.skel.skeleton_joints[0].getAbsYvector().z;

	ball_z_comp =distx*obj_room.skel.skeleton_joints[0].getAbsZvector().x + 
	disty*obj_room.skel.skeleton_joints[0].getAbsZvector().y + 
	distz*obj_room.skel.skeleton_joints[0].getAbsZvector().z;

	num = 0;x = 0;y=0;z=0;
	neg_normalx = {x:0,y:0,z:0};//+ve or -ve room joint abs vector
	neg_normaly = {x:0,y:0,z:0};//+ve or -ve room joint abs vector
	neg_normalz = {x:0,y:0,z:0};//+ve or -ve room joint abs vector

	step = {x:0,y:0,z:0};

		if( ball_x_comp > 0 && ball_x_comp >= boundary)
		{
			outside = true;num++;x=1;
			neg_normalx = {	x:-obj_room.skel.skeleton_joints[0].getAbsXvector().x,
					y:-obj_room.skel.skeleton_joints[0].getAbsXvector().y,
					z:-obj_room.skel.skeleton_joints[0].getAbsXvector().z
					}; 
			step.x = ball_x_comp - boundary;		
		}
		if( ball_x_comp < 0 && ball_x_comp <= neg_boundary)
		{
			outside = true;num++;x=1;
			neg_normalx = {	x:(obj_room.skel.skeleton_joints[0].getAbsXvector().x),
					y:(obj_room.skel.skeleton_joints[0].getAbsXvector().y),
					z:(obj_room.skel.skeleton_joints[0].getAbsXvector().z),
					}; 

			step.x = 0 - (ball_x_comp - neg_boundary);
	
		}
		if( ball_y_comp > 0 && ball_y_comp >= boundary)
		{
			outside = true;num++;y=1;
			neg_normaly = {	x:-obj_room.skel.skeleton_joints[0].getAbsYvector().x,
					y:-obj_room.skel.skeleton_joints[0].getAbsYvector().y,
					z:-obj_room.skel.skeleton_joints[0].getAbsYvector().z
					}; 
	
			step.y = ball_y_comp - boundary;
		}
		if( ball_y_comp < 0 && ball_y_comp <= neg_boundary)
		{
			outside = true;num++;y=1;
			neg_normaly = {	x:obj_room.skel.skeleton_joints[0].getAbsYvector().x,
					y:obj_room.skel.skeleton_joints[0].getAbsYvector().y,
					z:obj_room.skel.skeleton_joints[0].getAbsYvector().z
					}; 

			step.y = 0 - (ball_y_comp - neg_boundary);
		}
		if( ball_z_comp> 0 && ball_z_comp >= boundary)
		{
			outside = true;num++;z=1;
			neg_normalz = {	x:-obj_room.skel.skeleton_joints[0].getAbsZvector().x,
					y:-obj_room.skel.skeleton_joints[0].getAbsZvector().y,
					z:-obj_room.skel.skeleton_joints[0].getAbsZvector().z
					}; 
	
			step.z = ball_z_comp - boundary;
		}
		if( ball_z_comp < 0 && ball_z_comp <= neg_boundary)
		{
			outside = true;num++;z=1;
			neg_normalz = {	x:obj_room.skel.skeleton_joints[0].getAbsZvector().x,
					y:obj_room.skel.skeleton_joints[0].getAbsZvector().y,
					z:obj_room.skel.skeleton_joints[0].getAbsZvector().z
					}; 
	
			step.z = 0 - (ball_z_comp - neg_boundary);
		}
	
		if(outside == true)
		{

	dist ={x: obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x - 
		obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x,
	       y: obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y - 
		obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y,
	       z: obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z - 
		obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z};

	ball_x_comp = dist.x*obj_room.skel.skeleton_joints[0].getAbsXvector().x + 
	dist.y*obj_room.skel.skeleton_joints[0].getAbsXvector().y + 
	dist.z*obj_room.skel.skeleton_joints[0].getAbsXvector().z;

	ball_y_comp = dist.x*obj_room.skel.skeleton_joints[0].getAbsYvector().x + 
	dist.y*obj_room.skel.skeleton_joints[0].getAbsYvector().y + 
	dist.z*obj_room.skel.skeleton_joints[0].getAbsYvector().z;

	ball_z_comp = dist.x*obj_room.skel.skeleton_joints[0].getAbsZvector().x + 
	dist.y*obj_room.skel.skeleton_joints[0].getAbsZvector().y + 
	dist.z*obj_room.skel.skeleton_joints[0].getAbsZvector().z;

	if( ball_x_comp > 0 && ball_x_comp > boundary){ball_x_comp = boundary; }
	if( ball_x_comp < 0 && ball_x_comp < neg_boundary){ball_x_comp = neg_boundary; }
	if( ball_y_comp > 0 && ball_y_comp > boundary){ball_y_comp = boundary; }
	if( ball_y_comp < 0 && ball_y_comp < neg_boundary){ball_y_comp = neg_boundary; }
	if( ball_z_comp > 0 && ball_z_comp > boundary){ball_z_comp = boundary; }
	if( ball_z_comp < 0 && ball_z_comp < neg_boundary){ball_z_comp = neg_boundary;  }


	obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x = 
	obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x + 
	ball_x_comp * obj_room.skel.skeleton_joints[0].getAbsXvector().x +
	ball_y_comp * obj_room.skel.skeleton_joints[0].getAbsYvector().x +
	ball_z_comp * obj_room.skel.skeleton_joints[0].getAbsZvector().x ;

	obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y = 
	obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y + 
	ball_x_comp * obj_room.skel.skeleton_joints[0].getAbsXvector().y +
	ball_y_comp * obj_room.skel.skeleton_joints[0].getAbsYvector().y +
	ball_z_comp * obj_room.skel.skeleton_joints[0].getAbsZvector().y ;

	obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z = 
	obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z + 
	ball_x_comp * obj_room.skel.skeleton_joints[0].getAbsXvector().z +
	ball_y_comp * obj_room.skel.skeleton_joints[0].getAbsYvector().z +
	ball_z_comp * obj_room.skel.skeleton_joints[0].getAbsZvector().z ;

			
			//velocity dot neg_normal
			v_dot_n_by_2_x = 2* ( neg_normalx.x * obj_ball.velocity.x +
				neg_normalx.y * obj_ball.velocity.y +
				neg_normalx.z * obj_ball.velocity.z);


			//velocity dot neg_normal
			v_dot_n_by_2_y = 2* ( neg_normaly.x * obj_ball.velocity.x +
				neg_normaly.y * obj_ball.velocity.y +
				neg_normaly.z * obj_ball.velocity.z);


			//velocity dot neg_normal
			v_dot_n_by_2_z = 2* ( neg_normalz.x * obj_ball.velocity.x +
				neg_normalz.y * obj_ball.velocity.y +
				neg_normalz.z * obj_ball.velocity.z);


			total = v_dot_n_by_2_x +v_dot_n_by_2_y+v_dot_n_by_2_z;
			xr = v_dot_n_by_2_x / total;
			yr = v_dot_n_by_2_y / total;
			zr = v_dot_n_by_2_z / total;

			// velocity vector reflection
			rx ={x:x*xr*(obj_ball.velocity.x - v_dot_n_by_2_x * neg_normalx.x),
			    y:x*xr*(obj_ball.velocity.y - v_dot_n_by_2_x * neg_normalx.y),
			    z:x*xr*(obj_ball.velocity.z - v_dot_n_by_2_x * neg_normalx.z)};

			// velocity vector reflection
			ry ={x:y*yr*(obj_ball.velocity.x - v_dot_n_by_2_y * neg_normaly.x),
			    y:y*yr*(obj_ball.velocity.y - v_dot_n_by_2_y * neg_normaly.y),
			    z:y*yr*(obj_ball.velocity.z - v_dot_n_by_2_y * neg_normaly.z)};

			// velocity vector reflection
			rz ={x:z*zr*(obj_ball.velocity.x - v_dot_n_by_2_z * neg_normalz.x),
			    y:z*zr*(obj_ball.velocity.y - v_dot_n_by_2_z * neg_normalz.y),
			    z:z*zr*(obj_ball.velocity.z - v_dot_n_by_2_z * neg_normalz.z)};

			if(obj_ball == null){console.log("ball vanished on ball room collide check");}

			if(num==0){num=1;}
			if(obj_ball.graphics_manager.time_interval == 0){obj_ball.graphics_manager.time_interval = 1;}

			return [true,{x:((obj_ball.mass*(rx.x+ry.x+rz.x)/num)/(obj_ball.graphics_manager.time_interval  )),
			y:((obj_ball.mass*(rx.y+ry.y+rz.y)/num)/(obj_ball.graphics_manager.time_interval )),
			z:((obj_ball.mass*(rx.z+ry.z+rz.z)/num)/(obj_ball.graphics_manager.time_interval  ))}];
		}
	
	return [false,null];	
}


function if_ball_ball_specific_collide(obj_ball1,obj_ball2)
{

	distx = obj_ball1.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x - 
		obj_ball2.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x;
	disty = obj_ball1.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y - 
		obj_ball2.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y;
	distz = obj_ball1.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z - 
		obj_ball2.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z;

	boundary = obj_ball1.collision_param + obj_ball2.collision_param;

	distance = Math.sqrt(distx*distx + disty*disty + distz*distz);
	norm_dist = {x:distx/distance,y:disty/distance,z:distz/distance};

	if(distance<boundary)
	{
		obj_ball1.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x = 
		obj_ball2.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x + 
		boundary * norm_dist.x; 

		obj_ball1.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y = 
		obj_ball2.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y + 
		boundary * norm_dist.y; 

		obj_ball1.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z = 
		obj_ball2.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z + 
		boundary * norm_dist.z;


			//velocity dot neg_normal
			v_dot_n_by_2 = 2* ( norm_dist.x * obj_ball.velocity.x +
				norm_dist.y * obj_ball.velocity.y +
				norm_dist.z * obj_ball.velocity.z);

			// velocity vector reflection
			r ={x:(obj_ball.velocity.x - v_dot_n_by_2 * norm_dist.x),
			    y:(obj_ball.velocity.y - v_dot_n_by_2 * norm_dist.y),
			    z:(obj_ball.velocity.z - v_dot_n_by_2 * norm_dist.z)};

			if(obj_ball.graphics_manager.time_interval == 0){obj_ball.graphics_manager.time_interval = 1;}

			return [true,{x:((obj_ball.mass*(r.x))/(obj_ball.graphics_manager.time_interval )),
			y:((obj_ball.mass*(r.y))/(obj_ball.graphics_manager.time_interval )),
			z:((obj_ball.mass*(r.z))/(obj_ball.graphics_manager.time_interval  ))}];
	}
	
	return [false,null];	
}


function if_ball_balls_collide(objptr)
{
	obj_ball1 = objptr;obj_ball2=null;obj_ball3=null;obj_ball4=null;obj_ball5=null;
	if(objptr.graphics_manager.scene_objs[0] == objptr)
	{
		obj_ball2 = objptr.graphics_manager.scene_objs[2];
		obj_ball3 = objptr.graphics_manager.scene_objs[3];
		obj_ball4 = objptr.graphics_manager.scene_objs[4];
		obj_ball5 = objptr.graphics_manager.scene_objs[5];
	}
	else if(objptr.graphics_manager.scene_objs[2] == objptr)
	{
		obj_ball2 = objptr.graphics_manager.scene_objs[0];
		obj_ball3 = objptr.graphics_manager.scene_objs[3];
		obj_ball4 = objptr.graphics_manager.scene_objs[4];
		obj_ball5 = objptr.graphics_manager.scene_objs[5];
	}
	else if(objptr.graphics_manager.scene_objs[3] == objptr)
	{
		obj_ball2 = objptr.graphics_manager.scene_objs[2];
		obj_ball3 = objptr.graphics_manager.scene_objs[0];
		obj_ball4 = objptr.graphics_manager.scene_objs[4];
		obj_ball5 = objptr.graphics_manager.scene_objs[5];
	}
	else if(objptr.graphics_manager.scene_objs[4] == objptr)
	{
		obj_ball2 = objptr.graphics_manager.scene_objs[2];
		obj_ball3 = objptr.graphics_manager.scene_objs[3];
		obj_ball4 = objptr.graphics_manager.scene_objs[0];
		obj_ball5 = objptr.graphics_manager.scene_objs[5];
	}
	else
	{
		obj_ball2 = objptr.graphics_manager.scene_objs[2];
		obj_ball3 = objptr.graphics_manager.scene_objs[3];
		obj_ball4 = objptr.graphics_manager.scene_objs[4];
		obj_ball5 = objptr.graphics_manager.scene_objs[0];
	}

	velocity = {x:0,y:0,z:0};r2={x:0,y:0,z:0};r3={x:0,y:0,z:0};r4={x:0,y:0,z:0};r5={x:0,y:0,z:0};
	num = 0;
	[collided2,f2] = if_ball_ball_specific_collide(obj_ball1,obj_ball2);
	if(collided2)
	{
	r2 ={x: f2.x / objptr.mass * objptr.graphics_manager.time_interval,
	     y: f2.y / objptr.mass * objptr.graphics_manager.time_interval,
	     z: f2.z / objptr.mass * objptr.graphics_manager.time_interval};
	    num++;

	}
	[collided3,f3] = if_ball_ball_specific_collide(obj_ball1,obj_ball3);
	if(collided3)
	{
	r3 ={x: f3.x / objptr.mass * objptr.graphics_manager.time_interval,
	     y: f3.y / objptr.mass * objptr.graphics_manager.time_interval,
	     z: f3.z / objptr.mass * objptr.graphics_manager.time_interval};
	    num++;

	}
	[collided4,f4] = if_ball_ball_specific_collide(obj_ball1,obj_ball4);
	if(collided4)
	{
	r4 ={x: f4.x / objptr.mass * objptr.graphics_manager.time_interval,
	     y: f4.y / objptr.mass * objptr.graphics_manager.time_interval,
	     z: f4.z / objptr.mass * objptr.graphics_manager.time_interval};
	   num++;
	}
	[collided5,f5] = if_ball_ball_specific_collide(obj_ball1,obj_ball5);
	if(collided5)
	{
	r5 ={x: f5.x / objptr.mass * objptr.graphics_manager.time_interval,
	     y: f5.y / objptr.mass * objptr.graphics_manager.time_interval,
	     z: f5.z / objptr.mass * objptr.graphics_manager.time_interval};
	   num++;
	}

	if((collided2)||(collided3)||(collided4)||(collided5))
	{
		r2len = Math.sqrt(r2.x * r2.x + r2.y * r2.y + r2.z * r2.z);
		r3len = Math.sqrt(r3.x * r3.x + r3.y * r3.y + r3.z * r3.z);
		r4len = Math.sqrt(r4.x * r4.x + r4.y * r4.y + r4.z * r4.z);
		r5len = Math.sqrt(r5.x * r5.x + r5.y * r5.y + r5.z * r5.z);

		total = r2len + r3len + r4len + r5len;
		r2r = r2len / total;
		r3r = r3len / total;
		r4r = r4len / total;
		r5r = r5len / total;

		r = {x:(r2.x*r2r + r3.x*r3r + r4.x*r4r + r5.x*r5r)/num,
		     y:(r2.y*r2r + r3.y*r3r + r4.y*r4r + r5.y*r5r)/num,
		     z:(r2.z*r2r + r3.z*r3r + r4.z*r4r + r5.z*r5r)/num};

		//if(obj_ball == null){console.log("ball vanished on ball room collide check");}

		if(obj_ball.graphics_manager.time_interval == 0){obj_ball.graphics_manager.time_interval = 1;}

		return [true,{x:((obj_ball.mass*r.x)/(obj_ball.graphics_manager.time_interval  )),
		y:((obj_ball.mass*r.y)/(obj_ball.graphics_manager.time_interval )),
		z:((obj_ball.mass*r.z)/(obj_ball.graphics_manager.time_interval  ))}];
	}
	return [false,null];	
}


function if_ball_room_collide1(objptr)
{

	obj_ball = objptr.graphics_manager.scene_objs[0];obj_room = objptr.graphics_manager.scene_objs[1];

	distx = obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x - 
		obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x;
	disty = obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y - 
		obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y;
	distz = obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z - 
		obj_room.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z;

	boundary = obj_room.collision_param - obj_ball.collision_param;
	neg_boundary =  0 - boundary;
	outside = false;

	ball_x_comp =distx*obj_room.skel.skeleton_joints[0].getAbsXvector().x + 
	disty*obj_room.skel.skeleton_joints[0].getAbsXvector().y + 
	distz*obj_room.skel.skeleton_joints[0].getAbsXvector().z;

	ball_y_comp = distx*obj_room.skel.skeleton_joints[0].getAbsYvector().x + 
	disty*obj_room.skel.skeleton_joints[0].getAbsYvector().y + 
	distz*obj_room.skel.skeleton_joints[0].getAbsYvector().z;

	ball_z_comp =distx*obj_room.skel.skeleton_joints[0].getAbsZvector().x + 
	disty*obj_room.skel.skeleton_joints[0].getAbsZvector().y + 
	distz*obj_room.skel.skeleton_joints[0].getAbsZvector().z;


	neg_normal = {x:0,y:0,z:0};//+ve or -ve room joint abs vector
	step = {x:0,y:0,z:0};

		if( ball_x_comp > 0 && ball_x_comp > boundary)
		{
			outside = true;
			neg_normal = {	x:neg_normal.x-obj_room.skel.skeleton_joints[0].getAbsXvector().x,
					y:neg_normal.y-obj_room.skel.skeleton_joints[0].getAbsXvector().y,
					z:neg_normal.z-obj_room.skel.skeleton_joints[0].getAbsXvector().z
					}; 
			step.x = ball_x_comp - boundary;		
		}
		if( ball_x_comp < 0 && ball_x_comp < neg_boundary)
		{
			outside = true;
			neg_normal = {	x:neg_normal.x+(obj_room.skel.skeleton_joints[0].getAbsXvector().x),
					y:neg_normal.y+(obj_room.skel.skeleton_joints[0].getAbsXvector().y),
					z:neg_normal.z+(obj_room.skel.skeleton_joints[0].getAbsXvector().z),
					}; 

			step.x = 0 - (ball_x_comp - neg_boundary);
	
		}
		if( ball_y_comp > 0 && ball_y_comp > boundary)
		{
			outside = true;
			neg_normal = {	x:neg_normal.x-obj_room.skel.skeleton_joints[0].getAbsYvector().x,
					y:neg_normal.y-obj_room.skel.skeleton_joints[0].getAbsYvector().y,
					z:neg_normal.z-obj_room.skel.skeleton_joints[0].getAbsYvector().z
					}; 
	
			step.y = ball_y_comp - boundary;
		}
		if( ball_y_comp < 0 && ball_y_comp < neg_boundary)
		{
			outside = true;
			neg_normal = {	x:neg_normal.x+obj_room.skel.skeleton_joints[0].getAbsYvector().x,
					y:neg_normal.y+obj_room.skel.skeleton_joints[0].getAbsYvector().y,
					z:neg_normal.z+obj_room.skel.skeleton_joints[0].getAbsYvector().z
					}; 

			step.y = 0 - (ball_y_comp - neg_boundary);
		}
		if( ball_z_comp> 0 && ball_z_comp > boundary)
		{
			outside = true;
			neg_normal = {	x:neg_normal.x-obj_room.skel.skeleton_joints[0].getAbsZvector().x,
					y:neg_normal.y-obj_room.skel.skeleton_joints[0].getAbsZvector().y,
					z:neg_normal.z-obj_room.skel.skeleton_joints[0].getAbsZvector().z
					}; 
	
			step.z = ball_z_comp - boundary;
		}
		if( ball_z_comp < 0 && ball_z_comp < neg_boundary)
		{
			outside = true;
			neg_normal = {	x:neg_normal.x+obj_room.skel.skeleton_joints[0].getAbsZvector().x,
					y:neg_normal.y+obj_room.skel.skeleton_joints[0].getAbsZvector().y,
					z:neg_normal.z+obj_room.skel.skeleton_joints[0].getAbsZvector().z
					}; 
	
			step.z = 0 - (ball_z_comp - neg_boundary);
		}
	
		if(outside == true)
		{
			//normalize neg_normal
			len = Math.sqrt(neg_normal.x*neg_normal.x + neg_normal.y*neg_normal.y + neg_normal.z*neg_normal.z);
			neg_normal.x = neg_normal.x/len;
			neg_normal.y = neg_normal.y/len;
			neg_normal.z = neg_normal.z/len;

			step1 = Math.sqrt(step.x*step.x + step.y*step.y + step.z*step.z);

			// place it right to where it has to be on collide
			// if step1 * neg_normal goes beyond boundary it hesitates
			obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.x += step1 *  neg_normal.x;
			obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.y += step1 *  neg_normal.y;
			obj_ball.skel.skeleton_joints[0].motion.current.value.abscoords.origin.z += step1 *  neg_normal.z;
	
			//velocity dot neg_normal
			v_dot_n_by_2 = 2* ( neg_normal.x * obj_ball.velocity.x +
				neg_normal.y * obj_ball.velocity.y +
				neg_normal.z * obj_ball.velocity.z);

			// velocity vector reflection
			r ={x:obj_ball.velocity.x - v_dot_n_by_2 * neg_normal.x,
			    y:obj_ball.velocity.y - v_dot_n_by_2 * neg_normal.y,
			    z:obj_ball.velocity.z - v_dot_n_by_2 * neg_normal.z};

			if(obj_ball.graphics_manager.time_interval == 0){obj_ball.graphics_manager.time_interval = 1;}

			return [true,{x:((obj_ball.mass*r.x)/(obj_ball.graphics_manager.time_interval  )),
			y:((obj_ball.mass*r.y)/(obj_ball.graphics_manager.time_interval  )),
			z:((obj_ball.mass*r.z)/(obj_ball.graphics_manager.time_interval  ))}];
		}
	
	return [false,null];	
}

