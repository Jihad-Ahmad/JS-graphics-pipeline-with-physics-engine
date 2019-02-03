var SceneObj = function(owner_gm = null)
{

	this.graphics_manager = owner_gm;
	this.skel = new skeleton(); //√
	this.mesh = new Mesh(); //(this,this.skel,array_of_vertices, array_of_line);//√
	
	//force-based physics
	this.physicsFunction = emptyFunction;

	this.appliedForces = [-1];//having force vectors, and condition function returns true if the force should be applied, false otherwise
	this.applyForce = function(fx,fy,fz)
	{
		t = (this.graphics_manager.time_interval*.001);
		if(t == 0){return;}
		this.velocity.x = fx / this.mass * t;
		this.velocity.y = fy / this.mass * t;
		this.velocity.z = fz / this.mass * t;
	}

	this.mass = 1;//in kg
	this.time_accum = 0;
	this.velocity = {x:0,y:0,z:0};
	this.acceleration = {x:0,y:0,z:0};
	this.before_pos = {x:0,y:0,z:0};

	this.drag = 1;
}

function permenantForce(objptr)
{
	return true;
}

function neverForce(objptr)
{
	return false;
}

var GraphicsAppManager = function(canvas_element)
{
	this.hidden_canvas = document.createElement('canvas');
	this.hidden_canvas.width = canvas_element.width;
	this.hidden_canvas.height = canvas_element.height;
	this.hidden_context = this.hidden_canvas.getContext('2d');

	this.canvas = canvas_element;
	this.shown = true;

	this.ctx = canvas_element.getContext('2d');
	this.active_context = this.ctx;

	this.setHiddenCanvasRender = function()
				{
					this.shown = false;
					this.active_context = this.hidden_context;
				};
	this.setShownCanvasRender = function()
				{
					this.shown = true;
					this.active_context = this.ctx;
				};



	this.z_buffer = [[-1]]; //array has the same dimension of canvaselemt in [width][height] to save calculations
	this.clearCanvas = function()
			{
				this.active_context.clearRect(0,0,this.canvas.width,this.canvas.height);
				for(x=0;x<this.canvas.width;x++)
				{
					if(!this.z_buffer[x]){this.z_buffer[x] = [-1];}
					for(y=0;y<this.canvas.height;y++)
					{this.z_buffer[x][y] = -1;}
				}
					for(i=0;i<this.cameras.length;i++)
					{
						if(this.cameras[i].background)
						{
							 this.active_context.putImageData(this.cameras[i].background,
							this.cameras[i].viewport.origin_x+
							this.cameras[i].viewport.width/2-this.cameras[i].background.width/2,
							this.cameras[i].viewport.origin_y+
						 	this.cameras[i].viewport.height/2-this.cameras[i].background.height/2);
							//ctx.stroke();

						}

					}
				

			};


	this.cameras = [-1];

	this.scene_objs;
	this.vertices_pool=[-1];//used in frustum plane flags 6 true-false per vertex
	this.lines_pool = [-1];//indices of vertices only - used to clip line(v1,v2) into line(c1,c2) for all its using quads - also lines will
	
	this.initializeScene;// = box_ball_1_viewport;	

	
	this.calallvertices = calVertices;
	this.clipLines = cliplines;


	//render scene
	this.prepareforrender = preparequads;

	this.render = render;
	
	this.imageFrames = [-1];
	frame_pointer = 0;
	this.saveRenderFrame = saveRenderFrame;
	this.getRenderFrame = getRenderFrame;
	this.frame_pointer = 0;
	this.cyclic = false;

	// the physics related variables
	this.time_interval = 30; //ms
	this.time_accum = 0;//add the this.time_interval each render 
	this.applyPhysics = emptyFunction;

};

function emptyFunction(){}

function preparequads()
{

	tb4 = performance.now();

	for(var i=0;i<this.vertices_pool.length;i++){this.vertices_pool[i].calAbsPos(i);}

	taft = performance.now();

	for(var c=0;c<this.cameras.length;c++)
	{
		this.cameras[c].calallvertices(this.vertices_pool);
		this.cameras[c].clipprojectmaplines(this.vertices_pool,this.lines_pool,0);
	}
}


function getRenderFrame()
{
	//cyclic
	if(this.cyclic)
	{
		if(this.imageFrames[0] == -1){return;}
		if((this.imageFrames.length-1) > this.frame_pointer) 
		{
			this.frame_pointer++;
		}
		else
		{
			this.frame_pointer = 0;
		}
		this.ctx.putImageData(this.imageFrames[this.frame_pointer],0,0);
		return true;
	}

	//once
	else
	{
		if(this.imageFrames[0] == -1){return;}
		if((this.imageFrames.length-1) > this.frame_pointer) 
		{
			this.frame_pointer++;
			this.ctx.putImageData(this.imageFrames[this.frame_pointer],0,0);
			return true;
		}
		else
		{return false;}
	}
	

}

function saveRenderFrame()
{
	ii = 0;
	if(this.imageFrames[0] == -1){ii=0;}else{ii=this.imageFrames.length;}
	this.imageFrames[ii]  = this.active_context.getImageData(0, 0, this.canvas.width, this.canvas.height); 
}


function calVertices()
{
	for(i=0;i<this.cameras.length;i++)
	{
		this.cameras[i].calallvertices(this.vertices_pool);
	}

}

function cliplines()
{
	for(i=0;i<this.cameras.length;i++)
	{
		this.cameras[i].clipprojectmaplines(this.vertices_pool,this.lines_pool,0);	
	}
}

function render()
{
	this.applyPhysics();
	this.clearCanvas();
	this.prepareforrender();
	for(i=0;i<this.cameras.length;i++)
	{
				
			if(this.lines_pool[0] != -1){
			//rendering lines - supposed to be commented on running quad render
			for(l=0;l<this.lines_pool.length;l++)
			{
				if(this.cameras[i].line_clipped[l] == 0){continue;}
				this.active_context.beginPath();
				this.active_context.moveTo(this.cameras[i].line_mapped_pixels[l][0].abscoords.origin.x,this.cameras[i].line_mapped_pixels[l][0].abscoords.origin.y);
				this.active_context.lineTo(this.cameras[i].line_mapped_pixels[l][1].abscoords.origin.x,this.cameras[i].line_mapped_pixels[l][1].abscoords.origin.y);
				this.active_context.stroke();
				this.active_context.closePath();
			}
			}
	}

	this.time_accum += this.time_interval;
	if(!this.shown){this.saveRenderFrame();}	

}

