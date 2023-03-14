import axios from 'axios';
import React, { useState } from 'react';

const FormScreen = () => {

    const [formData, setFormData] = useState({
        Status: '',
         RepositoryName:'',
         Findings: '',
         }); 
         const handleSubmit = async (event) => {
            event.preventDefault();
            var findingsJSON = JSON.parse(formData.Findings)

            formData.Findings = findingsJSON;
            const response = axios.post('http://localhost:3000/tasks', formData)
            console.log(formData)
            };
           
          
          const handleChange = (event) => {
            setFormData({
              ...formData,
              [event.target.name]: event.target.value
            });
          };
          
        return (
        <form onSubmit={handleSubmit}>
         <label>
         Status:<input type="text" name="Status" value={formData.Status} onChange={handleChange} />
         </label>
         <label>
         RepositoryName:<input type="text" name="RepositoryName" value={formData.RepositoryName} onChange={handleChange} />
         </label>
         <label>
         Findings:<input type="text-area" name="Findings" value={formData.Findings} onChange={handleChange} />
         </label>
         
         <button type="submit">Submit</button>
         </form>
        );  
};

export default FormScreen;