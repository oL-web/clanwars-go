import React from "react";
import cwgAPI from "../cwgAPI";

import { logIn, setPlayerData } from "../actions/playerActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import loginBackground from "../../img/login-background.jpg";
import Spinner from "./Spinner";
const imgs = { loginBackground };

class LoginForm extends React.Component {
  state = {
    loginError: "",
    registerError: "",
    loginUsername: "",
    loginPass: "",
    registerUsername: "",
    registerPass: "",
    registerPassRepeat: ""
  };
  updateValue(name) {
    return e => {
      const newState = {};
      newState[name] = e.target.value;
      this.setState(newState);
    };
  }
  async logIn(username, password) {
    const { setPlayerData, showLoader, showLoggedIn } = this.props;
    try {
      const res = await cwgAPI.logIn(username, password);
      setPlayerData(res.body);
      showLoader(false);
      showLoggedIn(true);
    } catch (e) {
      showLoader(false);
      this.setState({
        loginError: "Unable to log in. Make sure your username and password are correct and you're connected to the internet!"
      });
    }
  }
  onLoginSubmit = async e => {
    e.preventDefault();
    const { loginUsername, loginPass } = this.state;
    await this.logIn(loginUsername, loginPass);
    return false;
  };
  onRegisterSubmit = async e => {
    e.preventDefault();
    const { registerUsername, registerPass, registerPassRepeat } = this.state;

    if (registerPass !== registerPassRepeat) {
      this.props.showLoader(false);
      return this.setState({
        registerError: "Your passwords don't match!"
      });
    }

    try {
      const res = await cwgAPI.register(registerUsername, registerPass);
      await this.logIn(registerUsername, registerPass);
    } catch (e) {
      this.props.showLoader(false);
      this.setState({
        registerError: e.response.body.msg
      });
    }

    return false;
  };
  requestGeolocationEarly = () => {
    const fn = () => {};
    navigator.geolocation.getCurrentPosition(fn, fn);
  };
  render() {
    const { loginPass, loginUsername, registerUsername, registerPass, registerPassRepeat, registerError, loginError } = this.state;
    const logging = this.props.logging;

    return (
      <React.Fragment>
        {logging && <Spinner />}

        <div className="background" />
        <h1>ClanWars GO</h1>

        <section>
          <h2>Log in</h2>
          <form onSubmit={this.onLoginSubmit}>
            {loginError && <p>{loginError}</p>}
            <input autoComplete="username" onChange={this.updateValue("loginUsername")} type="text" name="login-username" value={loginUsername} placeholder="Username" required />
            <input autoComplete="current-password" onChange={this.updateValue("loginPass")} type="password" name="login-password" value={loginPass} placeholder="Password" required />
            <button onClick={this.requestGeolocationEarly} type="submit">
              Log in
            </button>
          </form>
        </section>

        <section>
          <h2>...or make an account</h2>
          <form onSubmit={this.onRegisterSubmit}>
            {registerError && <p>{registerError}</p>}
            <input autoComplete="username" onChange={this.updateValue("registerUsername")} type="text" name="username" value={registerUsername} placeholder="Username" minLength="6" required />
            <input autoComplete="new-password" onChange={this.updateValue("registerPass")} type="password" name="password" value={registerPass} placeholder="Password" minLength="6" required />
            <input autoComplete="new-password" onChange={this.updateValue("registerPassRepeat")} type="password" name="repeat-password" value={registerPassRepeat} placeholder="Repeat password" minLength="6" required />
            <button onClick={this.requestGeolocationEarly} type="submit">
              Register account
            </button>
          </form>
        </section>

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
          h1 {
            font-weight: normal;
            font-size: 48px;
          }
          h2 {
            margin: 0;
            margin-bottom: 10px;
            font-weight: normal;
          }
          section {
            background: rgba(0, 0, 0, 0.75);
            margin: 10px 0;
            padding: 20px 60px;
            border: 4px solid black;
            align-self: center;
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
        `}</style>
      </React.Fragment>
    );
  }
}

// export default LoginForm;
/* 
const mapStateToProps = state => ({
  loggedIn: state.player.loggedIn,
  logging: state.player.logging
});

export default connect(
  mapStateToProps,
  { logIn }
)(LoginForm);

*/

const mapStateToProps = state => ({
  // loggedIn: state.player.loggedIn,
  // logging: state.player.logging
  playerData: state.player.playerData
});

export default withRouter(
  connect(
    mapStateToProps,
    { logIn, setPlayerData }
  )(LoginForm)
);
