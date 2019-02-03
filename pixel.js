var Pixel = function()
{
	
	// abs coords pos + normal + 2 ortho tangents
	this.abscoords = new CoordSys();//√

	//pointer to object it is involved in(!)
	this.objPtr;//√ points to SceneObj

	//vertex visual props, eg. material props, color is got at initiazation time from obj, either by coloring the obj, or from
	//obj texture
	this.tx = 0;//?
	this.ty = 0;//?

	this.z_buffer;

	this.red;// = red;
	this.green;// = green;
	this.blue;// = blue;
	this.alpha;// = alpha;

	//this.material_props;//may be will call it by objPtr;

	//interface
	this.getNormal = function(){return this.abscoords.vectors.m.getYvector();};//√
	this.getTangent = function(){return this.abscoords.vectors.m.getXvector();};//√getXvector or Z

	this.delete = deletePixel;//√

	this.original_vertex_index = -1;
	this.dup = duplicate;

	this.checkEquals = function(p){

	return (
		(p.abscoords.origin.x == this.abscoords.origin.x)&&
		(p.abscoords.origin.y == this.abscoords.origin.y)&&

		(p.z_buffer == this.z_buffer)&&

		(p.red == this.red)&&
		(p.green == this.green)&&
		(p.blue == this.blue)&&
		(p.alpha == this.alpha)

		);

	};

}

function duplicate()
{
	newp = new Pixel();
	newp.abscoords.delete()
	newp.abscoords = this.abscoords.dup();

	newp.objPtr = this.objPtr;
	newp.tx = this.tx;
	newp.ty = this.ty;

	newp.z_buffer = this.z_buffer;
	newp.red = this.red;
	newp.green = this.green;
	newp.blue = this.blue;
	newp.alpha = this.alpha;

	//duplicate material props

	newp.original_vertex_index = this.original_vertex_index;

	return newp;
}


function deletePixel(){
	//call the delete this.abscoords.delete
	this.abscoords.delete();
	delete this.abscoords;
}


function checkifpixelequalsthis(p)
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
