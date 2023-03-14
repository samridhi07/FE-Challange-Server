import React from 'react';
import './splashscreen.scss';

const SplashScreen = () => {
  return (
    <div id='loader'>
      <img
        src='https://media.licdn.com/dms/image/C560BAQEjUkNswCZAOg/company-logo_200_200/0/1651901624753?e=2147483647&v=beta&t=8cqV55iGGTTOD-sKB9Wsu8MFnC9IZVVWmMMqemf4yRw'
        alt='logo_err'
        className='logo'
      />
      <div id='progressbar'></div>
    </div>
  );
};

export default SplashScreen;
