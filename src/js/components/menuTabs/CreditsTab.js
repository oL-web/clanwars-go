import React from "react";

import TabContainer from "./TabContainer";

class CreditsTab extends React.Component {
  render() {
    return (
      <TabContainer title="Credits">
        <p>
          Made by <a href="https://github.com/oL-web">ol-web</a> 2019
        </p>
        <p>
          Visit my website <a href="https://ol-web.github.io/">here</a>
        </p>

        <div>
          Icons made by{" "}
          <a href="https://www.freepik.com/" title="Freepik">
            Freepik
          </a>
          ,{" "}
          <a href="https://www.flaticon.com/authors/pause08" title="Pause08">
            Pause08
          </a>
          ,{" "}
          <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">
            Smashicons
          </a>
          ,{" "}
          <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">
            Good Ware
          </a>{" "}
          and others from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>{" "}
          is licensed by{" "}
          <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">
            CC 3.0 BY
          </a>
        </div>

        <style jsx>{``}</style>
      </TabContainer>
    );
  }
}

export default CreditsTab;
