import React,{useEffect} from 'react'
import AdminPanel from '../../componenets/AdminPanel'
import AdminLayout from '../../componenets/AdminLayout'
import { useSelector,useDispatch } from 'react-redux'
import { fetchUser } from '../../redux/userSlice/userSlice'
const Dashboard = () => {
  const dispatch = useDispatch();
      const user = useSelector((state) => state.user.value);
      const loading = useSelector((state) => state.user.loading);
      useEffect(() => {
          dispatch(fetchUser());
        }, [dispatch]);  
  return (
    <>
     < AdminLayout username={loading?"":user?.username} >
     <AdminPanel></AdminPanel>
     </AdminLayout>
    </>
  )
}

export default Dashboard
