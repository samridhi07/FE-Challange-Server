import React, { useState } from 'react';
const FormScreen = () => {

    const [formData, setFormData] = useState({
         id: '',
         status: '',
         repositoryName:'',
         findings:'',
         queuedAt:'',
         scanningAt:'',
         finishedAt:''
         }); 
         const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await fetch('/tasks', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData),
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Form submitted successfully:', data);
                  } else {
                    console.error('Error submitting form:', response.status);
                  }
                } catch (error) {
                  console.error('Error submitting form:', error);
                }
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
         Status:<input type="text" name="status" value={formData.status} onChange={handleChange} />
         </label>
         <label>
         RepositoryName:<input type="text" name="repositoryName" value={formData.repositoryName} onChange={handleChange} />
         </label>
         <label>
         Findings:<input type="text-area" name="findings" value={formData.findings} onChange={handleChange} />
         </label>
         
         <button type="submit">Submit</button>
         </form>
        );  
};

export default FormScreen;