import React, { useEffect, useState }  from "react";
import { socket } from "../App";
import Object from "./Object";

class ViewObj extends Object {
    constructor(size, pos) {
      super(size, pos);
    }
  }

function View() {
    const view = new ViewObj({width: 40, height: 40}, "center");
   
    return (<div></div>);
  }
  
  export default View;