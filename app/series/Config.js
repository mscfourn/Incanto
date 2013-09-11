define([],
	function ()
	{
		configOptions = {
			//The appid for the configured application
			appid: "",
			//The web map id
			webmaps: [
				{id:"d1692d20c7d1440da4b2a1272b9ddc4a",
				title: "La ligne Romanie - Mer Noire (1283-1453)"},
				{id:"c65ab80339f041d397a7b5a2ffd9654e",
				title:"La ligne Arménie - Chypre (1294-1453)"},
				{id:"15c6345315784d23aa964bf84696402a",
				title:"La ligne d'Alexandrie (1301-1453)"},
				{id:"d820146c47484d6fafbf715facff2402",
				title:"La ligne de Beyrouth (1374-1453)"},
				{id:"392d7aa99cf246f2a4f99cbef896fc60",
				title:"La ligne de Flandre (1310-1453)"},
				{id:"5122017dd23f455b80892be641542d6b",
				title:"La ligne d'Aigues-Mortes (1412-1453)"},
				{id:"1addc8c5095b4b8fba870b0cccfa906f",
				title:"La ligne de Barbarie (1437-1464)"},
				{id:"dd2c88657461462bbf4b8618328f5a93",
				title:"Le réseau maritime de l'Incanto"}
				],
			//Enter a title, if no title is specified, the webmap's title is used.
			title: "VENISE ET LE SYSTEME DE L'INCANTO (1283-1453)",
			//Enter a subtitle, if not specified the ArcGIS.com web map's summary is used
			subtitle: "Ou la mise en place de sept lignes maritimes régulières fondées sur un système d'enchères.",
			//Sync maps scale and location
			syncMaps: true,
			//Display geocoder search widget
			geocoderWidget: false,
			// Specify a proxy for custom deployment
			proxyurl: "",
			//specify the url to a geometry service
			geometryserviceurl: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
			//If the webmap uses Bing Maps data, you will need to provided your Bing Maps Key
			bingmapskey : "",
			//Modify this to point to your sharing service URL if you are using the portal
			sharingurl: "http://www.arcgis.com/sharing/rest/content/items"
		}
	}
);
