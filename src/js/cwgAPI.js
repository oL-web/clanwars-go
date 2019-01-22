import request from "superagent";

export default {
  register(username, password) {
    return request
      .post("/users")
      .set("accept", "json")
      .send({ username, password });
  },
  logIn(username, password) {
    return request.post("/users/login").send({ username, password });
  },
  logout() {
    return request.get("/users/logout");
  },
  getPlayerData() {
    return request.post("/users").send({ username, password });
  },
  async getNearbyMarkers(lat, lng) {
    const res = await request.get(`/markers?lat=${lat}&lng=${lng}`);
    return res.body;
  },
  async getMarkerByPlaceId(placeId) {
    const res = await request.get(`/markers/${placeId}`);
    return res.body;
  },
  setMarkers(markersArr) {
    return request.post("/markers").send(markersArr);
  },
  enemyMove(obj) {
    return request.patch("/markers").send({ ...obj, action: "ENEMY_MOVE" });
  },
  enforceMarker(placeId) {
    return request.patch(`/markers/${placeId}`).send({ action: "ENFORCE" });
  },
  investInMarker(placeId) {
    return request.patch(`/markers/${placeId}`).send({ action: "INVEST" });
  },
  attackMarker(placeId) {
    return request.patch(`/markers/${placeId}`).send({ action: "ATTACK" });
  },
  updateStats() {
    return request.patch(`/users`).send({ action: "UPDATE_STATS" });
  },
  buyArmy(armyId) {
    return request.post(`/users/army/${armyId}`).send({ action: "BUY" });
  }
  /* 
    buyItem(itemId) {
    return request.post(`/users/items/${itemId}`).send({ action: "BUY" });
  },
  */
};
