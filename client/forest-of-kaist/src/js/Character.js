import React, { useEffect, useState }  from "react";
import imgDown1 from "../asset/user_down_1.png"
import imgLeft1 from "../asset/user_left_1.png"
import imgUp1 from "../asset/user_up_1.png"
import imgRight1 from "../asset/user_right_1.png"
import imgDown2 from "../asset/user_down_2.png"
import imgLeft2 from "../asset/user_left_2.png"
import imgUp2 from "../asset/user_up_2.png"
import imgRight2 from "../asset/user_right_2.png"

import { socket } from "../App"

function Character() {
  const imgSize = { width: 200, height: 200 }
  const [img, setImg] = useState(imgDown1);
  const [pos, setPos] = useState({
    x: window.innerWidth / 2 - imgSize.width / 2, 
    y: window.innerHeight / 2 - imgSize.height/2
  });
  
  useEffect(() => {
    function handleKeyDown(e) {
      switch (e.keyCode) {
        case 37: // Left
          setImg(img === imgLeft1 ? imgLeft2 : imgLeft1);
          setPos(pos => ({x: pos.x - 10, y: pos.y}));
          break;
        case 38: // Up
          setImg(img === imgUp1 ? imgUp2 : imgUp1);
          setPos(pos => ({x: pos.x, y: pos.y - 10}));
          break;
        case 39: // Right
          setImg(img === imgRight1 ? imgRight2 : imgRight1);
          setPos(pos => ({x: pos.x + 10, y: pos.y}));
          break;
        case 40: // Down
          setImg(img === imgDown1 ? imgDown2 : imgDown1);
          setPos(pos => ({x: pos.x, y: pos.y + 10}));
          break;
        default:
          console.log("not an arrow key!" + e.keyCode);
      }
      socket.emit("move", pos);
    }


    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [img]);
  
  // const img = <img src={image} alt="Girl in a jacket" width="500" height="600"></img>
  const imgElement = React.createElement(
    "img",
    { src: img,
      alt: "넙죽이", 
      width: imgSize.width,
      style: { position: "absolute", left: pos.x + "px", top: pos.y + "px" }
    }
  )
  return (imgElement);
}

export default Character;