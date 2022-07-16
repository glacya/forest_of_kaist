// import React, { useEffect, useState }  from "react";

// import { socket } from "../App";
// import { ObjectClass as Obj } from "./Object";
// import { mapClass } from "./Map";
// import { view } from "./View";

// const img = "/images/building_center.png";

// class BuildingObj extends Obj {
//   constructor(size, pos, img, name) {
//     super(size, pos, img);
//     this.name = name;
//   }
// }

// const building = new BuildingObj({width: 6, height: 6}, {x: 490, y: 490}, img, "Sample building");

// function Building() {
//   const imgElement = React.createElement(
//     "img",
//     { 
//       src: building.img,
//       alt: building.name, 
//       width: mapClass.unitToPx(building.size.width),
//       height: mapClass.unitToPx(building.size.height),
//       style: { position: "absolute", left: view.unitposToPxpos(building.pos).x, top: view.unitposToPxpos(building.pos).y}
//     }
//   )
  
//   return (
//     imgElement
//   );
// }

// export default Building;