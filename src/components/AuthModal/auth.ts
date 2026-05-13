const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginData {
  email: string;
  password: string;
}

export async function loginUser(data: LoginData) {
  const response = await fetch(
    `${API_URL}/api/login/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Login error");
  }

  return response.json();
}