import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';
const Logo = () => {
    return(
        <Tilt className='Tilt ma4 mt0 br2 shadow-2'>
            <div className='innerTilt'><img src={brain} alt='Brain'/></div>
        </Tilt>
    );
}

export default Logo;