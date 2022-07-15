import React, { useState, useEffect } from "react";
import { socket } from "../App";

import { mapClass } from "./Map";
import { user } from "./Character";
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

function ObjectFunc() {
  const [posImg, setPosImg] = useState({
    pos: user.pos,
    img: user.img.down1
  });
  
  // For cashing images
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
  
  const [userPosImg, setUserPosImg] = useState({
    pos: user.pos,
    img: user.img.down1
  });

  const [viewPos, setViewPos] = useState(view.pos);
  
  const handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 37: // Left
        setUserPosImg((prev) => ({
          pos: user.left(prev.pos), 
          img: prev.img == user.img.left1 ? user.img.left2 : user.img.left1
        }));
        setViewPos((prev) => view.left(prev));
        break;
      case 38: // Up
        setUserPosImg((prev) => ({
          pos: user.up(prev.pos), 
          img: prev.img == user.img.up1 ? user.img.up2 : user.img.up1
        }));
        setViewPos((prev) => view.up(prev));
        break;
      case 39: // Right
        setUserPosImg((prev) => ({
          pos: user.right(prev.pos), 
          img: prev.img == user.img.right1 ? user.img.right2 : user.img.right1
        }));
        setViewPos((prev) => view.right(prev));
        break;
      case 40: // Down
        setUserPosImg((prev) => ({
          pos: user.down(prev.pos), 
          img: prev.img == user.img.down1 ? user.img.down2 : user.img.down1
        }));
        setViewPos((prev) => view.down(prev));
        break;
      default:
        console.log("not an arrow key!" + e.keyCode);
    }
  };
  
  useEffect(() => {
    user.setPos(userPosImg.pos);
    view.setPos(viewPos);
    socket.emit("move", user.pos);
    console.log(`user.pos: {x: ${user.pos.x}, y: ${user.pos.y}}`);
  }, [userPosImg]);
    
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);
 
  // document.addEventListener('keydown', () => {
  //   setImg(img == user.img.left1 ? user.img.left2 : user.img.left1);
  // }); 
  
  // useEffect(() => {
  //     function handleKeyDown(e) {
  //         switch (e.keyCode) {
  //           case 37: // Left
  //               setPosImg((prev) => ({
  //                 pos: user.left(prev.pos), 
  //                 img: prev.img == user.img.left1 ? user.img.left2 : user.img.left1
  //               }));
  //             break;
  //           case 38: // Up
  //             setPosImg((prev) => ({
  //               pos: user.up(prev.pos), 
  //               img: prev.img == user.img.up1 ? user.img.up2 : user.img.up1
  //             }));
  //             break;
  //           case 39: // Right
  //             setPosImg((prev) => ({
  //               pos: user.right(prev.pos), 
  //               img: prev.img == user.img.right1 ? user.img.right2 : user.img.right1
  //             }));
  //             break;
  //           case 40: // Down
  //             setPosImg((prev) => ({
  //               pos: user.down(prev.pos), 
  //               img: prev.img == user.img.down1 ? user.img.down2 : user.img.down1
  //             }));
  //             break;
  //           default:
  //             console.log("not an arrow key!" + e.keyCode);
  //         }
  //         user.setPos(posImg.pos);
  //         socket.emit("move", user.pos);
  //         console.log(`character.pos: {x: ${user.pos.x}, y: ${user.pos.y}}`);
  //       } 
        
  //   document.addEventListener('keydown', handleKeyDown);

  //   return function cleanup() {
  //     document.removeEventListener('keydown', handleKeyDown); 
  //   }
  // }, [posImg]);
  
  const userElement = React.createElement(
    "img",
    { 
      src: userPosImg.img,
      alt: user.name, 
      width: mapClass.unitToPx(user.size.width),
      height: mapClass.unitToPx(user.size.height),
      style: { position: "absolute", left: view.unitposToPxpos(user.pos).x, top: view.unitposToPxpos(user.pos).y}
    }
  )
  
  return (
    <div>{ isLoading ? "Loading image ..." : userElement }</div>
    // <div></div>
  );
}

export { ObjectFunc };

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
