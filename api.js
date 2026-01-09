alert('API.JS LOADED FOR REAL');
window.api = { test: () => 'OK' };

// Backend API URL
const API_URL = 'https://loanapp-backend-tojp.onrender.com/api/loan-forms';

// For local testing
// const API_URL = 'http://localhost:3000/api/loan-forms';

const api = {
  // Submit loan application
  async submitApplication(formData) {
    try {
      console.log('Submitting to:', API_URL);
      
      // Convert FormData to JSON object
      const data = {};
      for (let [key, value] of formData.entries()) {
        // Handle file inputs - just store filename for now
        if (value instanceof File) {
          data[key] = value.name;
        } else {
          data[key] = value;
        }
      }
      
      console.log('Application data:', data);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      const result = await response.json();
      console.log('Server response:', result);
      
      return result;
      
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get all applications (for admin)
  async getAllApplications() {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const result = await response.json();
      return result.data; // Return the applications array
      
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get single application by ID
  async getApplication(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch application');
      }

      const result = await response.json();
      return result.data;
      
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Update application status
  async updateStatus(id, status) {
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Delete application
  async deleteApplication(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Test connection to backend
  async testConnection() {
    try {
      const response = await fetch(API_URL.replace('/api/loan-forms', ''), {
        method: 'GET'
      });
      
      const result = await response.json();
      console.log('Backend connection test:', result);
      return result;
      
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }
};

// Make api available globally
window.api = api;

console.log('✅ API module loaded. Backend URL:', API_URL);