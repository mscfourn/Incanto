{
  "configurationSettings":[{
    "category": "<b>Application Settings</b>",
    "fields": [{
      "type": "string",
      "fieldName": "title",
      "tooltip": "Specify a title for the application",
      "placeHolder": "Title",
      "label": "Title:"
    },{
      "type": "string",
      "fieldName": "subtitle",
      "tooltip": "Specify a subtitle for the application",
      "placeHolder": "Subtitle",
      "label": "Subtitle:"
    }]
  },{
    "category": "<b>Webmaps</b>",
    "fields": [{
      "fieldName": "webmap",
      "label": "Webmap IDs:",
      "stringFieldOption": "textarea",
      "tooltip": "Enter web map ids for maps separated by commas"
    },{
      "type": "paragraph",
      "value": "Enter webmap ID's separated with a comma. The ID can be found in the URL when looking at the details page of a web map."
    },{
      "type": "string",
      "fieldName": "mapTitle",
      "label": "Map Titles:",
      "stringFieldOption": "textarea",
      "tooltip": "Enter labels for tabs separated by commas"
    },{
      "type": "paragraph",
      "value": "Enter the labels to be displayed on accodion, separated with a comma. The order of the labels must be in the same order as the webmaps ID's above that they are associated with."
    },{
      "type": "boolean",
      "fieldName": "syncMaps",
      "label": "Sync scale and location of maps",
      "tooltip": ""
    }]
  }],
    "values":{
    }
}