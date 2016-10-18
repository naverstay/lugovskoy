var nav_container,
		nav,
		top_spacing = 15,
		waypoint_offset = 0,
		sections,
		doc,
		window,
		first_section,
		carousel_block,
		carousel,
		c_active_item = 1,
		carousel_block_html,
		navigation_links;

$(function($){

	//L.mapbox.accessToken = 'pk.eyJ1IjoiZ2xpdmVyYSIsImEiOiJpM0gxR3ZNIn0.uXIFe7sqYVOMJTblg7vRlQ';
	//
	//var map = L.mapbox.map('main_map', 'glivera.l24ebdfm')
	//		.setView([40, -74.50], 9);

	carousel_block = $(".carousel_container");
	carousel_block_html = $(".carousel_container").html();
	window = $(window);
	first_section = $('#section_1');
	doc = $(document);
	nav_container = $(".header");
	nav = $(".main_menu");
	sections = $(".sectionWP");
	navigation_links = $(".menu_link");

	$(".tabsBlock").tabs({
		activate: function(event, ui){

			var curTab = $('#' + $(ui.newPanel).attr('id')), oldTab = $('#' + $(ui.oldPanel).attr('id'));

			oldTab.find('.nicescrollBlock').getNiceScroll().hide();

			curTab.find('.nicescrollBlock').getNiceScroll().resize().show();

		}
	});

	$('.mapInfoHide').on('click', function(){

		$('.mapSection').toggleClass('hide_mod');

		return false;
	});

	$('.mapInfoShow').on('click', function(){

		$('.mapSection').removeClass('hide_mod');

		return false;
	});

	$('.nicescrollBlock').each(function(ind){
		var ns = $(this);

		ns.niceScroll({
			//cursorcolor       : "#666",
			//cursorfixedheight : 13,
			scrollspeed       : 10,
			cursorwidth       : 4,
			cursorborder      : 'none',
			cursorborderradius: 0,
			bouncescroll      : false,
			autohidemode      : false,
			railsclass        : ns.data('rails_class'),
			railpadding       : {top: 0, right: 0, left: 0, bottom: 0}
		});

	});

	$('.scrollTo').on('click', function(){
		var firedEl = $(this);

		scrollTo($(firedEl.attr("href")).offset().top, 1000);

		return false;
	});

	init_carousel();

	waypoints();
	resize_f();

	//init_map();
	//map_init()
});

function init_carousel(){

	var c_height = carousel_block.height(),
			init_w = Math.min(carousel_block.width() * .8114, c_height / .707) * .75;

	//console.log(init_w, init_w * .707);

	carousel = null;

	carousel = $("#carousel").css('height', init_w * .707).featureCarousel({
		containerWidth : 0,
		containerHeight: init_w * .707,
		startingFeature: c_active_item,

		//largeFeatureWidth : ($('.carousel_container').width() - 240) * .8126,

		//largeFeatureWidth : 707,
		//largeFeatureHeight: 498,
		//smallFeatureWidth : 606,
		//smallFeatureHeight: 400,

		smallFeatureOffset: (init_w * .707 - init_w * .707 * .85) / 2,
		largeFeatureWidth : init_w,
		largeFeatureHeight: init_w * .707,
		smallFeatureWidth : init_w * .85,
		smallFeatureHeight: init_w * .707 * .85,
		autoPlay          : 10000,
		carouselSpeed     : 200,
		topPadding        : (c_height - init_w * .707) / 2, // (init_w * .707 - 499) / 2,
		sidePadding       : (707 - init_w) / 2,
		clickedCenter     : function(el){
			$('.center_slide').removeClass('center_slide');
			$(el).addClass('center_slide');
		},
		movedToCenter     : function(el, ind){
			c_active_item = ind.currentCenterNum;
		}
	});

	$('.carousel_item').on('click', function(){
		if(!$(this).parent('.carousel-feature').hasClass('center_slide')) return false;
	});
	
}

function init_map(){

	var myLatlng = new google.maps.LatLng(-34.397, 150.644);
	var myOptions = {
		zoom     : 8,
		center   : myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById("main_map"), myOptions);

}

$(window).on('resize', function(){
	resize_f();
});

$(window).on('scroll', function(){
	scroll_f();
});

function resize_f(){

	navigation_links.each(function(){
		var firedEl = $(this),
				position = $(firedEl.attr("href")).offset().top;

		firedEl.attr('data-position', position);

	});

	carousel_block.html(carousel_block_html);

	init_carousel();

}

function scroll_f(){

	var scrollLeft = doc.scrollLeft();
	nav_container.css({
		'marginLeft' : (scrollLeft > 0 ? -scrollLeft : 0),
		'marginRight': (scrollLeft > 0 ? scrollLeft : 0)
	});

	if($(document).scrollTop() > first_section.height() - nav_container.outerHeight()){
		nav_container.stop().addClass("sticky");
	} else{
		nav_container.stop().removeClass("sticky");
	}
}

function waypoints(){

	navigation_links.click(function(event){

		navigation_links.removeClass('active');

		var firedEl = $(this);

		scrollTo(parseInt(firedEl.attr('data-position')), 1000, function(){

		});

		return false;
	});

	sections.waypoint({
		handler: function(event, direction){

			var active_section = $(this);

			if(direction === "up") active_section = active_section.prev();

			var active_link = $('.menu_link[href="#' + active_section.attr("id") + '"]');

			navigation_links.removeClass("active");
			active_link.addClass("active");

		},
		offset : 0
	})
}

function scrollTo(pos, speed, callback){

	$('html,body').animate({'scrollTop': pos}, speed);

	if(typeof(callback) == 'function'){
		callback();
	}

}

function initialize(){

	var MY_MAPTYPE_ID = 'custom_style';
	var mapOptions = {
				scrollwheel          : false,
				//navigationControl: false,
				mapTypeControl       : false,
				//scaleControl     : false,
				//draggable        : false,
				zoom                 : 16,
				center               : new google.maps.LatLng(55.766193, 37.625828),
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
				},
				mapTypeId            : MY_MAPTYPE_ID
			},
			featureOpts = [{
				"featureType": "road",
				"elementType": "geometry.stroke",
				"stylers"    : [{"color": "#ccc5bd"}]
			}, {"featureType": "administrative.land_parcel", "stylers": [{"color": "#808080"}, {"visibility": "off"}]}, {}];

	var map = new google.maps.Map(document.getElementById('main_map'),
			mapOptions);

	var companyPos = new google.maps.LatLng(55.768193, 37.629228);

	map = new google.maps.Map(document.getElementById('main_map'), mapOptions);

	var styledMapOptions = {
		name: 'Custom Style'
	};

	var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
	map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

	var image = {
		url   : 'i/marker.png',
		// This marker is 20 pixels wide by 32 pixels tall.
		size  : new google.maps.Size(120, 86),
		// The origin for this image is 0,0.
		origin: new google.maps.Point(0, 0),
		// The anchor for this image is the base of the flagpole at 0,32.
		anchor: new google.maps.Point(0, 86)
	};

	var customMarker = {
		path        : 'M115 0H5C2.24 0 0 2.24 0 5v50c0 2.76 2.24 5 5 5h10.01v26.01L37.58 60H115c2.76 0 5-2.24 5-5V5C120 2.24 117.76 0 115 0z',
		fillColor   : '#ff395a',
		fillOpacity : 1,
		scale       : 1,
		strokeColor : 'gold',
		strokeWeight: 0
	};

	var marker = new google.maps.Marker({
		position: companyPos,
		icon    : image,
		map     : map
	});

}

google.maps.event.addDomListener(window, 'load', initialize);