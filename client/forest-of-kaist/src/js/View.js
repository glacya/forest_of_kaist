import React, { useEffect, useState }  from "react";
import { socket } from "./Game";
import { mapClass } from "./Map";
import { ObjectFunc } from "./Object";
import { user } from "./Character";
import {viewClickListener} from "./Money"

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

  left() {
    this.pos = {
      x: parseFloat((this.pos.x - user.speed).toFixed(1)),
      y: this.pos.y
    };
  }
  right() {
    this.pos = {
      x: parseFloat((this.pos.x + user.speed).toFixed(1)),
      y: this.pos.y
    };
  }
  up() {
    this.pos = {
      x: this.pos.x,
      y: parseFloat((this.pos.y - user.speed).toFixed(1))
    };
  }
  down() {
    this.pos = {
      x: this.pos.x,
      y: parseFloat((this.pos.y + user.speed).toFixed(1))
    };
  }
  
  setPos(pos) {
    this.pos = { x: parseFloat(pos.x.toFixed(1)), y: parseFloat(pos.y.toFixed(1)) };
  }
}

const view = new ViewClass({width: 20, height: 15}, "center");
  
function View() {
    const divElement = React.createElement(
      "div",
      { 
        style: {
          position: "absolute",
          left: 0,
          top: 0,
          width: mapClass.unitToPx(view.size.width),
          height: mapClass.unitToPx(view.size.height)
        },
        onClick: (e) => { viewClickListener(e) }
      }
    )
    return (divElement);
}
  
  export {View, view};