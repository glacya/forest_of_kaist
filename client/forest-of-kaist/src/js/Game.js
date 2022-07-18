
import React from 'react';
import io from 'socket.io-client';

import { View } from './View';
import { ObjectFunc } from './Object';
import { Money } from './Money';

// const address = "http://172.10.18.171";
const address = "http://192.249.18.201";

const socket = io.connect(address, {
  cors: { origin: ["http://localhost", "http://localhost:3000","http://localhost:3001"]},
  transports: ['websocket'],
  upgrade: false
});

function Game() {
  
  const frame = React.createElement(
    "img",
    { 

      src: "/images/frame.png",
      alt: "Frame", 
      style: { 
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 10,
        pointerEvents: "none"
      }
    }
  )
  
  return (
    <div id="Game">
      { View() }
      { ObjectFunc() }
      { Money() }
      { frame }
    </div>
  );
}

export { Game, socket };