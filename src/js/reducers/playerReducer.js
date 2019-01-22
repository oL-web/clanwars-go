import merge from "lodash/merge";
import { PLAYER_SET_DATA, MARKERS_ADD } from "../actions/types";

const initialState = {
  loggedIn: false,
  logging: true,
  markers: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PLAYER_SET_DATA: {
      return {
        ...state,
        playerData: merge({}, state.playerData, action.payload)
      };
    }
    case MARKERS_ADD: {
      const markersToAdd = action.payload;
      const markersToMerge = state.markers.map(marker => markersToAdd.find(mta => mta.placeId === marker.placeId));
      const newMarkersToAdd = markersToAdd.filter(mta => !state.markers.find(marker => marker.placeId === mta.placeId));
      const markers = merge([], state.markers, markersToMerge).concat(newMarkersToAdd);

      return { ...state, markers };
    }
    default: {
      return state;
    }
  }
};
