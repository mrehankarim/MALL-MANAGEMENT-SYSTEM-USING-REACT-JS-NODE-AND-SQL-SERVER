import React,{useEffect} from 'react'
import SubAdminLayout from '../../componenets/SubAdminLayout'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUser } from '../../redux/userSlice/userSlice'
import MonthlyRentList from '../../componenets/MonthlyRentList'
const MonthlyRentsPage = () => {
    const user = useSelector((state) => state.user.value);
        const loading = useSelector((state) => state.user.loading);
        const dispatch = useDispatch()
        useEffect(() => {
            dispatch(fetchUser())
        }, [dispatch])
  return (
    <>
       <SubAdminLayout username={loading?"":user?.username}><MonthlyRentList/></SubAdminLayout>
    </>
  )
}

export default MonthlyRentsPage
