import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const [formData, setFormData] = useState({ username: "" });

  // Fetch the CSRF token when the component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/csrf-token", // Fetch the CSRF token from the server
          { withCredentials: true } // Include cookies in the request
        );
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, []);

  console.log("CSRF token state:", csrfToken);
  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(csrfToken, "handlesubmit csrfToken");
      await axios.post("http://localhost:5001/api/submit-form", formData, {
        headers: {
          "X-CSRF-Token": csrfToken, // Include the CSRF token in the headers
        },
        withCredentials: true, // Include cookies in the request
      });
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div>
      <h2>Secure Form with CSRF Protection</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default App;
