const BASE_URL = "https://genai-backend-2gji.onrender.com";

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  const response = await fetch(`${BASE_URL}/accounts/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) throw new Error("Refresh failed");

  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
};

export const fetchWithAuth = async (url, options = {}) => {
  let access = localStorage.getItem("access_token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access}`,
    },
  });

  // 如果 access token 過期，就自動用 refresh token 換新
  if (res.status === 401) {
    try {
      access = await refreshToken();

      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${access}`,
        },
      });
    } catch (err) {
      console.error("🔐 Refresh token expired or invalid. Logging out.");
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return res;
};
