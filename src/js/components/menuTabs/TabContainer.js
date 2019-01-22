import React from "react";
import { NavLink } from "react-router-dom";

class TabContainer extends React.Component {
  render() {
    return (
      <div>
        <section>
          <h2>{this.props.title}</h2>
          {this.props.children}
          <NavLink className="btn-close" to="/menu">
            X
          </NavLink>
        </section>

        <style jsx global>{`
          .btn-close {
            position: absolute;
            font-size: 32px;
            font-family: "Raleway";
            font-weight: bold;
            text-decoration: none;
            display: block;
            right: 10px;
            top: 10px;
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
                transform: translateY(calc(-100% - 15px));
              }
              to {
                transform: translateY(0);
              }
            }
            div {
              height: 100%;
              width: 100%;
              background: #ffffffe6;
              position: absolute;
              top: 0;
              z-index: 300;
              animation: popIn 0.4s ease-in-out;
              display: flex;
              justify-content: center;
            }
            h2 {
              margin-top: 0;
              font-size: 42px;
              letter-spacing: 2px;
            }
            section {
              position: relative;
              width: 50%;
              padding: 10px;
              margin: 10px;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              color: #5a5a5a;
              overflow-y: auto;
            }
            @media only screen and (max-width: 786px) {
              section {
                width: 100%;
              }
            }
          `}
        </style>
      </div>
    );
  }
}

export default TabContainer;
