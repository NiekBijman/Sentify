import React from 'react';
import drawingAnimation from '../media/circle-draw.gif'

const DrawingAnimation = () => (
  <div className='drawAnimation' >
    <img className='gif' src={drawingAnimation} alt='gif'/>
  </div>
);

export default DrawingAnimation;
