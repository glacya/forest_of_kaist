import React, { useEffect, useState }  from "react";
import { socket } from "../App";

class MapClass {
  ratio = 50;
  
  constructor(size) {
    this.size = size;
  }
  
  unitToPx(unit) {
    return parseFloat((parseFloat(unit) * this.ratio).toFixed(1));
  }
  
  pxToUnit(px) {
    return parseFloat((parseFloat(px) / this.ratio).toFixed(1));
  }
}

const mapClass = new MapClass({ width: 1000, height: 1000 });

function Map() {
    // const size = { width: 1000, height: 1000 };
    
    return (<div></div>);
  }
  
  export { mapClass, Map };