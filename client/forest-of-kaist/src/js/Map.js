import React, { useEffect, useState }  from "react";
import { socket } from "../App";

class MapClass {
  constructor(size) {
    this.size = size;
  }
}

const mapClass = new MapClass({ width: 1000, height: 1000 });

function Map() {
    // const size = { width: 1000, height: 1000 };
   
    return (<div></div>);
  }
  
  export { mapClass, Map };