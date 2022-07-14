import React, { useEffect, useState }  from "react";
import { socket } from "../App";

class MapClass {
  ratio = 50;
  
  constructor(size) {
    this.size = size;
  }
  
  unitToPx(unit) {
    return parseFloat(unit) * this.ratio;
  }
  
  pxToUnit(px) {
    return parseFloat(px) / this.ratio * 10;
  }
}

const mapClass = new MapClass({ width: 1000, height: 1000 });

function Map() {
    // const size = { width: 1000, height: 1000 };
   
    return (<div></div>);
  }
  
  export { mapClass, Map };