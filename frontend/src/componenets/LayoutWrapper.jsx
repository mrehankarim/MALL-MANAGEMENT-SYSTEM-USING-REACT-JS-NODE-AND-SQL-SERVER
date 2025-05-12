import React,{useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { fetchUser } from '../redux/userSlice/userSlice';
import SubAdminLayout from './SubAdminLayout';

const LayoutWrapper = ({children}) => {
    const user = useSelector((state) => state.user.value);
    const loading = useSelector((state) => state.user.loading);
    const dispatch = useDispatch()
    useEffect(() => 
        {
        dispatch(fetchUser())
    }, [dispatch])
  return (
    <>
      <SubAdminLayout username={loading?"":user?.username}>{children}</SubAdminLayout>
    </>
  )
}

export default LayoutWrapper
