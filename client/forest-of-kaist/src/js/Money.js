import React, { useState, useEffect } from 'react';

import { mapClass } from './Map';
import { view } from './View';
import { socket } from './Game';

function viewClickListener(e) {
  const pxpos = { x: e.clientX, y: e.clientY }
  console.log("pxpos", pxpos);
  const position = { x: view.pxposToUnitpos(pxpos).x + view.pos.x, y: view.pxposToUnitpos(pxpos).y + view.pos.y };
  const click = {amount: 10, pos : position};
  socket.emit("clickGround", click);
  console.log("clicked!", position);
};

function createNewPopUp(amount, pos) {
  const popUp = document.createElement("div");
  popUp.innerText = `+${amount}`;
  popUp.setAttribute("style", `
    position: absolute; 
    left: ${view.unitposToPxpos(pos).x - 50}px; 
    top: ${view.unitposToPxpos(pos).y }px; 
    width: 100px; height: 30px; 
    z-index: 100;
    text-align: center;
  `);
  // console.log(, mapClass.unitToPx(pos.x));
  document.getElementById("Game").appendChild(popUp);
  setTimeout(()=>popUp.remove(), 1000);
}

function Money() {
  const divSizeInPx = {
    width: 130,
    height: 40
  };
  const [money, setMoney] = useState(0);


useEffect(()=>{
  socket.on("updateMoney", (res) => {
    setMoney(res);
  });

  /*
  res = {
    amount: Int,
    pos: { x: Float, y: Float }
  }
  */
  socket.on("displayMoney", (res) => {
    console.log("displayMoney: ", res);
    createNewPopUp(res.amount, res.pos);
  });

  return () => {
    socket.off('updateMoney');
    socket.off('displayMoney');
  }
});
  
  return ( 
    <div
      style={{
        position: "absolute",
        left: mapClass.unitToPx(view.size.width) - divSizeInPx.width,
        top: 0,
        zIndex: 9
      }}
    >
      <div
        style={{
          position: "absolute",
          width: divSizeInPx.width,
          height: divSizeInPx.height
        }}
      >
      <img
        src="/images/money.png"
        style={{
          position: "absolute",
          height: divSizeInPx.height,
          top: 0,
          left: 0
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 100,
          top: 0,
          right: 0
        }}
      >
        { money }
      </div>
      </div>
    </div>
  )
}

export { viewClickListener, Money };