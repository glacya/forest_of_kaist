// import logo from './logo.svg';
import './App.css';
import React, { useEffect } from "react";
import io from 'socket.io-client';

import { View } from './js/View';
import Character from './js/Character';

// const http = require('http');
// const express = require('express');
// const socketio = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);
const socket = io.connect('http://localhost:8000', {
  cors: { origin: '*'}
});

function App() {
  return (
    <div>
      { View() }
      { Character() }
    </div>
  );
}

export { App, socket };