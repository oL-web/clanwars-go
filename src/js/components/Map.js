import React from "react";
import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import throttle from "lodash/throttle";
import sample from "lodash/sample";
import ms from "times-in-milliseconds";

import Player from "../Player";
import cwgAPI from "../cwgAPI";
import MarkerWindow from "./MarkerWindow";
import getMarkerType from "../../../helpers/getMarkerType";
import areOwnersEqual from "../areOwnersEqual";
import { insertMarkerData, setPlayerData } from "../actions/playerActions";
import mapStyles from "../../mapStyles";

import enemyFlag from "../../img/flag-enemy.png";
import neutralFlag from "../../img/flag-free.png";
import playerFlag from "../../img/flag-player.png";
import foodIcon from "../../img/food.png";
import financeIcon from "../../img/bank.png";
const icons = { enemyFlag, neutralFlag, playerFlag, foodIcon, financeIcon };

class GameMap extends React.Component {
  state = {
    activeMarkerId: ""
  };
  mapRef = React.createRef();
  componentDidMount() {
    const antarcticaPos = {
      lat: -76.309628,
      lng: 22.497356
    };

    this.map = new google.maps.Map(this.mapRef.current, {
      center: antarcticaPos,
      zoom: 19,
      minZoom: 18,
      maxZoom: 20,
      styles: mapStyles,
      disableDefaultUI: true,
      keyboardShortcuts: false
    });

    const player = new Player({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.2,
      map: this.map,
      center: antarcticaPos,
      radius: 20
    });

    const discoverAndRenderMarkers = throttle(() => {
      player.discoverNearbyPlaces(markers => {
        this.props.insertMarkerData(markers);
        this.renderMarkers();
      });
    }, ms.SECOND * 5);

    google.maps.event.addListenerOnce(this.map, "idle", () => discoverAndRenderMarkers());
    this.map.addListener("center_changed", () => discoverAndRenderMarkers());

    const onPositionError = () => {
      alert("ClanWars GO requires geolocation to work! Refresh the page and allow geolocation!");
    };

    const onPositionSuccess = throttle(position => {
      console.log("POSTION UPDATE");
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      player.moveTo(pos, discoverAndRenderMarkers);
    }, ms.SECOND * 3);

    navigator.geolocation.watchPosition(onPositionSuccess, onPositionError, {
      enableHighAccuracy: localStorage.enableHighAccuracy || false
    });

    this.updateStatsInterval = setInterval(async () => {
      try {
        const res = await cwgAPI.updateStats();
        this.props.setPlayerData(res.body);
        window.navigator.vibrate(200);
      } catch (e) {}
    }, ms.MINUTE * 2 + ms.SECOND * 5);

    this.enemyInterval = setInterval(async () => {
      const { markers } = this.props;
      const npcMarkers = markers.filter(marker => marker.npc);
      const vulnerableMarkers = markers.filter(marker => {
        const { npc, owner } = marker;
        const markerType = getMarkerType(marker).type;

        return markerType === "POI" && !npc && (!owner || areOwnersEqual(owner, this.props.playerData._id));
      });

      if (!vulnerableMarkers.length || !npcMarkers.length) return;

      try {
        const res = await cwgAPI.enemyMove({
          attackingMarkerId: sample(npcMarkers)._id,
          attackedMarkerId: sample(vulnerableMarkers)._id
        });
        this.props.insertMarkerData(Object.values(res.body));
        this.renderMarkers();
      } catch (e) {}
    }, ms.MINUTE * 1);
  }
  componentWillUnmount() {
    clearInterval(this.enemyInterval);
    clearInterval(this.updateStatsInterval);
  }
  renderMarkers = () => {
    const locationSpread = () => (Math.floor(Math.random() * 11) - 5) / 70000;
    this.renderedMarkers = this.renderedMarkers || [];

    this.props.markers.forEach(place => {
      const existingMarker = this.renderedMarkers.find(m => place.placeId === m.placeId);
      const ownerChanged = existingMarker && (!areOwnersEqual(place.owner, existingMarker.owner) || place.npc !== existingMarker.npc);

      if (existingMarker && ownerChanged) existingMarker.setMap(null);
      if (!existingMarker || ownerChanged) {
        const markerType = getMarkerType(place).type;
        let icon;

        if (areOwnersEqual(place.owner, this.props.playerData._id)) icon = icons.playerFlag;
        else if (place.npc || place.owner) icon = icons.enemyFlag;
        else if (markerType === "FOOD") icon = icons.foodIcon;
        else if (markerType === "FINANCIAL") icon = icons.financeIcon;
        else icon = icons.neutralFlag;

        const marker = new google.maps.Marker({
          map: this.map,
          icon,
          position: existingMarker
            ? existingMarker.position.toJSON()
            : {
                lng: place.coords[0] + locationSpread(),
                lat: place.coords[1] + locationSpread()
              }
        });

        marker.markerType = markerType;
        marker.placeId = place.placeId;
        marker.parsedMarker = place;

        google.maps.event.addListener(marker, "click", async () => {
          const { placeId } = marker;
          const newMarkerCopy = await cwgAPI.getMarkerByPlaceId(placeId);
          this.props.insertMarkerData([newMarkerCopy]);
          this.renderMarkers();
          this.setState({ activeMarkerId: placeId }, () => {
            this.props.history.push(`/marker/${placeId}`);
          });
        });

        if (!existingMarker) this.renderedMarkers.push(marker);
      }
    });
  };
  render() {
    const { activeMarkerId } = this.state;

    return (
      <div style={{ height: "100%" }}>
        <div ref={this.mapRef} style={{ height: "100%" }} />
        <Route render={() => <MarkerWindow renderMarkers={this.renderMarkers} activeMarkerId={activeMarkerId} />} path="/marker/:placeId" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playerData: state.player.playerData,
  markers: state.player.markers
});

export default withRouter(
  connect(
    mapStateToProps,
    { setPlayerData, insertMarkerData }
  )(GameMap)
);
