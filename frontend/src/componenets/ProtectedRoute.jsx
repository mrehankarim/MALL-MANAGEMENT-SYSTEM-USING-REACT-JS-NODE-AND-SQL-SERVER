import React, { use, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../redux/userSlice/userSlice';
import LoadingPage from './LoadingPage';
const ProtectedRoute = ({ children, role }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => { return state.user.value });
    const loading = useSelector((state) => state.user.loading);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUser());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                console.log("User still null after loading finished.");
                // Avoid redirect loop
                if (location.pathname !== '/') navigate('/');
                return;
            }

            if (user?.role !== role) {
                console.log("Role mismatch:", user?.role);
                if (location.pathname !== '/') navigate('/');
            }
        }
    }, [loading, user, role, navigate, location.pathname]);



    if (loading) return <LoadingPage />;

    return children;
};

export default ProtectedRoute;
