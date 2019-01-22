import React from "react";

const Spinner = () => (
  <div className="spinner">
    <p>Loading...</p>

    <style jsx>{`
      @keyframes rotate {
        from {
          transform: rotate(-45deg);
        }
        to {
          transform: rotate(315deg);
        }
      }
      .spinner {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .spinner::after,
      .spinner::before {
        content: "";
        display: block;
        width: 30px;
        height: 30px;
        background: white;
        animation: rotate 1s linear infinite;
      }
      .spinner::after {
        animation-direction: reverse;
      }
      .spinner p {
        padding: 10px;
      }
    `}</style>
  </div>
);

export default Spinner;
