const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const LOGIN_ENDPOINT = '/api/users/login';

type LoginResponse = {
  token: string;
  profile: 'admin' | 'student';
};

export async function loginService(
  email: string,
  password: string,
  userType: 'admin' | 'student'
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, userType }),
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok || !responseBody) {
    const message = responseBody?.message ?? 'Login failed';
    throw new Error(message);
  }

  return responseBody;
}
