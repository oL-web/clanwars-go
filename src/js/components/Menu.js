import React from "react";
import { NavLink } from "react-router-dom";

import MenuBtn from "./MenuBtn";
import cwgAPI from "../cwgAPI";

import menu from "../../img/menu.png";
import items from "../../img/chest.png";
import army from "../../img/medal.png";
import settings from "../../img/settings.png";
import credits from "../../img/info.png";
import logout from "../../img/logout.png";
const icons = { menu, items, army, settings, credits, logout };

class Menu extends React.Component {
  async logout() {
    await cwgAPI.logout();
    location.reload(true);
  }
  render() {
    return (
      <nav className="menu">
        <ul>
          <li>
            <NavLink to="/menu/army" className="btn">
              <i className="icon-army icon" />
              Army
            </NavLink>
          </li>
          <li>
            <NavLink to="/menu/items" className="btn">
              <i className="icon-items icon" />
              Items
            </NavLink>
          </li>
          <li>
            <NavLink to="/menu/credits" className="btn">
              <i className="icon-credits icon" />
              Credits
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="btn" onClick={this.logout}>
              <i className="icon icon-logout" />
              Logout
            </NavLink>
          </li>
        </ul>

        <MenuBtn to="/" />
        <style jsx global>{`
          .btn {
            background: 0;
            border: 0;
            margin: 0;
            padding: 0;
            padding-top: 78px;
            position: relative;
            color: white;
            font-size: 24px;
            font-family: "Raleway";
            text-decoration: none;
            display: block;
          }
          .btn:hover .icon {
            box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.75);
          }
          .btn:active .icon {
            box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.75);
          }
        `}</style>

        <style jsx>
          {`
            @keyframes popIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes popOut {
              from {
                opacity: 1;
              }
              to {
                opacity: 0;
              }
            }
            ul {
              list-style-type: none;
              width: 50%;
              height: 50%;
              padding: 0;
              margin: 10px;
              text-align: center;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-evenly;
              margin-top: 20px;
            }
            li {
              flex-basis: 33%;
            }
            .icon {
              box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
              background: white;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              padding: 20px;
              position: absolute;
              top: 0;
              left: 50%;
              box-sizing: content-box;
              transform: translate(-50%);
              transition: 0.2s;
            }
            .icon::before {
              content: " ";
              width: 32px;
              height: 32px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            .icon-army::before {
              background: url(${icons.army});
            }
            .icon-items::before {
              background: url(${icons.items});
            }
            .icon-credits::before {
              background: url(${icons.credits});
            }
            .icon-settings::before {
              background: url(${icons.settings});
            }
            .icon-logout::before {
              background: url(${icons.logout});
            }
            .icon-items {
              background: #ffe100;
            }
            .icon-army {
              background: #54c9fd;
            }
            nav {
              height: 100%;
              width: 100%;
              background: #2cb131cc;
              position: absolute;
              top: 0;
              z-index: 200;
              animation: popIn 0.4s ease-in-out;
              display: flex;
              justify-content: center;
            }
            @media only screen and (max-width: 786px) {
              ul {
                width: 100%;
              }
            }
          `}
        </style>
      </nav>
    );
  }
}

export default Menu;
