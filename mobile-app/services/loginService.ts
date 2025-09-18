import { API_BASE_URL } from '@/constants/api';

type LoginResponse = {
  token: string;
  profile: 'admin' | 'student';
};

export async function loginService(
  email: string,
  password: string,
  userType: 'admin' | 'student'
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, userType }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}
