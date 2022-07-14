import React, { useState, useEffect } from "react";
import { socket } from "../App";

import { mapClass } from "./Map";
import { user } from "./Character";
import { view } from "./View";



function Object() {
  const [img, setImg] = useState(user.img.down1);
  useEffect(() => {
      function handleKeyDown(e) {
          switch (e.keyCode) {
            case 37: // Left
              setImg((prev) => (prev == user.img.left1 ? user.img.left2 : user.img.left1));
              break;
            case 38: // Up
              setImg((prev) => (prev == user.img.up1 ? user.img.up2 : user.img.up1));
              break;
            case 39: // Right
              setImg((prev) => (prev == user.img.right1 ? user.img.right2 : user.img.right1));
              break;
            case 40: // Down
              setImg((prev) => (prev == user.img.down1 ? user.img.down2 : user.img.down1));
              break;
            default:
              console.log("not an arrow key!" + e.keyCode);
          }
          socket.emit("move", user.pos);
          console.log(`character.pos: {x: ${user.pos.x}, y: ${user.pos.y}}`);
        } 
        
    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown); 
    }
  });
  
  const userElement = React.createElement(
    "img",
    { 
      src: img,
      alt: user.name, 
      width: mapClass.unitToPx(user.size.width),
      height: mapClass.unitToPx(user.size.height),
      style: { position: "absolute", left: view.unitposToPxpos(user.pos).x, top: view.unitposToPxpos(user.pos).y}
    }
  )
  
  return (
    <div>{ userElement }</div>
    // <div></div>
  );
}

export { Object };

// useEffect(() => {
//   function handleKeyDown(e) {
//     switch (e.keyCode) {
//       case 37: // Left
//         setPosImg((prev) => ({
//           pos: character.left(prev.pos), 
//           img: prev.img == character.img.left1 ? character.img.left2 : character.img.left1
//         }));
//         break;
//       case 38: // Up
//         setPosImg((prev) => ({
//           pos: character.up(prev.pos), 
//           img: prev.img == character.img.up1 ? character.img.up2 : character.img.up1
//         }));
//         break;
//       case 39: // Right
//         setPosImg((prev) => ({
//           pos: character.right(prev.pos), 
//           img: prev.img == character.img.right1  ? character.img.right2 : character.img.right1
//         }));
//         break;
//       case 40: // Down
//         setPosImg((prev) => ({
//           pos: character.down(prev.pos), 
//           img: prev.img == character.img.down1 ? character.img.down2 : character.img.down1
//         }));
//         break;
//       default:
//         console.log("not an arrow key!" + e.keyCode);
//     }
//     character.setPos(posImg.pos);
//     socket.emit("move", character.pos);
//     console.log(`character.pos: {x: ${character.pos.x}, y: ${character.pos.y}}`);
//   } 
  
//   document.addEventListener('keydown', handleKeyDown);

//   return function cleanup() {
//     document.removeEventListener('keydown', handleKeyDown);
//   }
// }, [posImg]);
