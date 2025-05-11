import React,{useEffect} from 'react'
import AdminLayout from '../../componenets/AdminLayout'
import Feedback from '../../componenets/Feedback'
import { useSelector,useDispatch } from 'react-redux'
import { fetchUser } from '../../redux/userSlice/userSlice'
const FeedbackPage = () => {
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
        <Feedback></Feedback>
      </AdminLayout>
    </>
  )
}

export default FeedbackPage
