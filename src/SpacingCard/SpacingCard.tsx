import React from "react";
import Input from "./Input";
import "../styles/SpacingCard/SpacingCard.css";

const SpacingCard = () => {
  return (
    <div className="card-container">
      <div className="div1">
        {/*outer-top */}
        <Input />
      </div>
      <div className="div2">
        {/*outer-left */}
        <Input />
      </div>
      <div className="div3">
        {/*outer-bottom*/}
        <Input />
      </div>
      <div className="div4">
        {/*outer-right*/}
        <Input />
      </div>
      <div className="inner-rectangle">{/*rectangle */}</div>
      <div className="div6">
        {/*inner-top */}
        <Input />
      </div>
      <div className="div7">
        {/*inner-left */}
        <Input />
      </div>
      <div className="div8">
        {/* inner-bottom */}
        <Input />
      </div>
      <div className="div9">
        {/* inner-right */}
        <Input />
      </div>
    </div>
  );
};

export default SpacingCard;
