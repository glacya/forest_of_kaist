import React, { useState } from "react";

import { mapClass } from "./Map";

class Object { 
  constructor(size, pos, img = null) {
    this.size = { width: size.width, height: size.height };
    if (pos === "center") this.pos = this.getCenterPos();
    else this.pos = { x: pos.x, y: pos.y };
    this.img = img;
  }
  
  getCenterPos() {
    return {
      x: mapClass.size.width / 2 - this.size.width / 2, 
      y: mapClass.size.height / 2 - this.size.height / 2
    };
  }
  left() {
    this.pos = { x: this.pos.x - 10, y: this.pos.y };
    console.log(this.pos);
    return this.pos;
  }
  right() {
    this.pos = { x: this.pos.x + 10, y: this.pos.y };
    console.log(this.pos);
    return this.pos;
  }
  up() {
    this.pos = { x: this.pos.x, y: this.pos.y - 10 };
    console.log(this.pos);
    return this.pos;
  }
  down() {
    this.pos = { x: this.pos.x, y: this.pos.y + 10 };
    console.log(this.pos);
    return this.pos;
  }
}
export default Object;