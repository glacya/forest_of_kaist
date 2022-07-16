import React, { useState, useEffect, useRef } from "react";
import { socket } from "../App";
import Cookies from 'js-cookie';

import { mapClass } from "./Map";
import { user } from "./Character";
import { view } from "./View";

var objList = [];

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

function getNewCurrObjElemList() {
  console.log("getNewCurrObjElemList called");
  var tempObjElemList = [];
  objList.forEach(obj => {
    tempObjElemList.push(React.createElement(
      "img",
      {
        key: obj.id,
        id: obj.id,
        src: obj.img,
        alt: obj.name, 
        width: mapClass.unitToPx(obj.size.width),
        height: mapClass.unitToPx(obj.size.height),
        style: { 
          position: "absolute", 
          left: view.unitposToPxpos(obj.pos).x, 
          top: view.unitposToPxpos(obj.pos).y,
          zIndex: view.getZIdx(obj.type)
        }
      }
    ));
  });
  return tempObjElemList;
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
  objList = res.add;
  setCurrObjElemList(getNewCurrObjElemList());
}

function updateObjList(res) { // called when user has moved over one unit; after this function called, viewObjList, marginObjList, currObjElemList are up-to-dated.
  objList = objList.filter(obj => {
    var result = true;
    res.delete.forEach(objj => {
      if(objj.id === obj.id) {
        result = false;
        return;
      }
    })
    return result;
  });
  objList = objList.concat(res.add);
  
  setCurrObjElemList(getNewCurrObjElemList());
}


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
    }
  };
  
  useEffect(() => {
    user.setPos(userPosImg.pos);
    socket.emit("move", {
      id: user.id,
      pos: user.pos
    });
    if (
      parseInt((userPosImg.pos.x * 10).toFixed(0)) % 10 == 0 ||
      parseInt((userPosImg.pos.y * 10).toFixed(0)) % 10 == 0
    ) {
      socket.emit("updateUnit", {
        id: user.id,
        pos: user.pos
      });
    }
    console.log(`user.pos: (x: ${userPosImg.pos.x}, y: ${userPosImg.pos.y})`);
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
      style: { 
        position: "absolute", 
        left: view.unitposToPxpos(user.pos).x, 
        top: view.unitposToPxpos(user.pos).y,
        zIndex: view.getZIdx(user.type)
      }
    }
  )
  
  useEffect(() => {
    socket.emit("enter", user);
    socket.on("welcome", (res) => {
      user.setId(res.id);
      setObjList(res.objList);
    });
    socket.on("updateObjList", (res) => updateObjList(res));
  }, []);
  
  useEffect(() => {
    view.setPos(viewPos);
    setCurrObjElemList(getNewCurrObjElemList());
  }, [viewPos]);
  
  return (
    <div>
      { currObjElemList }
      { isLoading ? "Loading image ..." : userElement }
    </div>
  );
}

export { ObjectFunc };