export const checkAuth = () => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('userRole');
  
  if (!token) {
    return { isAuthenticated: false, role: null };
  }

  return { isAuthenticated: true, role };
};

export const silentLogout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userRole');
}; 