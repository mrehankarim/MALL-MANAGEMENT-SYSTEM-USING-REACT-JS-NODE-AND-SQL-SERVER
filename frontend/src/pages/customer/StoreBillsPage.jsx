import React,{useEffect} from 'react'
import AdminLayout from '../../componenets/AdminLayout'
import CustomerLayout from '../../componenets/CustomerLayout'
import StoreBills from '../../componenets/StoreBills'
import { useSelector,useDispatch } from 'react-redux'
import { fetchUser } from '../../redux/userSlice/userSlice'
const SubscribersPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const loading = useSelector((state) => state.user.loading);
    useEffect(() => {
        dispatch(fetchUser());
        console.log(user)
      }, [dispatch]);    
    
  return (
    <>
      <CustomerLayout username={loading?"":user?.username}>
        <StoreBills></StoreBills>
      </CustomerLayout>
    </>
  )
}

export default SubscribersPage
