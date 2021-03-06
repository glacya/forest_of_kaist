import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from './js/login/AuthProvider';
import {Link, Route, Switch, BrowserRouter} from "react-router-dom";
import Login from './js/login/Login'
import Register from './js/login/Register'

const root = ReactDOM.createRoot(document.getElementById('root'));

// ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
//   ,document.getElementById('root')
// );

// ReactDOM.render(
//   <BrowserRouter>
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   </BrowserRouter>
// ,
//   document.getElementById('root')
// );

root.render(
  // <React.StrictMode>
  // <AuthProvider>
    <App />
  // </AuthProvider>   
  // </React.StrictMode>
); 

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
