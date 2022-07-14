import React, { useEffect, useState }  from "react";

import { socket } from "../App";
import { default as Obj } from "./Object";
import { mapClass } from "./Map";
import { view } from "./View";

const imgList = {
  down1: "/images/user_down_1.png",
  down2: "/images/user_down_2.png",
  left1: "/images/user_left_1.png",
  left2: "/images/user_left_2.png",
  up1: "/images/user_up_1.png",
  up2: "/images/user_up_2.png",
  right1: "/images/user_right_1.png",
  right2: "/images/user_right_2.png"
}

class CharacterObj extends Obj {
  constructor(size, pos, img, name) {
    super(size, pos, img);
    this.name = name;
  }
  
}

function Character() {
  const character = new CharacterObj({width: 2, height: 2}, "center", imgList, "nupjuk");
  const [posImg, setPosImg] = useState({
    pos: character.pos,
    img: character.img.down1
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const imgs = Object.values(imgList);
    cacheImages(imgs);
  }, []);
  
  const cacheImages = async (srcArray) => {
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();
        
        img.src = src;
        img.onload = resolve();
        img.onerror = reject();
      });
    });
    await Promise.all(promises);
    setIsLoading(false);
  };
  
  useEffect(() => {
    function handleKeyDown(e) {
      switch (e.keyCode) {
        case 37: // Left
          setPosImg((prev) => ({
            pos: character.left(prev.pos), 
            img: prev.img == character.img.left1 ? character.img.left2 : character.img.left1
          }));
          break;
        case 38: // Up
          setPosImg((prev) => ({
            pos: character.up(prev.pos), 
            img: prev.img == character.img.up1 ? character.img.up2 : character.img.up1
          }));
          break;
        case 39: // Right
          setPosImg((prev) => ({
            pos: character.right(prev.pos), 
            img: prev.img == character.img.right1  ? character.img.right2 : character.img.right1
          }));
          break;
        case 40: // Down
          setPosImg((prev) => ({
            pos: character.down(prev.pos), 
            img: prev.img == character.img.down1 ? character.img.down2 : character.img.down1
          }));
          break;
        default:
          console.log("not an arrow key!" + e.keyCode);
      }
      character.setPos(posImg.pos);
      socket.emit("move", character.pos);
      console.log(`character.pos: {x: ${character.pos.x}, y: ${character.pos.y}}`);
    }
    
    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [posImg]);
  
  const imgElement = React.createElement(
    "img",
    { 
      src: posImg.img,
      alt: character.name, 
      width: mapClass.unitToPx(character.size.width),
      height: mapClass.unitToPx(character.size.height),
      style: { position: "absolute", left: view.unitposToPxpos(posImg.pos).x, top: view.unitposToPxpos(posImg.pos).y}
    }
  )
  return (
    <div>
      { isLoading ? "Loading image ..." : imgElement }
    </div>
  );
}

export default Character;