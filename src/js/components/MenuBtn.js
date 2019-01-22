import React from "react";
import { NavLink } from "react-router-dom";

import menu from "../../img/menu.png";
const icons = { menu };

export default class MenuBtn extends React.Component {
  static defaultProps = {
    to: "/menu"
  };
  render() {
    return (
      <NavLink to={this.props.to} className="btn-menu">
        Menu
        <style jsx global>{`
          .btn-menu {
            position: absolute;
            bottom: 20px;
            align-self: center;
            border: 0;
            font-size: 0;
            background: #2cb131;
            width: 64px;
            height: 64px;
            padding: 15px;
            box-sizing: content-box;
            border-radius: 50%;
            border: 10px solid black;
            transition: 0.2s;
            z-index: 300;
          }
          .btn-menu::after {
            content: " ";
            background: url(${icons.menu});
            position: absolute;
            width: inherit;
            height: inherit;
            top: 50%;
            left: 50%;
            transition: inherit;
            transform: translate(-50%, -50%) scale(1);
          }
          .btn-menu:active::after {
            transform: translate(-50%, -50%) scale(1.2);
          }
          .btn-menu:hover {
            background: #4bc353;
            border: 7px solid black;
          }
          .btn-menu:active {
            border: 5px solid black;
          }
        `}</style>
      </NavLink>
    );
  }
}
