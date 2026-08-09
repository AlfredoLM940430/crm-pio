let navigate;

export const setNavigate = (nav) => {
    navigate = nav;
};

export const goToLogin = () => {
    if (navigate) {
        navigate('/login');
    } else {
        window.location.href = '/login'; // Fallback por si no se ha montado el router
    }
};