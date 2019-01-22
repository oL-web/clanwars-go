const markerTypes = require("../resources/markerTypes");

const getMarkerType = marker => {
  const markerType = markerTypes.find(m => m.matchingTypes.find(type => marker.types.indexOf(type) !== -1));

  return markerType;
};

module.exports = getMarkerType;
