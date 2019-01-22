import React from "react";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import { setPlayerData, insertMarkerData } from "../actions/playerActions";
import cwgAPI from "../cwgAPI";
import areOwnersEqual from "../areOwnersEqual";
import getMarkerType from "../../../helpers/getMarkerType";

class MarkerWindow extends React.Component {
  state = {
    errorMsg: "",
    successMsg: ""
  };
  invest = async () => {
    const marker = this.getMarker();
    const { setPlayerData, insertMarkerData, renderMarkers } = this.props;

    try {
      const res = await cwgAPI.investInMarker(marker.placeId);
      setPlayerData(res.body.playerData);
      insertMarkerData([res.body.marker]);
      renderMarkers();
      this.setState({
        errorMsg: "",
        successMsg: "Investment successful!"
      });
    } catch (e) {
      this.setState({
        errorMsg: e.response.body.msg,
        successMsg: ""
      });
    }
  };
  attack = async () => {
    const marker = this.getMarker();
    const { setPlayerData, insertMarkerData, renderMarkers } = this.props;

    try {
      const res = await cwgAPI.attackMarker(marker.placeId);
      setPlayerData(res.body.playerData);
      insertMarkerData([res.body.marker]);
      renderMarkers();
      this.setState({
        errorMsg: "",
        successMsg: "Location has been successfully taken over!"
      });
    } catch (e) {
      this.setState({
        errorMsg: e.response.body.msg,
        successMsg: ""
      });
    }
  };
  enforce = async () => {
    const marker = this.getMarker();
    const { setPlayerData, insertMarkerData, renderMarkers } = this.props;

    try {
      const res = await cwgAPI.enforceMarker(marker.placeId);
      setPlayerData(res.body.playerData);
      insertMarkerData([res.body.marker]);
      renderMarkers();
      this.setState({
        errorMsg: "",
        successMsg: "Location defenses strengthened!"
      });
    } catch (e) {
      this.setState({
        errorMsg: e.response.body.msg,
        successMsg: ""
      });
    }
  };
  getMarker() {
    const { placeId } = this.props.match.params;
    return this.props.markers.find(marker => marker.placeId === placeId);
  }
  render() {
    const { errorMsg, successMsg } = this.state;
    const marker = this.getMarker();
    if (!marker) return <Redirect to="/" />;

    const isMarkerOwned = areOwnersEqual(marker.owner, this.props.playerData._id);
    const markerType = getMarkerType(marker).type;

    return (
      <div className="container">
        <section>
          <Link className="btn-close" to="/">
            X
          </Link>
          {marker.photo ? (
            <React.Fragment>
              <img src={marker.photo} alt={marker.name} />
              <h2>{marker.name}</h2>
            </React.Fragment>
          ) : (
            <h2 className="place-circle">{marker.name}</h2>
          )}

          <p className="lvl">
            LEVEL: {marker.lvl} | STRENGTH: {marker.strength}
          </p>

          {marker.npc && <p className="lvl">OWNER: {marker.npc.name}</p>}
          {marker.owner && <p className="lvl">OWNER: {marker.owner.username}</p>}

          {isMarkerOwned && <p>Generates {marker.lvl * marker.investLvl}$ per 2 minutes</p>}

          {errorMsg && <p className="error">{errorMsg}</p>}
          {successMsg && <p className="success">{successMsg}</p>}

          <div className="btn-group">
            {markerType === "FOOD" && (
              <button disabled={true} className="btn" onClick={this.shop}>
                [COMING SOON] SHOP
              </button>
            )}
            {markerType === "POI" && (
              <React.Fragment>
                <button disabled={!isMarkerOwned} className="btn" onClick={this.invest}>
                  [LVL {marker.investLvl}] [COST {marker.lvl * 5}$] INVEST
                </button>
                <button disabled={!isMarkerOwned} className="btn" onClick={this.enforce}>
                  [LVL {marker.enforceLvl}] [COST {marker.lvl * 5}$] ENFORCE
                </button>
                <button disabled={isMarkerOwned} className="btn" onClick={this.attack}>
                  ATTACK
                </button>
              </React.Fragment>
            )}
          </div>
        </section>

        <style jsx global>{`
          .btn-close {
            position: absolute;
            font-size: 32px;
            font-family: "Raleway";
            font-weight: bold;
            text-decoration: none;
            display: block;
            right: 20px;
            top: 15px;
            transition: 0.2s ease-in-out;
            color: black;
          }
          .btn-close:hover {
            transform: scale(1.2);
          }
          .btn-close:active {
            transform: scale(1.3);
            color: black;
          }
        `}</style>
        <style jsx>
          {`
            @keyframes popIn {
              from {
                transform: translateY(calc(100% + 15px));
              }
              to {
                transform: translateY(0);
              }
            }
            .error {
              color: red;
            }
            .success {
              color: green;
            }
            .lvl {
              font-size: 28px;
            }
            h2 {
              margin-top: 0;
              font-size: 42px;
              letter-spacing: 2px;
            }
            .btn {
              display: block;
              border: 2px solid black;
              border-radius: 5px;
              background: #2cb131cc;
              color: white;
              padding: 20px 40px;
              font-size: 18px;
              margin: 5px;
              text-align: center;
              transition: 0.2s;
              text-shadow: 0 0 2px black;
            }
            .btn:disabled {
              background: rgb(22, 64, 24);
              color: #868282;
            }
            .btn:active {
              transform: translateY(3px);
            }
            .btn-group {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
            }
            .container {
              display: flex;
              overflow: hidden;
              width: 100%;
              justify-content: center;
              position: absolute;
              bottom: 0;
              top: 150px;
            }
            section {
              min-height: calc(100% - 200px);
              border-top: 5px solid rgba(40, 162, 39, 0.75);
              border-top-right-radius: 30px;
              border-top-left-radius: 30px;
              background: rgba(241, 241, 241, 0.92);
              animation: popIn 0.2s ease-in-out;
              position: relative;
              min-width: 100%;
              padding: 10px;
              text-align: center;
              color: #5a5a5a;
              overflow-y: auto;
              scrollbar-width: none;
            }
            section::-webkit-scrollbar {
              display: none;
            }
            .place-circle {
              color: white;
              background: #71a9ff;
              width: 300px;
              height: 300px;
              justify-content: center;
              align-items: center;
              border-radius: 100%;
              text-align: center;
              display: flex;
              overflow: hidden;
              border: 5px solid black;
              margin: 0 auto;
              text-shadow: 1px -1px black;
              font-size: 32px;
            }

            @media only screen and (min-width: 768px) {
              section {
                min-width: 75%;
              }
            }
          `}
        </style>
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
  )(MarkerWindow)
);
