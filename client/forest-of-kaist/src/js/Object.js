import React, { useState } from "react";

import { mapClass } from "./Map";

const objList = [];

class Object { 
  constructor(size, pos, img = null) {
    this.size = { width: size.width, height: size.height };
    if (pos === "center") this.pos = this.getCenterPos();
    else this.pos = { x: pos.x, y: pos.y };
    this.img = img;
    objList.push(this);
  }
  
  speed = 0.1;
  
  getCenterPos() {
    return {
      x: mapClass.size.width / 2 - this.size.width / 2, 
      y: mapClass.size.height / 2 - this.size.height / 2
    };
  }
  left(pos) {
    return {
      x: pos.x - this.speed,
      y: pos.y
    };
  }
  right(pos) {
    return {
      x: pos.x + this.speed,
      y: pos.y
    };
  }
  up(pos) {
    return {
      x: pos.x,
      y: pos.y - this.speed
    };
  }
  down(pos) {
    return {
      x: pos.x,
      y: pos.y + this.speed
    };
  }
  
  setPos(pos) {
    this.pos = { x: pos.x.toFixed(1), y: pos.y.toFixed(1) };
  }
}
export { Object, objList };