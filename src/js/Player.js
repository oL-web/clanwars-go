import randRange from "random-number-in-range";
import inRange from "lodash/inRange";
import cwgAPI from "./cwgAPI";
import generateNPC from "./generateNPC";
import getMarkerType from "../../helpers/getMarkerType";

class Player extends google.maps.Circle {
  constructor(obj) {
    super(obj);
    this.placesService = new google.maps.places.PlacesService(obj.map);
    this.lastDiscoveryCoords = { lat: 0, lng: 0 };
    this.promisifiedNearbySearch = options =>
      new Promise((resolve, reject) => {
        this.placesService.nearbySearch(options, results => {
          if (status !== "OK") return resolve([]);
          resolve(results);
        });
      });

    // mocked fn to reduce api calls to Places API
    // this.promisifiedNearbySearch = () => Promise.resolve([]);
  }
  async discoverNearbyPlaces(callback) {
    const distance = 0.0002;
    const last = this.lastDiscoveryCoords;
    const { lat, lng } = this.center.toJSON();

    if (Math.abs(last.lat - lat) < distance || Math.abs(last.lng - lng) < distance) return [];
    else this.lastDiscoveryCoords = { lat, lng };

    const [cwgMarkers, googleMarkers] = await Promise.all([
      cwgAPI.getNearbyMarkers(lat, lng),
      this.promisifiedNearbySearch({
        location: this.center,
        radius: this.radius
      })
    ]);

    const parseGoogleMarkers = googleMarkers => {
      const arr = [];

      googleMarkers.forEach(place => {
        if (place.types.indexOf("point_of_interest") === -1) return;
        const { lat, lng } = place.geometry.location.toJSON();
        const placeObj = {
          placeId: place.place_id,
          types: place.types,
          name: place.name,
          coords: [lng, lat],
          lvl: randRange(1, 10)
        };

        if (place.photos) {
          placeObj.photo = place.photos[0].getUrl({
            maxWidth: 200,
            maxHeight: 200
          });
        }

        arr.push(placeObj);
      });

      return arr;
    };

    const parsedMarkers = parseGoogleMarkers(googleMarkers);
    const parsedNoDupes = parsedMarkers.filter(gm => !cwgMarkers.find(cm => cm.placeId === gm.placeId));

    if (Math.random() > 0.5) {
      const npc = generateNPC();

      parsedNoDupes.forEach(marker => {
        if (getMarkerType(marker).type === "POI") marker.npc = npc;
      });
    }

    if (parsedNoDupes.length) await cwgAPI.setMarkers(parsedNoDupes);
    callback(parsedNoDupes.concat(cwgMarkers));
  }
  moveTo(destPos, callback) {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.map.panTo(destPos);

    const rangeDiff = 0.00005;
    const tick = 2000 / 30;
    const orgPos = { lat: this.center.lat(), lng: this.center.lng() };
    const currentPos = { ...orgPos };
    const posTick = {
      lat: (orgPos.lat - destPos.lat) / tick,
      lng: (orgPos.lng - destPos.lng) / tick
    };
    const animFn = () => {
      if (inRange(currentPos.lat, destPos.lat - rangeDiff, destPos.lat + rangeDiff) && inRange(currentPos.lng, destPos.lng - rangeDiff, destPos.lng + rangeDiff)) {
        clearTimeout(this.safetyTimeout);
        cancelAnimationFrame(this.animFrame);
        if (callback) callback();
      } else {
        currentPos.lat -= posTick.lat;
        currentPos.lng -= posTick.lng;
        this.setCenter(currentPos);
        this.animFrame = requestAnimationFrame(animFn);
      }
    };

    this.safetyTimeout = setTimeout(() => {
      this.setCenter(destPos);
      cancelAnimationFrame(this.animFrame);
      if (callback) callback();
    }, 2000);
    this.animFrame = requestAnimationFrame(animFn);
  }
}

export default Player;
