import React, { useEffect, useState }  from "react";
import { socket } from "../App";
import { mapClass } from "./Map";
import Object from "./Object";

class ViewObj extends Object {
  constructor(size, pos) {
      super(size, pos);
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

const view = new ViewObj({width: 20, height: 15}, "center");
  
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