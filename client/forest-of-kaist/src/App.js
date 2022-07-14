// import logo from './logo.svg';
import './App.css';
import React, { useEffect } from "react";
import Character from './js/Character';
import io from 'socket.io-client';

// const http = require('http');
// const express = require('express');
// const socketio = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);
const socket = io.connect('http://localhost:80', {
  cors: { origin: '*' }
});

function App() {
  return (
    <div>{Character()}</div>
  );
}

export { App, socket };