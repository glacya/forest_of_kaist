import React, { useEffect, useState }  from "react";
import { socket } from "../App";
import { mapClass } from "./Map";
import { Object } from "./Object";

class ViewClass{
  constructor(size, pos) {
      this.size = size;
      if (pos === "center") this.pos = this.getCenterPos();
      else this.pos = { x: pos.x, y: pos.y };
  }

  getCenterPos() {
    return {
      x: mapClass.size.width / 2 - this.size.width / 2, 
      y: mapClass.size.height / 2 - this.size.height / 2
    };
  }
  
  unitposToPxpos(unitpos) {
    return {
      x: mapClass.unitToPx(unitpos.x - this.pos.x),
      y: mapClass.unitToPx(unitpos.y - this.pos.y)
    };
  }
  
  pxposToUnitpos(pxpos) {
    return {
      x: mapClass.pxToUnit(pxpos.x - this.pos.x),
      y: mapClass.pxToUnit(pxpos.y - this.pos.y)
    };
  }
}

const view = new ViewClass({width: 20, height: 15}, "center");
  
function View() {
    const divElement = React.createElement(
      "img",
      { src: null,
        alt: "Dummy Img",
        width: mapClass.unitToPx(view.size.width),
        height: mapClass.unitToPx(view.size.height),
        style: { backgroundColor: "purple" }
      }
    )
    return (divElement);
}
  
  export {View, view};