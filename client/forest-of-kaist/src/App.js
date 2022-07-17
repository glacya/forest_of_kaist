// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from "react";
import {Link, Route, Routes,Switch, BrowserRouter} from "react-router-dom";
import ReactDOM from 'react-dom';
import { createPortal } from "react-dom";
import io from 'socket.io-client';
import Cookies from 'js-cookie';

import { View } from './js/View';
// import Character from './js/Character';
// import Building from './js/Building';
import { ObjectFunc } from './js/Object';

import Login from './js/login/Login';
import Register from './js/login/Register'
import Layout from './js/login/Layout';

// const address = "http://172.10.18.171";
const address = "http://192.249.18.201";

const socket = io.connect(address, {
  cors: { origin: ["http://localhost", "http://localhost:3000","http://localhost:3001"]}
});


// ReactDOM.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
//   document.getElementById('root')
// );

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
    // <div>
    //   <Route path="/" component={Layout} exact={true} />
    //   <Route path="/login" component={Login} />
    //   <Route path="/register" component={Register} />
    // </div>

    // <Routes>
    //   <Route path="/" element={<Layout />}>
    //     {/* public routes */}
    //     <Route path="login" element={<Login />} />
    //     <Route path="register" element={<Register />} />
        
    //     {/* catch all
    //     <Route path="*" element={<Missing />} /> */}
    //   </Route>
    // </Routes>
    
    // <main className='App'>
    //   <Register /> 
    // </main>
    
    
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