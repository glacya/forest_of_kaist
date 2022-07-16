// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import io from 'socket.io-client';
import Cookies from 'js-cookie';

import { View } from './js/View';
// import Character from './js/Character';
// import Building from './js/Building';
import { ObjectFunc } from './js/Object';

const address = "http://192.249.18.201";

const socket = io.connect(address, {
  cors: { origin: '*' }
});

function App() {
  const userId = Cookies.get('id');
  // console.log(`userId: ${userId}`);
  const frame = React.createElement(
    "img",
    { 
      src: "/images/frame.png",
      alt: "Frame", 
      style: { 
        position: "absolute",
        zIndex: 10
      }
    }
  )
  return (
    // <RenderInWindow>
    <div>
      { View() }
      { ObjectFunc() }
      { frame }
    </div>
    // </RenderInWindow>
  );
}

export { App, socket };