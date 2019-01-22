import React from "react";
import { setPlayerData } from "../actions/playerActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import soldier from "../../img/soldier.png";
import money from "../../img/money.png";
const icons = { soldier, money };

class InfoBar extends React.Component {
  render() {
    const { strength, money } = this.props.playerData;

    return (
      <ul>
        {this.props.username}
        <li className="icon icon-money">Money: {money}$</li>
        <li className="icon icon-power">Strength: {strength}</li>

        <style jsx>{`
          ul {
            list-style-type: none;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            background: #2cb131cc;
            padding: 10px;
            margin: 0;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 100;
            width: 100%;
          }
          .icon-power::before {
            background: url(${icons.soldier});
          }
          .icon-money::before {
            background: url(${icons.money});
          }
          .icon {
            padding-left: 40px;
            padding-right: 40px;
            text-align: center;
            position: relative;
            font-size: 24px;
            margin: 5px 0;
          }
          .icon::before {
            content: " ";
            width: 32px;
            height: 32px;
            position: absolute;
            bottom: 0;
            left: 0;
          }

          @media only screen and (max-height: 500px) {
            ul {
              display: none;
            }
          }
        `}</style>
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  playerData: state.player.playerData
});

export default InfoBar;
