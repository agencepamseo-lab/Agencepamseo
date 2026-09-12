export function getStoredSessionToken(): string | null {
  try {
    return sessionStorage.getItem('lf_operator_session_token');
  } catch {
    return null;
  }
}

export function setStoredSessionToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem('lf_operator_session_token', token);
    } else {
      sessionStorage.removeItem('lf_operator_session_token');
    }
  } catch {
    // Ignore storage restrictions if blocked
  }
}

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  const token = getStoredSessionToken();
  if (token && !headers.has('x-session-id')) {
    headers.set('x-session-id', token);
  }
  return fetch(input, {
    ...init,
    credentials: 'include',
    headers
  });
}
