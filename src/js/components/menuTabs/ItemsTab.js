import React from "react";

import TabContainer from "./TabContainer";

class ItemsTab extends React.Component {
  render() {
    return (
      <TabContainer title="Items">
        <p>Coming soon!</p>

        <style jsx>{`
          ul {
            list-style-type: none;
            padding: 0;
          }
        `}</style>
      </TabContainer>
    );
  }
}

export default ItemsTab;
