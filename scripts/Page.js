var projects = [];
var focusedProject = 0;
var focusedTitleFixed = false;
var direction = "prev";
var bgColour = null;
var textColour = null;
var numProjects = 0;
var numProjectsLoaded = 0;

function init () {
    $.getJSON("assets/projects.json", function(json) {
    	// debugger;
	    numProjects = json.projects.length;
	    for (var i = 0; i < json.projects.length; i++){
	    	json.projects[i].cb = loadedCb;
    		projects.push(new StyledProjectSet(json.projects[i]));
    	}

    	// FIX THIS AFTER, need to load shit but set timeout for now
    	// animateAbout();
    	// window.setTimeout(run, 500);
	});
}

function loadedCb() {
	numProjectsLoaded++;
	var perc = Math.round(numProjectsLoaded/numProjects*100) + "%";

	$("#loading_screen_text").html("LOADING(" + perc + ")");

	if (numProjectsLoaded == numProjects) {
		console.log("all projects loaded");
		window.scrollTo(0, 0);
		$("#loading_screen").remove();
		$(".project_title_container").css({"opacity" : 1});
		run();
	}
}

function run() {
	for (var i = 0; i < projects.length; i++){
		projects[i].setPositions();
	}
	animateAbout();
	render();
}

function render() {
	animateTitles();
	picturesFadeUp();
	animateInfo();
	animateBackgrounds();
	window.requestAnimationFrame(render);
}

function animateAbout() {
	var oldTop = $("#header_text").css("top");
	$("#header_text").css({"top" : "-=100px"});
	$("#header_text").animate({opacity : 1, top : oldTop}, 750);

	oldTop = $("#logo").css("top");
	$("#logo").css({"top" : "-=100px"});
	$("#logo").animate({opacity : 1, top : oldTop}, 750, function() {

		oldTop = $("#main_title").css("top");
		$("#main_title").css({"top" : "+=100px"});
		$("#main_title").animate({opacity : 1, top : oldTop}, 750, function() {
			oldTop = $("#services").css("top");
			$("#services").css({"top" : "+=100px"});
			$("#services").animate({opacity : 1, top : oldTop}, 750, function() {
				oldTop = $("#clients").css("top");
				$("#clients").css({"top" : "+=100px"});
				$("#clients").animate({opacity : 1, top : oldTop}, 750, function() {
					oldTop = $("#contact").css("top");
					$("#contact").css({"top" : "+=100px"});
					$("#contact").animate({opacity : 1, top : oldTop}, 750, function() {
						oldTop = $("#black_line").css("bottom");
						$("#black_line").css({"bottom" : "-=100px"});
						$("#black_line").animate({opacity : 1, bottom : oldTop}, 750, function() {
						
						});
					});
				});
			});
		});
	});
}

function animateBackgrounds() {
	var scroll = window.pageYOffset;
	var middleOfScreen = scroll + window.innerHeight/2;

	if (scroll < window.innerHeight/2) {
		$('body').css({"background-color" : "#ffffff", "color" : "#000000"});
		$('#black_line').css({"border-bottom" : "2px solid " + "#000000"});
		$('#logo').css({"fill" : "#000000"});
		bgColour = "#ffffff";
		textColour = "#000000";
	}

	for (var i = 0; i < projects.length; i++) {
		var topOfFocused = projects[i].getTopPosition();
		var bottomOfFocused = projects[i].getBottomPosition();

		if (i + 1 == projects.length) {
			var topOfNext = Infinity;
		} else {
			var topOfNext = projects[i + 1].getTopPosition();
		}

		if (bgColour == projects[i].getBgColour() &&
			textColour == projects[i].getTextColour()) {
				continue;
		}

		if (topOfFocused < middleOfScreen 
			&& topOfNext > middleOfScreen) {

			projects[i].setTheme();
			bgColour = projects[i].getBgColour();
			textColour = projects[i].getTextColour();
		}
	}
}

function picturesFadeUp() {
	var scroll = window.pageYOffset;
	var middleOfScreen = scroll + window.innerHeight*0.7;

	var images = projects[focusedProject].getImagePositions();
	var opcs = projects[focusedProject].getImageOpacities();

	for (var i = 0; i < images.length; i++) {
		if (images[i] < middleOfScreen && opcs[i] != 1) {
			projects[focusedProject].fadeInUp(i);
		}
	}

	if (focusedProject + 1 != projects.length) {
		images = projects[focusedProject + 1].getImagePositions();
		opcs = projects[focusedProject + 1].getImageOpacities();

		if (images[0] < middleOfScreen && opcs[0] != 1) {
			projects[focusedProject + 1].fadeInUp(0);
		}
	}
}

function animateInfo() {
	var scroll = window.pageYOffset;
	var middleOfScreen = scroll + window.innerHeight*0.8;

	for (var i = 0; i < projects.length; i++) {
		var topOfFocused = projects[i].getTopPosition();
		var bottomOfFocused = projects[i].getBottomPosition();

		if ((topOfFocused < middleOfScreen) && (projects[i].getInfoOpacity() == 0)) {
			projects[i].fadeInUpInfo();
		}
	}
	
}

function animateTitles() {
	var topOfFocused = projects[focusedProject].getTopPosition();
	var bottomOfFocused = projects[focusedProject].getBottomPosition();

	// if (window.pageYOffset < )

	if (window.pageYOffset < window.innerHeight) {
		projects[0].unfixTitle();
		focusedTitleFixed = false;
		direction = "prev";
	}

	if (focusedProject == projects.length - 1) {
		var topOfNext = Infinity;
		var bottomOfNext = -Infinity;
	} else {
		var topOfNext = projects[focusedProject + 1].getTopPosition();
		var bottomOfNext = projects[focusedProject + 1].getBottomPosition();
	}

	if (focusedProject == 0) {
		var topOfPrev = Infinity;
		var bottomOfPrev = -Infinity;
	} else {
		var topOfPrev = projects[focusedProject - 1].getTopPosition();
		var bottomOfPrev = projects[focusedProject - 1].getBottomPosition();
	}

	if (focusedTitleFixed) { // check if the focused title is fixed, extra rc prevention
		if (topOfNext < window.pageYOffset + window.innerHeight) {
			// the top of the next project container hit the bottom of the screen
			projects[focusedProject].unfixTitle("lower");
			direction = "next";
			focusedTitleFixed = false;
		} else if (bottomOfPrev > window.pageYOffset) {
			// the bottom of the prev project container hit the top of the screen
			direction = "prev";
			projects[focusedProject].unfixTitle("upper");
			focusedTitleFixed = false;
		}
	} else {
		switch (direction) {
			case "next":
				if (bottomOfFocused > window.pageYOffset + window.innerHeight) {
					// the bottom of the focused project container hit the bottom of the screen
					projects[focusedProject].fixTitle();
					focusedTitleFixed = true;
				} else if (topOfNext < window.pageYOffset) {
					// the top of the next project container hit the top of the screen
					focusedProject++;
					projects[focusedProject].fixTitle();
					focusedTitleFixed = true;
				}
				break;
			case "prev":
				if (topOfFocused < window.pageYOffset) {
					// the top of the focused project container hit the top of the screen
					projects[focusedProject].fixTitle();
					focusedTitleFixed = true;
				} else if (bottomOfPrev > window.pageYOffset + window.innerHeight) {
					// the bottom of the prev project container hit the bottom of the screen
					focusedProject--;
					projects[focusedProject].fixTitle();
					focusedTitleFixed = true;
				}
				break;
		}
	}
}

$( document ).ready(function() {
	init();
});