// Backend API URL
const API_URL = "https://loanapp-backend-tojp.onrender.com/api/loan-forms";

// For local testing
// const API_URL = "http://localhost:3000/api/loan-forms";

const api = {
  // ✅ Submit loan application (FormData + files)
  async submitApplication(formData) {
    try {
      console.log("🚀 Submitting to:", API_URL);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData, // ⭐ send FormData directly
        // ❌ DO NOT set headers
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed");
      }

      console.log("✅ Server response:", result);
      return result;
    } catch (error) {
      console.error("❌ API Error:", error);
      throw error;
    }
  },

  // Get all applications (admin)
  async getAllApplications() {
    const response = await fetch(API_URL);
    const result = await response.json();
    return result.data;
  },

  // Get single application
  async getApplication(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const result = await response.json();
    return result.data;
  },

  // Update status
  async updateStatus(id, status) {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    return response.json();
  },

  // Delete application
  async deleteApplication(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    return response.json();
  },

  // Test backend
  async testConnection() {
    const response = await fetch(API_URL.replace("/api/loan-forms", ""));
    return response.json();
  },
};

window.api = api;
console.log("✅ API module loaded. Backend URL:", API_URL);
