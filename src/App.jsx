import React, { useState } from 'react';
import DynamicForm from './components/DynamicForm';
import { ClipboardCheck } from 'lucide-react';

const formSchema = [
  {
    id: 'personalInfo',
    type: 'section',
    label: 'Personal Information',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          message: 'Please enter a valid email address'
        }
      },
      {
        id: 'age',
        type: 'number',
        label: 'Age',
        validation: {
          min: 18,
          max: 100
        }
      }
    ]
  },
  {
    id: 'education',
    type: 'section',
    label: 'Education',
    fields: [
      {
        id: 'degree',
        type: 'select',
        label: 'Highest Degree',
        required: true,
        options: ['High School', "Bachelor's", "Master's", 'PhD']
      },
      {
        id: 'graduationYear',
        type: 'number',
        label: 'Graduation Year',
        required: true,
        validation: {
          min: 1950,
          max: 2024
        }
      }
    ]
  },
  {
    id: 'preferences',
    type: 'section',
    label: 'Preferences',
    fields: [
      {
        id: 'newsletter',
        type: 'checkbox',
        label: 'Subscribe to newsletter'
      },
      {
        id: 'terms',
        type: 'checkbox',
        label: 'I agree to the terms and conditions',
        required: true
      }
    ]
  }
];

function App() {
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (data) => {
    setSubmittedData(data);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '48px 16px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <ClipboardCheck size={48} color="#3182ce" />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '8px'
          }}>Dynamic Form Generator</h1>
          <p style={{
            color: '#4a5568',
            fontSize: '16px'
          }}>Fill out the form below</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '32px'
        }}>
          <DynamicForm schema={formSchema} onSubmit={handleSubmit} />
        </div>

        {submittedData && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            marginTop: '32px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '16px'
            }}>Submitted Data:</h2>
            <pre style={{
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '14px'
            }}>
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;