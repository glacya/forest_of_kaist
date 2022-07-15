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

const address = "http://192.249.18.201"

const socket = io.connect(address, {
  cors: { origin: '*' }
});

// const RenderInWindow = (props) => {
//   const [container, setContainer] = useState(null);
//   const newWindow = useRef(window);

//   useEffect(() => {
//     const div = document.createElement("div");
//     setContainer(div);
//   }, []);

//   useEffect(() => {
//     if (container) {
//       newWindow.current = window.open(
//         "",
//         "",
//         "width=600,height=400,left=200,top=200"
//       );
//       newWindow.current.document.body.appendChild(container);
//       const curWindow = newWindow.current;
//       return () => curWindow.close();
//     }
//   }, [container]);

//   return container && createPortal(props.children, container);
// };

function App() {
  const userId = Cookies.get('id');
  console.log(`userId: ${userId}`);
  return (
    // <RenderInWindow>
    <div>
      { View() }
      { ObjectFunc() }
    /</div>
    // </RenderInWindow>
  );
}

export { App, socket };