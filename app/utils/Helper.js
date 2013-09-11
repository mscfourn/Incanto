define(["dojo/cookie", "dojo/has","dojo/_base/array"], function(cookie, has, array){
	/**
	 * Helper
	 * @class Helper
	 * 
	 * Collection of helper functions
	 *
	 * NOTE: Requires Jquery
	 */
	return {
		resetLayout: function()
		{
			$(".region-center").each(function(){
				var l = $(this).siblings(".region-left:visible").outerWidth(),
					r = $(this).siblings(".region-right:visible").outerWidth(),
					t = $(this).siblings(".region-top:visible").outerHeight(),
					b = $(this).siblings(".region-bottom:visible").outerHeight(),
					x = l + r,
					y = t + b;
				$(this).css({
					"height" : $(this).parent().outerHeight() - y,
					"width" : $(this).parent().outerWidth() - x
				});
			});
		},

		syncMaps: function(maps,currentMap,extent)
		{
			dojo.forEach(maps,function(map){
				if (map !== currentMap){
					map.setExtent(extent);
				}
			});
		},

		getWebmaps: function(webmaps)
		{
			if(webmaps.indexOf(',') !== -1){
				var mapIds = webmaps.split(',');
				webmapresults = array.map(mapIds, function (mapId) {
					return {
						id: mapId,
						title: ""
					};
				});
			}
			else{
				var previewWebMap = {
					id: webmaps,
					title: ""
				};

				webmapresults = [previewWebMap];
			}
			return webmapresults;
		},

		getWebmapTitles: function(titles)
		{
			if(titles.indexOf(',') !== -1){
				var mapTitles = titles.split(',');
				webmapresults = array.map(mapTitles, function (item) {
					return item;
				});
			}
			else{
				var previewWebMap = titles;

				webmapresults = [previewWebMap];
			}
			return webmapresults;
		}
	}
});