import React, { useEffect, useState }  from "react";
import imgDown1 from "../asset/user_down_1.png";
import imgLeft1 from "../asset/user_left_1.png";
import imgUp1 from "../asset/user_up_1.png";
import imgRight1 from "../asset/user_right_1.png";
import imgDown2 from "../asset/user_down_2.png";
import imgLeft2 from "../asset/user_left_2.png";
import imgUp2 from "../asset/user_up_2.png";
import imgRight2 from "../asset/user_right_2.png";

import { socket } from "../App";
import Object from "./Object";

const imgList = {
  down1: imgDown1,
  down2: imgDown2,
  left1: imgLeft1,
  left2: imgLeft2,
  up1: imgUp1,
  up2: imgUp2,
  right1: imgRight1,
  right2: imgRight2
}

class CharacterObj extends Object {
  constructor(size, pos, img, name) {
    super(size, pos, img);
    this.name = name;
  }
  
}

function Character() {
  const character = new CharacterObj({width: 200, height: 200}, "center", imgList, "nupjuk");
  // const [pos, setPos] = useState(character.pos);
  // const [img, setImg] = useState(character.img.down1);
  const [posImg, setPosImg] = useState({
    pos: character.pos,
    img: character.img.down1
  });
  var key = true;
  
  useEffect(() => {
    function handleKeyDown(e) {
      switch (e.keyCode) {
        case 37: // Left
          setPosImg(() => ({
            pos: character.left(), 
            img: key ? character.img.left2 : character.img.left1
          }));
          break;
        case 38: // Up
          setPosImg(() => ({
            pos: character.up(), 
            img: key ? character.img.up2 : character.img.up1
          }));
          break;
        case 39: // Right
          setPosImg(() => ({
            pos: character.right(), 
            img: key ? character.img.right2 : character.img.right1
          }));
          break;
        case 40: // Down
          setPosImg(() => ({
            pos: character.down(), 
            img: key ? character.img.down2 : character.img.down1
          }));
          break;
        default:
          console.log("not an arrow key!" + e.keyCode);
      }
      key = !key;
      socket.emit("move", character.pos);
    }
    
    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);
  
  // const img = <img src={image} alt="Girl in a jacket" width="500" height="600"></img>
  const imgElement = React.createElement(
    "img",
    { src: posImg.img,
      alt: character.name, 
      width: character.size.width,
      style: { position: "absolute", left: posImg.pos.x + "px", top: posImg.pos.y + "px" }
    }
  )
  return (imgElement);
}

export default Character;