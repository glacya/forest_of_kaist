import React, { useState, useEffect, useRef } from "react";
import { socket } from "../App";
import Cookies from 'js-cookie';

import { mapClass } from "./Map";
import { user } from "./Character";
import { view } from "./View";

var viewObjList = [];
var marginObjList = [];
// var currObjElemList = [];

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
  
  const [currObjElemList, setCurrObjElemList] = useState([]);
  
  /*
res == {
  add: [ Object, Object, ... ], 
  delete: [ Object.id, Object.id, ... ]
}
*/

function setObjList(res) { 
  console.log("QJNWEKJ");
  console.log(res);
  var newViewObjList = [];
  var newMarginObjList = [];
   
  res.add.forEach(obj => {
    if (
      (view.pos.x < obj.pos.x + obj.size.width)   &&   // left
      (view.pos.y < obj.pos.y + obj.size.height)  &&   // top
      (view.pos.x + view.size.width < obj.pos.x)  &&   // right
      (view.pos.y + view.size.height > obj.pos.y)      // bottom
    ) {
      newViewObjList.push(obj);
    }
    else newMarginObjList.push(obj);
  });
  
  viewObjList = newViewObjList;
  marginObjList = newMarginObjList;
  
  var tempObjElemList = [];
  viewObjList.forEach(obj => {
    tempObjElemList.push(React.createElement(
      "img",
      {
        id: obj.id,
        src: obj.img,
        alt: obj.name, 
        width: mapClass.unitToPx(obj.size.width),
        height: mapClass.unitToPx(obj.size.height),
        style: { position: "absolute", left: view.unitposToPxpos(obj.pos).x, top: view.unitposToPxpos(obj.pos).y}
      }
    ));
  });
  setCurrObjElemList(prev => tempObjElemList);
}

function updateObjList(res) { // called when user has moved over one unit; after this function called, viewObjList, marginObjList, currObjElemList are up-to-dated.
  // objList = objList.filter(obj => !(res.delete.includes(obj)));
  console.log("res.add:");
  console.log(res.add);
  marginObjList = marginObjList.filter(obj => {
    res.delete.forEach(id => {
      if(id == obj.id) return false;
    })
    return true;
  });
  marginObjList = marginObjList.concat(res.add);
  
  console.log("marginObjList:");
  console.log(marginObjList);
  
  var newViewObjList = [];
  var newMarginObjList = [];
  viewObjList.forEach(obj => {
    console.log(`view obj: obj`);
    console.log(obj);
    if (
      (view.pos.x < obj.pos.x + obj.size.width)   &&   // left
      (view.pos.y < obj.pos.y + obj.size.height)  &&   // top
      (view.pos.x + view.size.width < obj.pos.x)  &&   // right
      (view.pos.y + view.size.height > obj.pos.y)      // bottom
    ) newViewObjList.push(obj);
    else {
      newMarginObjList.push(obj);
    }
  })
  
  marginObjList.forEach(obj => {
    console.log(`margobj: obj`);
    console.log(obj);
    if (
      true ||
      (view.pos.x < obj.pos.x + obj.size.width)   &&   // left
      (view.pos.y < obj.pos.y + obj.size.height)  &&   // top
      (view.pos.x + view.size.width < obj.pos.x)  &&   // right
      (view.pos.y + view.size.height > obj.pos.y)      // bottom
    ) {
      newViewObjList.push(obj);
    }
    else newMarginObjList.push(obj);
  });
  viewObjList = newViewObjList;
  marginObjList = newMarginObjList;
  
  console.log("finviewObjList:");
  console.log(viewObjList);
  
  console.log("finmarginObjList:");
  console.log(marginObjList);
  
  var tempObjElemList = [];
  viewObjList.forEach(obj => {
    tempObjElemList.push(React.createElement(
      "img",
      {
        id: obj.id,
        src: obj.img,
        alt: obj.name, 
        width: mapClass.unitToPx(obj.size.width),
        height: mapClass.unitToPx(obj.size.height),
        style: { position: "absolute", left: view.unitposToPxpos(obj.pos).x, top: view.unitposToPxpos(obj.pos).y}
      }
    ));
  });
  setCurrObjElemList(prev => tempObjElemList);
}

function updateObjPxpos() {
  // const obj1 = React.createElement(
  //   "img",
  //   {
  //     src: "/images/building_center.png",
  //     alt: "Buildinggg", 
  //     width: 500
  //   }
  // )
  // const obj2 = React.createElement(
  //   "img",
  //   {
  //     src: "/images/building_center.png",
  //     alt: "Buildingggggggggg", 
  //     width: 200
  //   }
  // )
  // currObjElemList = [obj1, obj2];
  
}

// useEffect(() => {

//   console.log("currObjElemList: ");
//   console.log(currObjElemList);
// }, [currObjElemList]);

  const prevPos = user.pos;
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
        // console.log("not an arrow key!" + e.keyCode);
    }
  };
  
  useEffect(() => {
    user.setPos(userPosImg.pos);
    view.setPos(viewPos);
    socket.emit("move", {
      id: user.id,
      pos: user.pos
    });
    updateObjPxpos();
    if (
      Math.floor(prevPos.x) != Math.floor(userPosImg.pos.x) ||
      Math.floor(prevPos.y) != Math.floor(userPosImg.pos.y)
    ) {
      socket.emit("updateUnit", {
        id: user.id,
        pos: user.pos
      });
    }
    // console.log(`user.pos: {x: ${user.pos.x}, y: ${user.pos.y}}`);
  }, [userPosImg]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);
  
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
  
  useEffect(() => {
    console.log("updated:");
    console.log(currObjElemList);
  }, [currObjElemList]);
  
  useEffect(() => {
    socket.emit("enter", user);
    // console.log("Entered in the world!");
    // console.log(`id: ${Cookies.get('id')}`);
    socket.on("welcome", (res) => {
      user.setId(res.id);
      setObjList(res.objList);
    });
    socket.on("updateObjList", (res) => updateObjList(res));
  }, []);
  
  return (
    <div>
      { currObjElemList }
      { isLoading ? "Loading image ..." : userElement }
    </div>
  );
}

export { ObjectFunc };