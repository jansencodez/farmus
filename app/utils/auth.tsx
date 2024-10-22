import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../baseUrl";
// Update with your base URL

export const refreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (token && refreshToken) {
      const response = await fetch(`${baseUrl}api/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store new token and refresh token (if applicable)
        await AsyncStorage.setItem("token", data.newToken);
        if (data.newRefreshToken) {
          await AsyncStorage.setItem("refreshToken", data.newRefreshToken);
        }
        return data.newToken; // Return the new token if needed
      } else {
        throw new Error("Failed to refresh token");
      }
    }
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    // Handle token refresh failure (e.g., log the user out)
  }
};

export const fetchWithTokenRefresh = async (
  url: string,
  options: RequestInit
) => {
  let token = await AsyncStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // Unauthorized
    // Try to refresh the token
    token = await refreshToken();

    console.log(token);
    if (token) {
      // Retry the original request with the new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // Handle refresh failure (e.g., redirect to login)
      throw new Error("Unable to refresh token");
    }
  }

  return response;
};
