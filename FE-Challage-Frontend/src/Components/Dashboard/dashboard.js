import React, { useState } from 'react';
import './dashboard.scss';

import {
  TiChevronLeftOutline,
  TiChevronRightOutline,
} from 'https://cdn.skypack.dev/react-icons/ti';

const MAX_VISIBILITY = 2;

const Dashboard = ({ children }) => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  const [active, setActive] = useState(2);
  const count = React.Children.count(children);

  return (
    <div className='carousel'>
      {active > 0 && (
        <button className='nav left' onClick={() => setActive(i => i - 1)}>
          <TiChevronLeftOutline />
        </button>
      )}
      {React.Children.map(children, (child, i) => (
        <div
          className='card-container'
          style={{
            '--active': i === active ? 1 : 0,
            '--offset': (active - i) / 3,
            '--direction': Math.sign(active - i),
            '--abs-offset': Math.abs(active - i) / 3,
            'pointer-events': active === i ? 'auto' : 'none',
            opacity: Math.abs(active - i) >= MAX_VISIBILITY ? '0' : '1',
            display: Math.abs(active - i) > MAX_VISIBILITY ? 'none' : 'block',
          }}
        >
          {child}
        </div>
      ))}
      {active < count - 1 && (
        <button className='nav right' onClick={() => setActive(i => i + 1)}>
          <TiChevronRightOutline />
        </button>
      )}
    </div>
  );
};

export default Dashboard;
