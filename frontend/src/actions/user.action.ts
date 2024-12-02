const logout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}
export { logout };