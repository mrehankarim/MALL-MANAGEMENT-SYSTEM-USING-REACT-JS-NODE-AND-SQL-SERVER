import React,{useEffect} from 'react'
import AdminLayout from '../../componenets/AdminLayout'
import AllSubscribers from '../../componenets/AllSubscribers'
import { useSelector,useDispatch } from 'react-redux'
import { fetchUser } from '../../redux/userSlice/userSlice'
const AllSubscribersPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const loading = useSelector((state) => state.user.loading);
    useEffect(() => {
        dispatch(fetchUser());
        console.log(user)
      }, [dispatch]);    
    
  return (
    <>
      <AdminLayout username={loading?"":user?.username}>
        <AllSubscribers></AllSubscribers>
      </AdminLayout>
    </>
  )
}

export default AllSubscribersPage
