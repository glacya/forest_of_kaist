// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import io from 'socket.io-client';
import Cookies from 'js-cookie';

import { View } from './js/View';
// import Character from './js/Character';
// import Building from './js/Building';
import { Object } from './js/Object';

const socket = io.connect('http://localhost:80', {
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
      { Object() }
    /</div>
    // </RenderInWindow>
  );
}

export { App, socket };