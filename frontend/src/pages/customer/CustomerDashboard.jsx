import React, { useEffect } from 'react';
import CustomerPanel from '../../componenets/CustomerPanel';
import CustomerLayout from '../../componenets/CustomerLayout';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../redux/userSlice/userSlice';
import axios from 'axios';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    dispatch(fetchUser());
    console.log(user);
  }, [dispatch]);

  useEffect(() => {
    const fetchShopNoAndStoreID = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/customer/getshopno-storeid',
          { withCredentials: true }
        );
        const { shop_no, store_id } = response.data?.data || {};
        if (shop_no) {
          localStorage.setItem('shop_no', shop_no); // Save shop_no to local storage
          console.log('Shop No saved to localStorage:', shop_no);
        } else {
          console.error('Shop No not found in response');
        }
        if (store_id) {
          localStorage.setItem('store_id', store_id); // Save store_id to local storage
          console.log('Store ID saved to localStorage:', store_id);
        } else {
          console.error('Store ID not found in response');
        }
        
      } catch (error) {
        console.error('Error fetching shop_no and store_id:', error);
      }
    };

    fetchShopNoAndStoreID();
  }, [user]);

  return (
    <>
      <CustomerLayout username={loading ? '' : user?.username}>
        <CustomerPanel></CustomerPanel>
      </CustomerLayout>
    </>
  );
};

export default Dashboard;