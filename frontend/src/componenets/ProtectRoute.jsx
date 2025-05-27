import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../redux/userSlice/userSlice';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProtectRoute = ({ children, role }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);

    useEffect(() => {
        if (!user && !loading) {
            dispatch(fetchUser());
        }
    }, [dispatch, user, loading]);

    useEffect(() => {
        if (!loading && (error || (user && user.role !== role))) {
            navigate('/');
        }
    }, [loading, user, role, navigate, error]);

   

    return <>{children}</>;
};

export default ProtectRoute;
