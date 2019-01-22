import React from "react";
import { Route } from "react-router-dom";

import MenuBtn from "./MenuBtn";
import Menu from "./Menu";

import ItemsTab from "./menuTabs/ItemsTab";
import ArmyTab from "./menuTabs/ArmyTab";
import CreditsTab from "./menuTabs/CreditsTab";

export default class MenuContainer extends React.Component {
  render() {
    return (
      <div className="menu-container">
        <Route exact path="/:path(index.html|marker:/placeId|)" component={MenuBtn} />
        <Route path="/menu" component={Menu} />
        <Route path="/menu/items" component={ItemsTab} />
        <Route path="/menu/army" component={ArmyTab} />
        <Route path="/menu/credits" component={CreditsTab} />

        <style jsx>
          {`
            .menu-container {
              display: flex;
              justify-content: center;
              flex-direction: column;
            }
          `}
        </style>
      </div>
    );
  }
}
