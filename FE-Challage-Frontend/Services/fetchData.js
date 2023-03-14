// Path: Services\fetchData.js

import React from 'react';

export const fetchData = () => {
    const [data, setData] = React.useState(null);
    
    React.useEffect(() => {
        fetch('http://localhost:3000/tasks')
        .then(res => res.json())
        .then(data => setData(data));
    }, []);
    
    return data;
}

export default fetchData;
