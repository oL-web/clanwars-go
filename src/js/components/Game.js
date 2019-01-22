import React from "react";
import { withRouter } from "react-router-dom";

import cwgAPI from "../cwgAPI";
import Map from "./Map";
import InfoBar from "./InfoBar";
import MenuContainer from "./MenuContainer";
import Spinner from "./Spinner";
import LoginForm from "./LoginForm";

import { logIn, setPlayerData } from "../actions/playerActions";
import { connect } from "react-redux";

import loginBackground from "../../img/login-background.jpg";
const imgs = { loginBackground };

class Game extends React.Component {
  state = {
    logging: true,
    loggedIn: false
  };
  showLoader = val => {
    this.setState({
      logging: val
    });
  };
  showLoggedIn = val => {
    this.setState({
      loggedIn: val
    });
  };
  async componentDidMount() {
    try {
      const res = await cwgAPI.logIn();

      this.props.setPlayerData(res.body);

      this.setState({
        logging: false,
        loggedIn: true
      });
    } catch (e) {
      this.setState({
        logging: false
      });
    }
  }
  render() {
    const { logging, loggedIn } = this.state;
    const { playerData } = this.props;
    const showLoginForm = !loggedIn && !logging;
    const showSpinner = logging;
    const showGame = !logging && loggedIn;

    return (
      <div className="container">
        {showSpinner && <Spinner />}
        {showLoginForm && <LoginForm showLoader={this.showLoader} showLoggedIn={this.showLoggedIn} />}
        {showGame && (
          <React.Fragment>
            <InfoBar playerData={playerData} />
            <Map playerData={playerData} />
            <MenuContainer />
          </React.Fragment>
        )}

        <style jsx global>{`
          *,
          *::after,
          *::before {
            box-sizing: border-box;
          }
          html,
          body,
          #app {
            height: 100%;
            margin: 0;
            padding: 0;
            border: 5px solid black;
            background: black;
            color: white;
            font-family: "Raleway", sans-serif;
            user-select: none;
          }
          button {
            outline: 0;
          }
          h1,
          h2,
          h3 {
            font-weight: normal;
          }
          @media only screen and (max-width: 560px) {
            html,
            body,
            #app {
              border: 0;
            }
          }
        `}</style>
        <style jsx>{`
          .background {
            background: url(${imgs.loginBackground});
            filter: blur(10px);
            height: 100%;
            width: 100%;
            position: absolute;
            background-attachment: fixed;
            background-size: cover;
            top: 0;
            left: 0;
            z-index: -1;
          }
          h2 {
            margin: 0;
            margin-bottom: 10px;
          }
          section {
            background: rgba(0, 0, 0, 0.75);
            margin: 10px 0;
            padding: 20px;
          }
          form {
            display: flex;
            flex-direction: column;
            max-width: 300px;
            margin: 0 auto;
            user-select: auto;
          }
          input {
            display: block;
            background: #d5ffd4;
            border: 4px solid rgba(44, 177, 49, 0.8);
            border-radius: 50px;
            padding: 15px;
            color: black;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
            transition: 0.2s;
          }
          button {
            display: block;
            background: #2cb131;
            border: 0;
            padding: 15px;
            color: black;
            font-weight: bold;
            transition: 0.2s;
          }

          input:hover,
          button:hover {
            transform: scale(1.1);
          }
          button:active {
            transform: translateY(5px);
          }
          .container {
            height: 100%;
            width: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            text-align: center;
            z-index: 1;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playerData: state.player.playerData
});

export default withRouter(
  connect(
    mapStateToProps,
    { logIn, setPlayerData }
  )(Game)
);
