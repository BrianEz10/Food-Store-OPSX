export const getMemToken = (): string | null => {
  // We will integrate this with authStore later
  // For now, it returns null or reads from a temporary global location
  return (window as any).__accessToken || null;
};

export const setMemToken = (token: string | null) => {
  (window as any).__accessToken = token;
};

export const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  // Convert exp to milliseconds and compare with current time
  // Optional: Add a buffer (e.g. 5 minutes = 300000 ms)
  return (decoded.exp * 1000) < Date.now();
};
