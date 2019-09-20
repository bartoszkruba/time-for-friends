import React from 'react';
import './Marker.css';

const Marker = ({color, name, id}) => {
  return (
    <div className="marker"
         style={{backgroundColor: color, cursor: 'pointer'}}
         title={name}
    />
  );
};

export default Marker;