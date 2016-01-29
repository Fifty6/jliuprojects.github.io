function StyledProjectSet(json) {
	var self = this;
	this.title = json.title;
	this.description = json.description;
	this.metadata = json.metadata;
	this.link = json.link;
	this.textColour = json.textcolour;
	this.bgColour = json.bgcolour;
	this.topPosition = Infinity;
	this.bottomPosition = -Infinity;
	this.imagePositions = [];
	this.imageOpacities = [];
	this.infoOpacity = 0;
	this.numImagesLoaded = 0;
	this.numImages = json.images.length;

	// this.imageSrc = imageSrc || "assets/defaultImage.png";

	this.html = [];
	this.html["container"] = $("<div class='project_container'></div>");
	this.html["link"] = $("<h3 class='project_link'>" + this.link + "</h3>");
	this.html["title"] = $("<div class='project_title_container'><h1 class='project_title'>"  + this.title + "</h1></div>");
	this.html["description"] = $("<h3 class='project_description'>" + this.description + "</h3>");
	this.html["metadata"] = $("<h3 class='project_metadata'>" + this.metadata + "</h3>");
	this.html["images"] = [];
	
	this.html["container"].append(this.html["link"]);
	this.html["container"].append(this.html["metadata"]);
	this.html["container"].append(this.html["description"]);
	// debugger;
	for (var i = 0; i < json.images.length; i++){
		this.html["images"].push($("<img class='project_image' src='" + json.images[i].url + "'>"));
	 	this.html["container"].append(this.html["images"][i]);
	 	this.html["images"][i].load(function() {
	 		self.numImagesLoaded++;
	 		console.log(this.src + " loaded");
	 		if (self.numImagesLoaded == self.numImages) {
	 			json.cb();
	 		}
	 	});
	}
	for (var i = 0; i < json.images.length; i++){
		this.imageOpacities.push(0);
	}
	
	this.html["container"].append(this.html["title"]);
	$("body").append(this.html["container"]);
}

// fix title position on screen
StyledProjectSet.prototype.fixTitle = function() {
	this.html["title"].css({"top" : 0, "position" : "fixed"});
};

StyledProjectSet.prototype.unfixTitle = function(side) { 
	var top = [];
	top["upper"] = 0
	top["lower"] = this.html["container"].height() - window.innerHeight;

	this.html["title"].css({"top" : top[side], "position" : "absolute"});
};

StyledProjectSet.prototype.setPositions = function() {
	this.html["title"].find("h1").css({"top" : window.innerHeight/2});
	this.topPosition = this.html["container"].offset().top;
	this.bottomPosition = this.html["container"].offset().top + this.html["container"].height();

	for (var i = 0; i < this.html["images"].length; i++) {
		this.imagePositions.push(this.html["images"][i].offset().top);
	}
};

StyledProjectSet.prototype.getImagePositions = function() {
	return this.imagePositions;
};

StyledProjectSet.prototype.getImageOpacities = function() {
	return this.imageOpacities;
};

StyledProjectSet.prototype.getInfoOpacity = function() {
	return this.infoOpacity;
};

StyledProjectSet.prototype.getTopPosition = function() {
	return this.topPosition;
};

StyledProjectSet.prototype.getBottomPosition = function() {
	return this.bottomPosition;
};

StyledProjectSet.prototype.fadeInUp = function(index) {
	var oldTop = this.html["images"][index].css("top");

	this.html["images"][index].css({"top" : "+=100px"});
	this.html["images"][index].animate({opacity : 1, top : oldTop}, 1000);

	this.imageOpacities[index] = 1;
};

StyledProjectSet.prototype.fadeInUpInfo = function() {
	var linkOldTop = this.html["link"].css("top");
	var descriptionOldTop = this.html["description"].css("top");
	var metadataOldTop = this.html["metadata"].css("top");

	this.html["link"].css({"top" : "+=100px"});
	this.html["link"].animate({opacity : 1, top : linkOldTop}, 1000);

	this.html["description"].css({"top" : "+=100px"});
	this.html["description"].animate({opacity : 1, top : descriptionOldTop}, 1000);

	this.html["metadata"].css({"top" : "+=100px"});
	this.html["metadata"].animate({opacity : 1, top : metadataOldTop}, 1000);
	this.infoOpacity = 1;
};

StyledProjectSet.prototype.setTheme = function() {
	$('body').css({"background-color" : this.bgColour, "color" : this.textColour});
	$('#black_line').css({"border-bottom" : "2px solid " + this.textColour});
	$('#logo').css({"fill" : this.textColour});
};

StyledProjectSet.prototype.getBgColour = function() {
	return this.bgColour;
};

StyledProjectSet.prototype.getTextColour = function() {
	return this.textColour;
};


