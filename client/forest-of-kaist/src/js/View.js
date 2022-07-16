import React, { useEffect, useState }  from "react";
import { socket } from "../App";
import { mapClass } from "./Map";
import { ObjectFunc } from "./Object";
import { user } from "./Character";

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

  getZIdx(type){
    switch(type){
      case "tile":
        return -1;
      case "building":
        return 0;
      case "character":
        return 0;
      default:
        return "error";
    }
  }
  
  pxposToUnitpos(pxpos) {
    return {
      x: mapClass.pxToUnit(pxpos.x - this.pos.x),
      y: mapClass.pxToUnit(pxpos.y - this.pos.y)
    };
  }

  left(pos) {
    return {
      x: parseFloat((pos.x - user.speed).toFixed(1)),
      y: pos.y
    };
  }
  right(pos) {
    return {
      x: parseFloat((pos.x + user.speed).toFixed(1)),
      y: pos.y
    };
  }
  up(pos) {
    return {
      x: pos.x,
      y: parseFloat((pos.y - user.speed).toFixed(1))
    };
  }
  down(pos) {
    return {
      x: pos.x,
      y: parseFloat((pos.y + user.speed).toFixed(1))
    };
  }
  
  setPos(pos) {
    this.pos = { x: parseFloat(pos.x.toFixed(1)), y: parseFloat(pos.y.toFixed(1)) };
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