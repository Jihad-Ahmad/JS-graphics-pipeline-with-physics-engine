var ViewPort = function(origin_x1 = 0, origin_y1 = 0, w = 0, h = 0, win_origin_x = 0, win_origin_y = 0, win_w = 0, win_h = 0) {
    this.origin_x = origin_x1;
    this.origin_y = origin_y1;
    this.width = w; //width of view port
    this.height = h; //height of view port
    this.whole_win_origin_x = win_origin_x;
    this.whole_win_origin_y = win_origin_y;
    this.whole_win_width = win_w;
    this.whole_win_height = win_h;
    this.r1w = this.width / win_w;
    this.r1h = this.height / win_h;
};


ViewPort.prototype.update = function(origin_x1, origin_y1, view_w, view_h, win_origin_x, win_origin_y, win_w, win_h)
{

    this.origin_x = origin_x1;
    this.origin_y = origin_y1;
    this.width = view_w;
    this.height = view_h;
    this.r1w = this.width / win_w;
    this.r1h = this.height / win_h;

};



var SmartCamera = function() {

    this.viewport = new ViewPort();
    this.path = new DoublyCircularLinkedList();
    this.path.append(new CoordSys());
    this.motionstep = 0.1;
    this.spinstep = 0.1;


    this.near_dist = 4;
    this.far_dist = 10;
    this.heightf = 2; //1/2 height window height or 1/2 height of canvas
    this.aspect_ratio = 1.32;
    this.frustumheightscale = this.far_dist / this.near_dist;

    this.perspective = true; // else it is orthogonal
    this.wired = true;

    // will hold all the ordering arrays of vertices
    // sort of vertices according to z-buffer
    // clipped - projected - mapped lines' info here
    // DCLL of lines' mapped vertices in correct order with appendNoDup for each polygon
    this.near_clipped = [-1];
    this.far_clipped = [-1];
    this.right_clipped = [-1];
    this.left_clipped = [-1];
    this.top_clipped = [-1];
    this.bottom_clipped = [-1];
    this.covered_clipped = [false];

    this.inside_frustum = [-1];
    this.x_comp = [-1]; //abs position of vertex dot product with Xvector of camera
    this.y_comp = [-1];
    this.z_comp = [-1];
    this.scale = [-1]; // this is the z-buffer also, since it is near_dist/z_comp, gets bigger on approach, smaller on moving away from, then 
    // the bigger scale(z-buffer) erases smaller one drawn before it, if i want to sort, sort in DESC order by this scale[i] quad avg
    this.mapped = [-1];

    this.line_mapped_pixels = [
        [-1, -1, -1, -1]
    ];
    //  [line_index][0]: carries the vi1 pixel copy (clipped-interpolated)
    //  [line_index][1]: carries the vi2 pixel copy (clipped-interpolated)
    //  [line_index][2]: slop
    //  [line_index][3]: interpolation method
    // 0: linear interpolation


    this.line_clipped = [-1]; // takes index of line , have a value from 2 values
    //  0: the whole line of a given index, is outside the frustum
    //  1: p1 is out, p2 is inside
    //  3: p2 is out, p1 is indide
    //  2: both line pixels are inside

 

    //interface
    this.getXvector = function() {
        return this.path.current.value.vectors.m.getXvector();
    };
    this.getYvector = function() {
        return this.path.current.value.vectors.m.getYvector();
    };
    this.getZvector = function() {
        return this.path.current.value.vectors.m.getZvector();
    };
    this.getOrigin = function() {
        return this.path.current.value.origin;
    };


    this.setXvector = function(x, y, z, w) {
        this.path.current.value.vectors.m.setXvector(x, y, z, w);
    };
    this.setYvector = function(x, y, z, w) {
        this.path.current.value.vectors.m.setYvector(x, y, z, w);
    };
    this.setZvector = function(x, y, z, w) {
        this.path.current.value.vectors.m.setZvector(x, y, z, w);
    };

    this.setOrigin = function(x, y, z, w) {
        this.path.current.value.origin.x = x;
        this.path.current.value.origin.y = y;
        this.path.current.value.origin.z = z;
        this.path.current.value.origin.w = w;
    };

    this.moveFront = MoveCameraFront;
    this.moveBack = MoveCameraBack;
    this.moveRight = MoveCameraRight;
    this.moveLeft = MoveCameraLeft;
    this.moveUp = MoveCameraUp;
    this.moveDown = MoveCameraDown;
    this.moveLinear = MoveCameraLinear;

    this.rotateXcw = function() {
        this.path.current.value.vectors.rotateU(-this.spinstep, this.getXvector());
    };
    this.rotateXac = function() {
        this.path.current.value.vectors.rotateU(this.spinstep, this.getXvector());
    };
    this.rotateYcw = function() {
        this.path.current.value.vectors.rotateU(-this.spinstep, this.getYvector());
    };
    this.rotateYac = function() {
        this.path.current.value.vectors.rotateU(this.spinstep, this.getYvector());
    };
    this.rotateZcw = function() {
        this.path.current.value.vectors.rotateU(-this.spinstep, this.getZvector());
    };
    this.rotateZac = function() {
        this.path.current.value.vectors.rotateU(this.spinstep, this.getZvector());
    };
    this.rotateArbitrary = function(theta, U) {
        this.path.current.value.vectors.rotateU(theta, U);
    };

    this.push = function() {
        this.path.append(this.path.current.value.dup());
        this.path.pointToNext();
    };
    this.popnext = function() {
        this.path.pointToNext();
    };
    this.popprev = function() {
        this.path.pointToPrev();
    };
    this.resetpath = function() {
        this.path.deleteList();
        this.path.append(new CoordSys());

    };

    //this calculates all neccessary data of the vertices,lines,quads that affect rendering
    this.calallvertices = calvertices; // dotproducts with camera, clipping flags, projected+mapped for not clipped vertices
    this.cal1vertex = cal1vertex; // dotproducts with camera, clipping flags, projected+mapped for not clipped vertices
	this.cal1vertex_v2 = cal1vertex_v2;
    this.clipprojectmaplines = clipLines;


    this.addnewline = function(pixel1,pixel2,interpolation_method,array_of_lines = 0)
	{index = this.line_mapped_pixels.length; 
	 this.line_mapped_pixels[index][0]=pixel1;
	this.line_mapped_pixels[index][1]=pixel2;
	this.line_mapped_pixels[index][3]= interpolation_method; //0 for linear
	// calculating slop
	this.line_mapped_pixels[index][2]= 
		(pixel2.abscoords.origin.y - pixel1.abscoords.origin.y)/(pixel2.abscoords.origin.x - pixel1.abscoords.origin.x);
	if(array_of_lines)
	{
		array_of_lines[index] = {vi1:pixel1.original_vertex_index,vi2:pixel2.original_vertex_index};
	}
	return index;
	}


    this.howto = printCameraUsage;
    this.delete = deleteCamera;


// remodel vertices according to image
    this.createBackground = function(img_src,width,height)
	{
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var img = new Image(width,height);
		img.src = img_src;
		canvas.width = width;
		canvas.height = height;
		context.drawImage(img, 0, 0 );
		this.background = context.getImageData(0, 0, width, height);
	

		points_num = 0;
		for(i=0;i<this.background.data.length;i++)
		{
			if(this.background.data[i]==0 && this.background.data[i+1]==0 && this.background.data[i+2]==0 
				&& this.background.data[i+3]>0)
			{
				x = Math.round((i/4)%this.background.width + this.viewport.origin_x + this.viewport.width/2 - this.background.width/2);
				y = Math.round((i/4)/this.background.width + this.viewport.origin_y + this.viewport.height/2 - this.background.height/2);

				this.modeler_points[points_num] = {x:x,y:y};
				//this.modeler_points[points_num] = new Point2D(x,y);

				//console.log("this.modeler_points["+points_num+"] = ("+this.modeler_points[points_num].x+","+
				//this.modeler_points[points_num].y+")");

				points_num++;
			}
		}
	};


//mapping 1 point
this.map1point = map1Point;

//boundary points of modeler background
this.modeler_points = [-1];


this.init = initSmartCamera;


}


////////	SMART CAMERA FUNCTIONS		////////////////

function initSmartCamera(array_of_vertices, array_of_lines, array_of_quads)
{

	if(this.mapped[0] == -1)
	{
		for (i = 0; i < array_of_vertices.length; i++)
		{this.mapped[i] = {x:0,y:0};}
	}


    for (i = 0; i < array_of_lines.length; i++) {

	    if (!this.line_mapped_pixels[i]||!this.line_mapped_pixels[i][0]||!this.line_mapped_pixels[i][1]) {
            this.line_mapped_pixels[i] = [-1, -1, -1, -1];
	    }

            this.line_mapped_pixels[i][0] = array_of_vertices[array_of_lines[i].vi1].converttopixel(array_of_lines[i].vi1);
            this.line_mapped_pixels[i][1] = array_of_vertices[array_of_lines[i].vi2].converttopixel(array_of_lines[i].vi2);
	}

}


function map1Point(pos)
{

//this.perspective = false;
    if (this.perspective) {

            vertex_camera_vector = this.getOrigin().GetVector(pos);
	
            x_comp = GetDotProduct(this.getXvector(),vertex_camera_vector);
            y_comp = GetDotProduct(this.getYvector(),vertex_camera_vector);
            z_comp = GetDotProduct(this.getZvector(),vertex_camera_vector);

            scale = 1 / z_comp;

           // mapped = new Point2D(0, 0);
	   mapped = {x:0,y:0};
            mapped.x = Math.round((this.heightf * x_comp * scale + this.viewport.whole_win_width / 2) *
                this.viewport.r1w + this.viewport.origin_x);

            mapped.y = Math.round((this.viewport.whole_win_height / 2 - this.heightf * y_comp * scale) *
                this.viewport.r1h + this.viewport.origin_y);

	    return [mapped.x,mapped.y];
    } 

   
}


function clipLines(array_of_vertices, array_of_lines, interpolation_method) {


	//TDOD: interpolate normals of clipped pixels

	if(array_of_lines[0]==-1){return;}
    for (i = 0; i < array_of_lines.length; i++) {
        // clip the whole line against each plane with no use for clip arrays, and the subsequent clipping planes 
        // takes values from already done clipping data of pixels 
        //clip the whole line against right

        //line is totally outside frustum 
        if (
            (this.right_clipped[array_of_lines[i].vi1] && this.right_clipped[array_of_lines[i].vi2]) ||
            (this.left_clipped[array_of_lines[i].vi1] && this.left_clipped[array_of_lines[i].vi2]) ||
            (this.top_clipped[array_of_lines[i].vi1] && this.top_clipped[array_of_lines[i].vi2]) ||
            (this.bottom_clipped[array_of_lines[i].vi1] && this.bottom_clipped[array_of_lines[i].vi2]) ||
            (this.near_clipped[array_of_lines[i].vi1] && this.near_clipped[array_of_lines[i].vi2]) ||
            (this.far_clipped[array_of_lines[i].vi1] && this.far_clipped[array_of_lines[i].vi2])
	||(this.covered_clipped[array_of_lines[i].vi1] && this.covered_clipped[array_of_lines[i].vi2])
        ) {
            this.line_clipped[i] = 0;
            continue; //the whole line is outside the frustum
        }


        //copy line vertices into corresponiding pixel values
	
        if (!this.line_mapped_pixels[i]) {
            this.line_mapped_pixels[i] = [-1, -1, -1, -1];
        }
	

        this.line_mapped_pixels[i][0] = array_of_vertices[array_of_lines[i].vi1].converttopixel(array_of_lines[i].vi1);
        this.line_mapped_pixels[i][0].abscoords.origin.x = this.mapped[array_of_lines[i].vi1].x;
        this.line_mapped_pixels[i][0].abscoords.origin.y = this.mapped[array_of_lines[i].vi1].y;
        this.line_mapped_pixels[i][0].abscoords.origin.z = 0;
        this.line_mapped_pixels[i][0].z_buffer = this.scale[array_of_lines[i].vi1];

        this.line_mapped_pixels[i][1] = array_of_vertices[array_of_lines[i].vi2].converttopixel(array_of_lines[i].vi2);
        this.line_mapped_pixels[i][1].abscoords.origin.x = this.mapped[array_of_lines[i].vi2].x;
        this.line_mapped_pixels[i][1].abscoords.origin.y = this.mapped[array_of_lines[i].vi2].y;
        this.line_mapped_pixels[i][1].abscoords.origin.z = 0;
        this.line_mapped_pixels[i][1].z_buffer = this.scale[array_of_lines[i].vi2];


        this.line_mapped_pixels[i][3] = interpolation_method;

        //line is totally inside, work is done, vertices of line are mapped having all visual props
        if ((this.inside_frustum[array_of_lines[i].vi1]) && (this.inside_frustum[array_of_lines[i].vi2])
	&& (!this.covered_clipped[array_of_lines[i].vi1]) && (!this.covered_clipped[array_of_lines[i].vi2])
	) {
            this.line_clipped[i] = 2;
            continue;
        }


        this.line_clipped[i] = 1;

	//saving the slop
        this.line_mapped_pixels[i][2] = (this.mapped[array_of_lines[i].vi2].y - this.mapped[array_of_lines[i].vi1].y) /
            (this.mapped[array_of_lines[i].vi2].x - this.mapped[array_of_lines[i].vi1].x);


        //TODO: don't forget that all visual props must be interpolated just like position,
	// z_buffer (still generates a bug) ,  tx,ty, normals 
        // generic interpolation = linear as a start

        // near clipped
        if (this.near_clipped[array_of_lines[i].vi1]) {
		
            z_diff = (this.z_comp[array_of_lines[i].vi2] - this.z_comp[array_of_lines[i].vi1]);

            line_yslop = (this.y_comp[array_of_lines[i].vi2] - this.y_comp[array_of_lines[i].vi1]) / z_diff;
            line_xslop = (this.x_comp[array_of_lines[i].vi2] - this.x_comp[array_of_lines[i].vi1]) / z_diff;

            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {

                z_diff_near = (this.z_comp[array_of_lines[i].vi2] - this.near_dist);
                tobemappedx = this.x_comp[array_of_lines[i].vi2] - (line_xslop * z_diff_near);
                tobemappedy = this.y_comp[array_of_lines[i].vi2] - (line_yslop * z_diff_near);

                this.line_mapped_pixels[i][0].abscoords.origin.x =
                    (this.heightf * tobemappedx / this.near_dist + this.viewport.whole_win_width / 2) *
                    this.viewport.r1w + this.viewport.origin_x;

                this.line_mapped_pixels[i][0].abscoords.origin.y =
                    (this.viewport.whole_win_height / 2 - this.heightf * tobemappedy / this.near_dist) *
                    this.viewport.r1h + this.viewport.origin_y;

                this.line_mapped_pixels[i][0].tx = 0;

                this.line_mapped_pixels[i][0].ty = 0;

                this.line_mapped_pixels[i][0].z_buffer = 1 / this.near_dist;

            }

	//this.line_clipped[i] = 1;

        }
        if (this.near_clipped[array_of_lines[i].vi2]) {
            z_diff = (this.z_comp[array_of_lines[i].vi2] - this.z_comp[array_of_lines[i].vi1]);

            line_yslop = (this.y_comp[array_of_lines[i].vi2] - this.y_comp[array_of_lines[i].vi1]) / z_diff;
            line_xslop = (this.x_comp[array_of_lines[i].vi2] - this.x_comp[array_of_lines[i].vi1]) / z_diff;

            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {
                z_diff_near = (this.z_comp[array_of_lines[i].vi1] - this.near_dist);
                tobemappedx = this.x_comp[array_of_lines[i].vi1] - (line_xslop * z_diff_near);
                tobemappedy = this.y_comp[array_of_lines[i].vi1] - (line_yslop * z_diff_near);

                this.line_mapped_pixels[i][1].abscoords.origin.x =
                    (this.heightf * tobemappedx / this.near_dist + this.viewport.whole_win_width / 2) *
                    this.viewport.r1w + this.viewport.origin_x;

                this.line_mapped_pixels[i][1].abscoords.origin.y =
                    (this.viewport.whole_win_height / 2 - this.heightf * tobemappedy / this.near_dist) *
                    this.viewport.r1h + this.viewport.origin_y;

                this.line_mapped_pixels[i][1].z_buffer = 1 / this.near_dist;

            }
	//this.line_clipped[i] = 3;

        }

	// far clipped
        if (this.far_clipped[array_of_lines[i].vi1]) {
            z_diff = (this.z_comp[array_of_lines[i].vi2] - this.z_comp[array_of_lines[i].vi1]);

            line_yslop = (this.y_comp[array_of_lines[i].vi2] - this.y_comp[array_of_lines[i].vi1]) / z_diff;
            line_xslop = (this.x_comp[array_of_lines[i].vi2] - this.x_comp[array_of_lines[i].vi1]) / z_diff;

            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {
                z_diff_far = (this.z_comp[array_of_lines[i].vi2] - this.far_dist);
                tobemappedx = this.x_comp[array_of_lines[i].vi2] - (line_xslop * z_diff_far);
                tobemappedy = this.y_comp[array_of_lines[i].vi2] - (line_yslop * z_diff_far);

                this.line_mapped_pixels[i][0].abscoords.origin.x =
                    (this.heightf * tobemappedx / this.far_dist + this.viewport.whole_win_width / 2) *
                    this.viewport.r1w + this.viewport.origin_x;

                this.line_mapped_pixels[i][0].abscoords.origin.y =
                    (this.viewport.whole_win_height / 2 - this.heightf * tobemappedy / this.far_dist) *
                    this.viewport.r1h + this.viewport.origin_y;


                this.line_mapped_pixels[i][0].z_buffer = 1 / this.far_dist;
            }
		//this.line_clipped[i] = 1;

        }
        if (this.far_clipped[array_of_lines[i].vi2]) {
            z_diff = (this.z_comp[array_of_lines[i].vi2] - this.z_comp[array_of_lines[i].vi1]);

            line_yslop = (this.y_comp[array_of_lines[i].vi2] - this.y_comp[array_of_lines[i].vi1]) / z_diff;
            line_xslop = (this.x_comp[array_of_lines[i].vi2] - this.x_comp[array_of_lines[i].vi1]) / z_diff;

            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {
                z_diff_far = (this.z_comp[array_of_lines[i].vi1] - this.far_dist);
                tobemappedx = this.x_comp[array_of_lines[i].vi1] - (line_xslop * z_diff_far);
                tobemappedy = this.y_comp[array_of_lines[i].vi1] - (line_yslop * z_diff_far);

                this.line_mapped_pixels[i][1].abscoords.origin.x =
                    (this.heightf * tobemappedx / this.far_dist + this.viewport.whole_win_width / 2) *
                    this.viewport.r1w + this.viewport.origin_x;

                this.line_mapped_pixels[i][1].abscoords.origin.y =
                    (this.viewport.whole_win_height / 2 - this.heightf * tobemappedy / this.far_dist) *
                    this.viewport.r1h + this.viewport.origin_y;

                this.line_mapped_pixels[i][1].z_buffer = 1 / this.far_dist;

            }
		//this.line_clipped[i] = 3;

        }


        // right: this.viewport.width carries the x of the clipped pixel x,
        // get from line slop, the clipped pixel y :)
        if (this.line_mapped_pixels[i][0].abscoords.origin.x > (this.viewport.origin_x + this.viewport.width)) // means: &&(this.inside_frustum[array_of_lines[i].vi2]))
        {
            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {

                this.line_mapped_pixels[i][0].abscoords.origin.x = (this.viewport.origin_x + this.viewport.width); //√
                this.line_mapped_pixels[i][0].abscoords.origin.y = this.line_mapped_pixels[i][1].abscoords.origin.y -
                    this.line_mapped_pixels[i][2] * (this.line_mapped_pixels[i][1].abscoords.origin.x - (this.viewport.origin_x + this.viewport.width));

                this.line_mapped_pixels[i][0].z_buffer = this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][2] *
                    (this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][0].z_buffer);

            }
	//this.line_clipped[i] = 1;

        }
        if (this.line_mapped_pixels[i][1].abscoords.origin.x > (this.viewport.origin_x + this.viewport.width)) // means: &&(this.inside_frustum[array_of_lines[i].vi2]))
        {
            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {

                this.line_mapped_pixels[i][1].abscoords.origin.x = (this.viewport.origin_x + this.viewport.width); //√
                this.line_mapped_pixels[i][1].abscoords.origin.y = this.line_mapped_pixels[i][0].abscoords.origin.y -
                    this.line_mapped_pixels[i][2] * (this.line_mapped_pixels[i][0].abscoords.origin.x - (this.viewport.origin_x + this.viewport.width));

                this.line_mapped_pixels[i][1].z_buffer = this.line_mapped_pixels[i][0].z_buffer - this.line_mapped_pixels[i][2] *
                    (this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][0].z_buffer);

            }
	//this.line_clipped[i] = 3;

        }


        //(this.left_clipped[array_of_lines[i].vi1])
        if (this.line_mapped_pixels[i][0].abscoords.origin.x < this.viewport.origin_x) {
            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {

                this.line_mapped_pixels[i][0].abscoords.origin.x = this.viewport.origin_x; //√
                this.line_mapped_pixels[i][0].abscoords.origin.y = this.line_mapped_pixels[i][1].abscoords.origin.y -
                    this.line_mapped_pixels[i][2] * (this.line_mapped_pixels[i][1].abscoords.origin.x - this.viewport.origin_x);

                this.line_mapped_pixels[i][0].z_buffer = this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][2] *
                    (this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][0].z_buffer);

            }
	//this.line_clipped[i] = 1;

        }
        if (this.line_mapped_pixels[i][1].abscoords.origin.x < this.viewport.origin_x) {
            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {

                this.line_mapped_pixels[i][1].abscoords.origin.x = this.viewport.origin_x; //√
                this.line_mapped_pixels[i][1].abscoords.origin.y = this.line_mapped_pixels[i][0].abscoords.origin.y -
                    this.line_mapped_pixels[i][2] * (this.line_mapped_pixels[i][0].abscoords.origin.x - this.viewport.origin_x);

                this.line_mapped_pixels[i][1].z_buffer = this.line_mapped_pixels[i][0].z_buffer - this.line_mapped_pixels[i][2] *
                    (this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][0].z_buffer);

            }
	//this.line_clipped[i] = 3;

        }


        //(this.top_clipped[array_of_lines[i].vi1])
        if (this.line_mapped_pixels[i][0].abscoords.origin.y < this.viewport.origin_y) {
            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {

                this.line_mapped_pixels[i][0].abscoords.origin.x = this.line_mapped_pixels[i][1].abscoords.origin.x -
                    (this.line_mapped_pixels[i][1].abscoords.origin.y - this.viewport.origin_y) / this.line_mapped_pixels[i][2];
                this.line_mapped_pixels[i][0].abscoords.origin.y = this.viewport.origin_y;

                this.line_mapped_pixels[i][0].z_buffer = this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][2] *
                    (this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][0].z_buffer);

            }
	//this.line_clipped[i] = 1;

        }

        if (this.line_mapped_pixels[i][1].abscoords.origin.y < this.viewport.origin_y) {
            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {

                this.line_mapped_pixels[i][1].abscoords.origin.x = this.line_mapped_pixels[i][0].abscoords.origin.x -
                    (this.line_mapped_pixels[i][0].abscoords.origin.y - this.viewport.origin_y) / this.line_mapped_pixels[i][2];
                this.line_mapped_pixels[i][1].abscoords.origin.y = this.viewport.origin_y;

                this.line_mapped_pixels[i][1].z_buffer = this.line_mapped_pixels[i][0].z_buffer - this.line_mapped_pixels[i][2] *
                    (this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][0].z_buffer);

            }
	//this.line_clipped[i] = 3;

        }


        //(this.bottom_clipped[array_of_lines[i].vi1])
        if (this.line_mapped_pixels[i][0].abscoords.origin.y > (this.viewport.origin_y + this.viewport.height)) {
            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {

                this.line_mapped_pixels[i][0].abscoords.origin.x = this.line_mapped_pixels[i][1].abscoords.origin.x -
                    (this.line_mapped_pixels[i][1].abscoords.origin.y - (this.viewport.origin_y + this.viewport.height)) / this.line_mapped_pixels[i][2];
                this.line_mapped_pixels[i][0].abscoords.origin.y = (this.viewport.origin_y + this.viewport.height);

                this.line_mapped_pixels[i][0].z_buffer = this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][2] *
                    (this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][0].z_buffer);

            }
	//this.line_clipped[i] = 1;

        }

        if (this.line_mapped_pixels[i][1].abscoords.origin.y > (this.viewport.origin_y + this.viewport.height)) {
            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {

                this.line_mapped_pixels[i][1].abscoords.origin.x = this.line_mapped_pixels[i][0].abscoords.origin.x -
                    (this.line_mapped_pixels[i][0].abscoords.origin.y - (this.viewport.origin_y + this.viewport.height)) / this.line_mapped_pixels[i][2];
                this.line_mapped_pixels[i][1].abscoords.origin.y = (this.viewport.origin_y + this.viewport.height);

                this.line_mapped_pixels[i][1].z_buffer = this.line_mapped_pixels[i][0].z_buffer - this.line_mapped_pixels[i][2] *
                    (this.line_mapped_pixels[i][1].z_buffer - this.line_mapped_pixels[i][0].z_buffer);

            }
	//this.line_clipped[i] = 3;

        }

	
	//covered_clipped
        if(this.covered_clipped[array_of_lines[i].vi1])
	{

            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {
		
                this.line_mapped_pixels[i][0].abscoords.origin.x = 0.5 * (this.line_mapped_pixels[i][1].abscoords.origin.x +
			this.line_mapped_pixels[i][0].abscoords.origin.x );

                this.line_mapped_pixels[i][0].abscoords.origin.y = 0.5 * (this.line_mapped_pixels[i][1].abscoords.origin.y +
			this.line_mapped_pixels[i][0].abscoords.origin.y );

                this.line_mapped_pixels[i][0].z_buffer = 0.5 * (this.line_mapped_pixels[i][1].z_buffer +
			this.line_mapped_pixels[i][0].z_buffer );

            }
	

	}
        if(this.covered_clipped[array_of_lines[i].vi2])
	{
            if (this.line_mapped_pixels[i][3] == 0) //linear interpolation
            {

                this.line_mapped_pixels[i][1].abscoords.origin.x = 0.5 * (this.line_mapped_pixels[i][1].abscoords.origin.x +
			this.line_mapped_pixels[i][0].abscoords.origin.x );

                this.line_mapped_pixels[i][1].abscoords.origin.y = 0.5 * (this.line_mapped_pixels[i][1].abscoords.origin.y +
			this.line_mapped_pixels[i][0].abscoords.origin.y );

                this.line_mapped_pixels[i][1].z_buffer = 0.5 * (this.line_mapped_pixels[i][1].z_buffer +
			this.line_mapped_pixels[i][0].z_buffer );
	    }

	}
	


    }

}



function calvertices(array_of_vertices) {



if(this.mapped[0] == -1)
{
for (i = 0; i < array_of_vertices.length; i++)
{this.mapped[i] = {x:0,y:0};}
}



//this.perspective = false;
    if (this.perspective) {
        for (i = 0; i < array_of_vertices.length; i++) {


            vertex_camera_vector = this.getOrigin().GetVector(array_of_vertices[i].getAbsPos());
            this.x_comp[i] = GetDotProduct(this.getXvector(),vertex_camera_vector);
            this.y_comp[i] = GetDotProduct(this.getYvector(),vertex_camera_vector);
            this.z_comp[i] = GetDotProduct(this.getZvector(),vertex_camera_vector);

            /*this.scale[i] = this.near_dist/this.z_comp[i];*/
            this.scale[i] = 1 / this.z_comp[i];
            this.near_clipped[i] = (this.z_comp[i] < this.near_dist);
            this.far_clipped[i] = (this.z_comp[i] > this.far_dist);

          //  delete this.mapped[i];
          //  this.mapped[i] = {x:0,y:0};//new Point2D(0, 0);

            this.mapped[i].x = Math.round((this.heightf * this.x_comp[i] * this.scale[i] + this.viewport.whole_win_width / 2) *
                this.viewport.r1w + this.viewport.origin_x);
            this.mapped[i].y = Math.round((this.viewport.whole_win_height / 2 - this.heightf * this.y_comp[i] * this.scale[i]) *
                this.viewport.r1h + this.viewport.origin_y);


	    if(array_of_vertices[i].covered){this.covered_clipped[i] =true; continue;}


            this.right_clipped[i] = (this.mapped[i].x > ((this.viewport.origin_x + this.viewport.width)));
            this.left_clipped[i] = (this.mapped[i].x < (this.viewport.origin_x));

            this.bottom_clipped[i] = (this.mapped[i].y > (this.viewport.origin_y + this.viewport.height));
            this.top_clipped[i] = (this.mapped[i].y < (this.viewport.origin_y));

            this.inside_frustum[i] = (!(this.near_clipped[i] ||
                this.far_clipped[i] ||
                this.right_clipped[i] ||
                this.left_clipped[i] ||
                this.bottom_clipped[i] ||
                this.top_clipped[i]));

            this.line_clipped[i] = -1; // as initialization


        }

    } 

 

}




function cal1vertex(array_of_vertices,i) {
//this.perspective = false;
    if (this.perspective) {


            vertex_camera_vector = this.getOrigin().GetVector(array_of_vertices[i].getAbsPos());
            this.x_comp[i] = GetDotProduct(this.getXvector(),vertex_camera_vector);
            this.y_comp[i] = GetDotProduct(this.getYvector(),vertex_camera_vector);
            this.z_comp[i] = GetDotProduct(this.getZvector(),vertex_camera_vector);

            /*this.scale[i] = this.near_dist/this.z_comp[i];*/
            this.scale[i] = 1 / this.z_comp[i];
            this.near_clipped[i] = (this.z_comp[i] < this.near_dist);
            this.far_clipped[i] = (this.z_comp[i] > this.far_dist);

            this.mapped[i].x = Math.round((this.heightf * this.x_comp[i] * this.scale[i] + this.viewport.whole_win_width / 2) *
                this.viewport.r1w + this.viewport.origin_x);
            this.mapped[i].y = Math.round((this.viewport.whole_win_height / 2 - this.heightf * this.y_comp[i] * this.scale[i]) *
                this.viewport.r1h + this.viewport.origin_y);

	   if(array_of_vertices[i].covered){this.covered_clipped[i] =true; return;}

            this.right_clipped[i] = (this.mapped[i].x > ((this.viewport.origin_x + this.viewport.width)));
            this.left_clipped[i] = (this.mapped[i].x < (this.viewport.origin_x));

            this.bottom_clipped[i] = (this.mapped[i].y > (this.viewport.origin_y + this.viewport.height));
            this.top_clipped[i] = (this.mapped[i].y < (this.viewport.origin_y));

            this.inside_frustum[i] = (!(this.near_clipped[i] ||
                this.far_clipped[i] ||
                this.right_clipped[i] ||
                this.left_clipped[i] ||
                this.bottom_clipped[i] ||
                this.top_clipped[i]));

            this.line_clipped[i] = -1; // as initialization


        

    } 

    // orthogonal worked this way, but - moving front and back, doesn't work, all works exept this
    else //orthogonal -  working just the front and back of camera motion don't work, all fine
    {

            vertex_pos = {x:array_of_vertices[i].getAbsPos().x,
                y:array_of_vertices[i].getAbsPos().y,
                z:array_of_vertices[i].getAbsPos().z};

		
            z_vector = this.getZvector();
            this.z_comp[i] = GetDotProduct(z_vector,vertex_pos);
            vertex_pos.MoveLinear(z_vector, 0 - (this.z_comp[i] + this.near_dist));

            vertex_camera_vector = this.getOrigin().GetVector(vertex_pos);


            this.x_comp[i] = GetDotProduct(this.getXvector(),vertex_camera_vector);
            this.y_comp[i] = GetDotProduct(this.getYvector(),vertex_camera_vector);

            this.scale[i] = 1 / this.z_comp[i];

            this.near_clipped[i] = (this.z_comp[i] < 0);
            this.far_clipped[i] = (this.z_comp[i] > this.far_dist);

           // delete this.mapped[i];
           // this.mapped[i] = new Point2D(0, 0);
	    this.heightf = 4; //on increase, every object increases height and width, and vice versa

            this.mapped[i].x = Math.round((this.heightf * this.x_comp[i] + this.viewport.whole_win_width / 2) *
                this.viewport.r1w + this.viewport.origin_x);
            this.mapped[i].y = Math.round((this.viewport.whole_win_height / 2 - this.heightf * this.y_comp[i]) *
                this.viewport.r1h + this.viewport.origin_y);

        	if(array_of_vertices[i].covered){this.covered_clipped[i] =true; return;}

            this.right_clipped[i] = (this.mapped[i].x > ((this.viewport.origin_x + this.viewport.width)));
            this.left_clipped[i] = (this.mapped[i].x < (this.viewport.origin_x));

            this.bottom_clipped[i] = (this.mapped[i].y > ((this.viewport.origin_y + this.viewport.height)));
            this.top_clipped[i] = (this.mapped[i].y < (this.viewport.origin_y));

            this.inside_frustum[i] = (!(this.near_clipped[i] ||
                this.far_clipped[i] ||
                this.right_clipped[i] ||
                this.left_clipped[i] ||
                this.bottom_clipped[i] ||
                this.top_clipped[i]));

        }
    


}


function cal1vertex_v2(x_y_z) {
		
            vertex_camera_vector = this.getOrigin().GetVector(x_y_z);
            x_comp = GetDotProduct(this.getXvector(),vertex_camera_vector);
            y_comp = GetDotProduct(this.getYvector(),vertex_camera_vector);
            z_comp = GetDotProduct(this.getZvector(),vertex_camera_vector);

            /*this.scale[i] = this.near_dist/this.z_comp[i];*/
            scale = 1 / z_comp;

            near_clipped = (z_comp < this.near_dist);
            far_clipped = (z_comp > this.far_dist);

            mappedx = Math.round((this.heightf * x_comp * scale + this.viewport.whole_win_width / 2) *
                this.viewport.r1w + this.viewport.origin_x);
            mappedy = Math.round((this.viewport.whole_win_height / 2 - this.heightf * y_comp * scale) *
                this.viewport.r1h + this.viewport.origin_y);

	

            right_clipped = (mappedx > ((this.viewport.origin_x + this.viewport.width)));
            left_clipped = (mappedx < (this.viewport.origin_x));

            bottom_clipped = (mappedy > (this.viewport.origin_y + this.viewport.height));
            top_clipped = (mappedy < (this.viewport.origin_y));


            inside_frustum = (!(near_clipped ||
                far_clipped ||
                right_clipped ||
                left_clipped ||
                bottom_clipped ||
                top_clipped));

       	return [mappedx,mappedy,scale,inside_frustum];
}


function deleteCamera() {
    this.path.deleteList();
    delete this.path;
    delete this.viewport;
}

function printCameraUsage() {
    txt = "this camera has an object of coord sys<br/>";
    txt += "it is initially assigned to origin{0,0,0,0} and Identity vectors.<br/>";
    txt += "this camera also has DCLL to save path, one can save current coordinate sys<br/>";
    txt += "or pop it to be activated <br/>";
    txt += "smart camera also has smart clipping parameters<br/>";
    txt += "my current coordinate system:<br/>";
    txt += this.path.current.value.howto();

    return txt;
}


function MoveCameraFront() {
	this.path.current.value.origin.MoveLinear(this.getZvector(), this.motionstep);
}

function MoveCameraBack() {
	this.path.current.value.origin.MoveLinear(this.getZvector(), -this.motionstep);
}

function MoveCameraRight() {
    this.path.current.value.origin.MoveLinear(this.getXvector(), this.motionstep);
}

function MoveCameraLeft() {
    this.path.current.value.origin.MoveLinear(this.getXvector(), -this.motionstep);
}

function MoveCameraUp() {
    this.path.current.value.origin.MoveLinear(this.getYvector(), this.motionstep);
}

function MoveCameraDown() {
    this.path.current.value.origin.MoveLinear(this.getYvector(), -this.motionstep);
}

function MoveCameraLinear(tx, ty, tz) {
    this.path.current.value.origin.MoveLinear({x:tx, y:ty, z:tz}, this.motionstep);
}