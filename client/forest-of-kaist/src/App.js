// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from "react";
import {Link, Route, Routes,Switch, BrowserRouter} from "react-router-dom";
import ReactDOM from 'react-dom';
import { createPortal } from "react-dom";
import Cookies from 'js-cookie';


import Login from './js/login/Login';
import Register from './js/login/Register'
import Layout from './js/login/Layout';

import { Game } from './js/Game';



// ReactDOM.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
//   document.getElementById('root')
// );

function App() {
  const userId = Cookies.get('id');
  // console.log(`userId: ${userId}`);
  return (
    // <div>
    //   <Route path="/" component={Layout} exact={true} />
    //   <Route path="/login" component={Login} />
    //   <Route path="/register" component={Register} />
    // </div>


    <main className='App'>
    <BrowserRouter>
     <Routes>
      {/* <Route path="/" element={<Login />}> */}
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="*" element={<Login/>} />
      {/* </Route> */}
    </Routes>
    </BrowserRouter>
      </main>
   
    
    // <main className='App'>
    //   <Register /> 
    // </main>
    
    
    // <RenderInWindow>
    // <div>
    //   { View() }
    //   { ObjectFunc() }
    //   { frame }
    // </div>
    // </RenderInWindow>
    
  );
}

export { App };