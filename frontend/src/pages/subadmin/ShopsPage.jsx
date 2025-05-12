import React, { useEffect } from 'react'
import SubAdminLayout from '../../componenets/SubAdminLayout'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUser } from '../../redux/userSlice/userSlice'
import Shops from '../../componenets/Shops'
const ShopsPage = () => {
    const user = useSelector((state) => state.user.value);
    const loading = useSelector((state) => state.user.loading);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUser())
    }, [dispatch])
    return (
        <>
            <SubAdminLayout username={loading?"":user?.username}><Shops/></SubAdminLayout>
        </>
    )
}

export default ShopsPage
