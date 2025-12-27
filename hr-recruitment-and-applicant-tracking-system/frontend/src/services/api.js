export const API_BASE_URL = "http://localhost:8080/api";

export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };

  const config = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 403 || response.status === 401) {
    // Optional: Redirect to login if unauthorized
    // window.location.href = "/login";
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "API Request Failed";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.error || errorText;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};
