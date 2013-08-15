define(["esri/map",
		"esri/arcgis/utils",
		"esri/layout",
		"esri/widgets",
		"dojo/has",
		"storymaps/utils/Helper"],
	function(
		Map,
		Utils,
		Layout,
		Widgets,
		Has,
		Helper)
	{
		/**
		 * Core
		 * @class Core
		 *
		 * Geoblog viewer Main class
		 */

		//
		// Initialization
		//

		$(window).resize(function(){
			Helper.resetLayout();
			setAccordionContentHeight();
			responsiveLayout();
		});

		$(document).ready(function(){
			Helper.resetLayout();
			$(".loader").fadeIn();
		});

		function init()
		{
			app = {
				maps: [],
				currentMap: null
			}

			if (!configOptions.sharingurl) {
				if(location.host.match("localhost") || location.host.match("storymaps.esri.com") || location.host.match("esri.github.io"))
					configOptions.sharingurl = "http://www.arcgis.com/sharing/rest/content/items";
				else
					configOptions.sharingurl = location.protocol + '//' + location.host + "/sharing/content/items";
			}

			if (configOptions.geometryserviceurl && location.protocol === "https:")
				configOptions.geometryserviceurl = configOptions.geometryserviceurl.replace('http:', 'https:');

			esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
			esri.config.defaults.io.proxyUrl = configOptions.proxyurl;
			esri.config.defaults.geometryService = new esri.tasks.GeometryService(configOptions.geometryserviceurl);

			var urlObject = esri.urlToObject(document.location.href);
			urlObject.query = urlObject.query || {};

			if (urlObject.query.embed || urlObject.query.embed === "") {
				$("#banner").hide();
			}

			//is an appid specified - if so read json from there
			if(configOptions.appid || (urlObject.query && urlObject.query.appid)){
				var appid = configOptions.appid || urlObject.query.appid;
				var requestHandle = esri.request({
					url: configOptions.sharingurl + "/" + appid + "/data",
					content: {f:"json"},
					callbackParamName:"callback",
					load: function(response){
						if(response.values.title !== undefined){configOptions.title = response.values.title;}
						if(response.values.subtitle !== undefined){configOptions.subtitle = response.values.subtitle;}
						if(response.values.webmap !== undefined) {configOptions.webmaps = Helper.getWebmaps(response.values.webmap);}
						if(response.values.mapTitle !== undefined) {
							dojo.forEach(Helper.getWebmapTitles(response.values.mapTitle),function(item,i){
								if(configOptions.webmaps[i])
									configOptions.webmaps[i].title = item;
							});
						}
						if(response.values.syncMaps !== undefined) {configOptions.syncMaps = response.values.syncMaps;}
						
						loadMaps();
						initBanner();
					},
					error: function(response){
						var e = response.message;
						alert("Error: " +  response.message);
					}
				});
			}
			else{
				loadMaps();
				initBanner();
			}
		}

		function initBanner()
		{
			$("#title").html(configOptions.title);
			$("#subtitle").html(configOptions.subtitle);

			//First layout setup called on app load
			Helper.resetLayout();
			responsiveLayout();
		}

		function loadMaps()
		{
			$("#map-pane").append('<div id="map'+app.maps.length+'" class="map"></div>');
			$("#legend-pane").append('<div id="legend'+app.maps.length+'" class="legend"></div>');
			$("#mobile-popup").append('<div class="mobile-popup-content"></div>');
			$(".map").last().fadeTo(0,0);

			var popup = new esri.dijit.Popup({
			}, dojo.create("div"));

			var mapDeferred = esri.arcgis.utils.createMap(configOptions.webmaps[app.maps.length].id,"map"+app.maps.length,{
				mapOptions: {
					extent: getExtent(),
					infoWindow: popup
				},
				bingMapsKey: configOptions.bingmapskey
			});

			mapDeferred.addCallback(function(response){

				var map = response.map;
				map.itemData = {
					title: configOptions.webmaps[app.maps.length].title || response.itemInfo.item.title || "",
					description: response.itemInfo.item.description || ""
				}

				app.maps.push(map);

				var layers = esri.arcgis.utils.getLegendLayers(response);

				if (map.loaded){
					if(app.maps.length <= configOptions.webmaps.length){
						if(app.maps.length < configOptions.webmaps.length){
							loadMaps();
						}
						createAppItems(map, layers, app.maps.length - 1);
					}
				}
				else {
					dojo.connect(map, "onLoad", function() {
						if(app.maps.length <= configOptions.webmaps.length){
							if(app.maps.length < configOptions.webmaps.length){
								loadMaps();
							}
							createAppItems(map, layers, app.maps.length - 1);
						}
					});
				}

				dojo.connect(map,"onUpdateEnd",function(){
					if (!map.firstLoad){
						map.firstLoad = true;
						setAccordionContentHeight();
						if(map === app.maps[0]){
							appReady();
						}
					}
				});

				dojo.connect(map,"onExtentChange",function(){
					if (configOptions.syncMaps && map === app.currentMap){
						Helper.syncMaps(app.maps,app.currentMap,map.extent);
					}
				});

				dojo.connect(map.infoWindow,"onShow",function(){
					var mapIndex = $.inArray(map,app.maps);
					if($("#application-window").width() <= 780){
						if($(".mobile-popup-content").eq(mapIndex).html() === ""){
							$(".mobile-popup-content").each(function(i){
								$(this).append($(".contentPane").eq(i));
							});
						}
						$("#header-text").stop(true,true).slideUp();
						$("#legend-pane").stop(true,true).slideUp();
						$(".mobile-popup-content").eq(mapIndex).show();
						$("mobile-popup").slideDown();
						$("#close-mobile-popup").show();
					}
					else{
						if($(".esriPopup .sizer.content").eq(mapIndex).html() === ""){
							$(".esriPopup .sizer.content").each(function(i){
								$(this).append($(".contentPane").eq(i));
							});
						}
					}
				});

				dojo.connect(map.infoWindow,"onHide",function(){
					$(".mobile-popup-content").hide();
					$("mobile-popup").hide();
					$("#close-mobile-popup").hide();
				});

				createAccordionPanel(app.maps.length,response);

			});
		}

		function getExtent()
		{
			if(configOptions.syncMaps && app.maps.length > 0){
				return (app.maps[0].extent);
			}
		}

		function createAppItems(map,layers,index)
		{
			//ADD INITIAL EXTENT BUTTON TO MAPS
			$(".esriSimpleSliderIncrementButton").last().addClass("zoomButtonIn").after("<div class='esriSimpleSliderIncrementButton initExtentButton'><img style='margin-top:5px' src='resources/images/app/home.png'></div>");
			$(".initExtentButton").last().click(function(){
				map.setExtent(map._mapParams.extent);
			});

			if(configOptions.geocoderWidget){
				$("#" + map.container.id).append('<div id="'+map.container.id+'geocoder" class="geocoderWidget"></div>');
				var geocoder = new esri.dijit.Geocoder({
					map: map
				},map.container.id+'geocoder');
				geocoder.startup();
			}

			//ADD LEGEND
			if(layers.length > 0){
				var legend = new esri.dijit.Legend({
					map: map,
					layerInfos: layers
				},"legend"+index);
				legend.startup();
			}
			else{
				$(".legend").eq(index).html("This map has no layers to show in the legend.");
			}
		}

		function appReady()
		{
			//Show Map
			selectMap(0,400);

			//Hide loader
			$(".loader").fadeOut();

			app.currentMap = app.maps[0];

			$("#mobile-header").html(app.currentMap.itemData.title);

			$("#header-text").slideDown();

			//Set state of accordion
			$(".accordion-content").first().slideDown();
			$(".accordion-header").first().addClass("active");

			$("#accordion-toggle").click(function(){
				hidePopups();
				$("#side-pane").stop(true,true).slideToggle("fast",setAccordionContentHeight);
			});

			$(".legend-toggle").click(function(){
				hidePopups();
				if(Has("ie") <= 8){
					$("#legend-pane").toggle();
				}
				else{
					$("#legend-pane").stop(true,true).slideToggle(400,function(){
						if($("#application-window").width() <= 780){
							if($("#legend-pane").is(":visible")){
								$("#close-mobile-legend").show();
							}
							else{
								$("#close-mobile-legend").hide();
							}
						}
					});
				}
			});

			$(".intro-toggle").click(function(){
				hidePopups();
				$("#header-text").stop(true,true).slideToggle();
			});

			$(".mobile-popup-toggle").click(function(){
				hidePopups();
			});

			$(".map-toggle").click(function(){
				hidePopups();
				$("#side-pane").stop(true,true).slideUp();
				$("#legend-pane").stop(true,true).slideUp();
			});
		}

		function hidePopups()
		{
			dojo.forEach(app.maps,function(map){
				map.infoWindow.hide();
			});
		}

		function changeSelection(index)
		{
			var speed = 400;

			app.currentMap = app.maps[index];

			$("#mobile-header").html(app.currentMap.itemData.title);

			if(!$(".accordion-header").eq(index).hasClass("active")){
				$(".accordion-header.active").removeClass("active").next().slideUp(speed);
				$(".accordion-header").eq(index).addClass("active").next().slideDown(speed);
				selectMap(index,speed);
			}

			$(".legend").hide();
			$(".legend").eq(index).show();
		}

		function selectMap(mapIndex,speed)
		{
			$(".map").not($(".map").eq(mapIndex)).removeClass("active").fadeTo(speed,0);
			$(".map").eq(mapIndex).addClass("active").fadeTo(speed,1);
			dojo.forEach(app.maps,function(map){
				map.reposition();
			});
		}

		function createAccordionPanel(index,response)
		{
			var num = index,
				title = configOptions.webmaps[index - 1].title || response.itemInfo.item.title || "",
				description = response.itemInfo.item.description || "";
			$("#side-pane").append('<div class="accordion-header"><div class="accordion-header-arrow"></div><table><tr><td class="accordion-header-number">' + num + '</td><td class="accordion-header-title">' + title + '</td></tr></table></div>');
			$("#side-pane").append('<div class="accordion-content">' + description + '</div>');

			$(".accordion-header").last().click(function(){
				changeSelection(index - 1);
				if($(this).hasClass("active") && $("#application-window").width() <= 780 && $(this).next().height() > 20){
					$("#side-pane").slideUp();
				}
			});

			$(".accordion-content").click(function(){
				if($("#application-window").width() <= 780){
					$("#side-pane").slideUp();
				}
			});

			setAccordionContentHeight();
		}

		function setAccordionContentHeight()
		{
			var height = 0,
				compareHeight = $("#side-pane").outerHeight();


			$(".accordion-header").each(function(){
				height += $(this).outerHeight();
			});

			if (compareHeight - height - 1 < 200){
				$(".accordion-content").css("height","auto");
			}
			else{
				$(".accordion-content").outerHeight(compareHeight - height - 1);
			}

		}

		function responsiveLayout()
		{
			var appWidth = $("#application-window").width();

			hidePopups();

			if (appWidth <= 780){
				$("#header-text").removeClass("region-center").css({
					"height": "auto",
					"width": "auto"
				}).hide();
				$("#map-pane").prepend($("#side-pane"));
			}
			else{
				$("#header-text").addClass("region-center").show();
				$("#content").prepend($("#side-pane"));
				$("#side-pane").show();
			}
		}

		return {
			init: init
		}
	}
);
