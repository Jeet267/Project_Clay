import React, { useState } from 'react';
import { FormField, FormData } from '../types/form';

interface DynamicFormProps {
  schema: FormField[];
  onSubmit: (data: FormData) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: FormField, value: any): string => {
    if (field.required && !value) {
      return 'This field is required';
    }

    if (field.validation) {
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }

      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
        return field.validation.message || 'Invalid format';
      }

      if (field.type === 'number') {
        const numValue = Number(value);
        if (field.validation.min !== undefined && numValue < field.validation.min) {
          return `Value must be at least ${field.validation.min}`;
        }
        if (field.validation.max !== undefined && numValue > field.validation.max) {
          return `Value must be at most ${field.validation.max}`;
        }
      }
    }

    return '';
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    
    const field = schema.find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldId]: error
      }));
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'section':
        return (
          <div key={field.id} style={{ 
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '15px',
              color: '#2c3e50',
              borderBottom: '2px solid #e9ecef',
              paddingBottom: '8px'
            }}>{field.label}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {field.fields?.map((subField) => renderField(subField))}
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={field.id} style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#4a5568'
            }}>
              {field.label}
              {field.required && <span style={{ color: '#e53e3e', marginLeft: '4px' }}>*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e0',
                fontSize: '14px',
                backgroundColor: 'white',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#4a5568',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e0',
                  cursor: 'pointer'
                }}
              />
              <span>
                {field.label}
                {field.required && <span style={{ color: '#e53e3e', marginLeft: '4px' }}>*</span>}
              </span>
            </label>
            {error && <p style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
          </div>
        );

      default:
        return (
          <div key={field.id} style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#4a5568'
            }}>
              {field.label}
              {field.required && <span style={{ color: '#e53e3e', marginLeft: '4px' }}>*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e0',
                fontSize: '14px',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
            />
            {error && <p style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
          </div>
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    const validateFields = (fields: FormField[]) => {
      fields.forEach(field => {
        if (field.type === 'section' && field.fields) {
          validateFields(field.fields);
        } else {
          const error = validateField(field, formData[field.id]);
          if (error) {
            newErrors[field.id] = error;
            hasErrors = true;
          }
        }
      });
    };

    validateFields(schema);

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {schema.map((field) => renderField(field))}
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#3182ce',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          marginTop: '20px',
          transition: 'background-color 0.2s ease',
          ':hover': {
            backgroundColor: '#2c5282'
          }
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;