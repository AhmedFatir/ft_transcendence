import React, { useEffect, useState } from 'react';

const AchievementsPopup = () => {
  useEffect(() => {
      const socket = new WebSocket('ws://localhost:8000/ws/test/');

      socket.onopen = function(event) {
          console.log('WebSocket connection opened');
      };

      socket.onmessage = function(event) {
          const data = JSON.parse(event.data);
          console.log(data.message)
      };

      socket.onerror = function(error) {
          console.error('WebSocket error:', error);
      };

      socket.onclose = function(event) {
          console.log('WebSocket connection closed:', event);
      };
      
    }, []);
    
  return (
    <div className='achievements-popup'>
      <div className='achievement'>
        <h3>aa</h3>
        <p>bb</p>
      </div>
    </div>
  );
};

export default AchievementsPopup;