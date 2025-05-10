import React,{useEffect} from 'react'
import CustomerPanel from '../../componenets/CustomerPanel'
import CustomerLayout from '../../componenets/CustomerLayout'
import { useSelector,useDispatch } from 'react-redux'
import { fetchUser } from '../../redux/userSlice/userSlice'
const Dashboard = () => {
  const dispatch = useDispatch();
      const user = useSelector((state) => state.user.value);
      const loading = useSelector((state) => state.user.loading);
      useEffect(() => {
          dispatch(fetchUser());
          console.log(user)
        }, [dispatch]);  
  return (
    <>
     < CustomerLayout username={loading?"":user?.username} >
     <CustomerPanel></CustomerPanel>
     </CustomerLayout>
    </>
  )
}

export default Dashboard
