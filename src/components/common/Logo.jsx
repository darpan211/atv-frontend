import React from 'react';
import logoImage from '..//';

const Logo = ({ className, imgClass }) => {
  return (
    <div className={`${className ? className : 'text-5xl font-bold text-center'}`}>
      <a href="/">
        <img src={logoImage} alt="logo" className={`${imgClass ? imgClass : ' mx-auto'}`} />
      </a>
    </div>
  );
};

export default Logo;
