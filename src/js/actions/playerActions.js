import cwgAPI from "../cwgAPI";
import { MARKERS_ADD, PLAYER_SET_DATA } from "./types";

/* 
  HUGE MESS WARNING!

  This code is a mess and it needs fixing. I'll do it later!
*/

export const logIn = (username, password) => async dispatch => {
  try {
    const res = await cwgAPI.logIn(username, password);

    dispatch({
      type: "LOGIN",
      payload: {
        logging: false,
        loggedIn: true
      }
    });
  } catch (e) {
    dispatch({
      type: "LOGIN",
      payload: {
        logging: false,
        loggedIn: false
      }
    });
  }
};

export const setPlayerData = playerData => dispatch => {
  dispatch({
    type: PLAYER_SET_DATA,
    payload: playerData
  });
};

export const insertMarkerData = markerData => dispatch => {
  dispatch({
    type: MARKERS_ADD,
    payload: markerData
  });
};

export const showLoader = () => dispatch => {
  dispatch({
    type: "LOADER_SHOW"
  });
};

export const hideLoader = () => dispatch => {
  dispatch({
    type: "LOADER_HIDE"
  });
};

export const showLoading = () => dispatch => {
  dispatch({
    type: "LOADING_SHOW"
  });
};

export const hideLoading = () => dispatch => {
  dispatch({
    type: "LOADING_HIDE"
  });
};
