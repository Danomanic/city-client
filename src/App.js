import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import socketIOClient from 'socket.io-client';
import './App.css';

function App() {
  const [state, setState] = useState(
    {
      serverTime: null,
      serverStatus: false,
      areas: [],
    },
  );

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_SERVER_ENDPOINT, { transports: ['websocket'] });

    socket.on('connect', () => {
      setState({ ...state, serverStatus: socket.connected });
    });

    socket.on('disconnect', () => {
      setState({ ...state, serverStatus: socket.connected });
    });

    socket.on('update', (data) => {
      if (state.areas === data.areas) {
        setState({ ...state, serverTime: data.serverTime });
      } else {
        setState({ ...state, serverTime: data.serverTime, areas: data.areas });
      }
    });
  }, []);

  const { serverTime, serverStatus, areas } = state;

  const listArea = areas.map((area) => {
    const style = { top: area.top, left: area.left };
    return <div style={style} className="area">{area.id}</div>;
  });

  return (
    <div className="App">
      <div className="App-debug">
        <p>
          <h3>Server Info</h3>
          <strong>Status</strong>
          {' : '}
          {serverStatus.valueOf
            ? <span className="green">Online</span>
            : 'Offline'}
          <br />
          <strong>Response Time</strong>
          {' : '}
          <time dateTime={serverTime}>{serverTime}</time>
        </p>
      </div>
      <Draggable
        bounds={{
          top: -2000, left: -2000, right: 500, bottom: 500,
        }}
        grid={[50, 50]}
      >
        <div>{listArea}</div>
      </Draggable>
    </div>
  );
}

export default App;
