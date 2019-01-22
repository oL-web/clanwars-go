import React from "react";

import TabContainer from "./TabContainer";
import { setPlayerData } from "../../actions/playerActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import armies from "../../../../resources/armies";

import soldier from "../../../img/soldier.png";
import money from "../../../img/money.png";
import cwgAPI from "../../cwgAPI";
const icons = { soldier, money };

const armiesArr = [
  {
    ...armies.unarmed,
    name: "Unarmed Soldier",
    icon: icons.soldier
  },
  {
    ...armies.melee,
    name: "Melee Soldier",
    icon: icons.soldier
  },
  {
    ...armies.firearm,
    name: "Firearm Soldier",
    icon: icons.soldier
  },
  {
    ...armies.mercenary,
    name: "Mercenary",
    icon: icons.soldier
  }
];

class ArmyTab extends React.Component {
  state = {
    successMsg: "",
    errorMsg: ""
  };
  buyArmy = index => async () => {
    try {
      const armyToBuy = armiesArr[index];
      const res = await cwgAPI.buyArmy(armyToBuy.armyId);

      this.setState({ successMsg: `${armyToBuy.name} bought!`, errorMsg: "" });
      this.props.setPlayerData(res.body);
    } catch (e) {
      this.setState({ successMsg: "", errorMsg: e.response.body.msg });
    }
  };
  render() {
    const { errorMsg, successMsg } = this.state;

    return (
      <TabContainer title="Army">
        {errorMsg && <p className="error">{errorMsg}</p>}
        {successMsg && <p className="success">{successMsg}</p>}

        <ul>
          {armiesArr.map((army, i) => (
            <li key={army.armyId} className="list-item">
              <img className="list-item__icon" src={army.icon} alt={army.name} />
              <div className="list-item__description-container">
                <h3>{army.name}</h3>
                <p>Power: {army.power}</p>
              </div>
              <div className="list-item__buy-container">
                <p>{army.price}$</p>
                <button onClick={this.buyArmy(i)} className="list-item__buy-btn">
                  BUY
                </button>
              </div>
            </li>
          ))}
        </ul>

        <style jsx>{`
          ul {
            list-style-type: none;
            padding: 0;
          }
          .list-item {
            background: rgba(253, 253, 253, 0.75);
            display: flex;
            margin: 10px;
            box-shadow: 0 0 7px 0px;
          }
          .list-item__icon {
            object-fit: none;
            padding: 10px;
          }
          .list-item__description-container {
            text-align: left;
            padding: 10px;
            padding-top: 0;
          }
          .list-item__description-container > * {
            margin: 0;
            padding: 0;
          }
          .list-item__buy-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: white;
            margin-left: auto;
          }
          .list-item__buy-container > p {
            padding: 5px;
            margin: 0;
          }
          .list-item__buy-btn {
            background: #2cb131;
            border: 0;
            display: block;
            height: 100%;
            padding: 10px 20px;
            color: white;
            margin: 0;
            text-shadow: 1px 1px black;
            transition: 0.2s;
          }
          .list-item__buy-btn:active {
            transform: scale(1.1);
          }
          .error {
            color: red;
            font-weight: bold;
          }
          .success {
            color: green;
            font-weight: bold;
          }
        `}</style>
      </TabContainer>
    );
  }
}

const mapStateToProps = state => ({
  playerData: state.player.playerData
});

export default withRouter(
  connect(
    mapStateToProps,
    { setPlayerData }
  )(ArmyTab)
);
