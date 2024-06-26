import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import axios from './configuration/axiosConfig'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

import NavigationBar from './components/user_components/navigationBar/NavigationBar.jsx'
import ProfileInfo from './components/user_components/userProfileComponents/profileInfo/ProfileInfo.jsx'
import Wallet from './components/user_components/userProfileComponents/wallet/Wallet'
import Addresses from './components/user_components//userProfileComponents/addresses/Addresses'
import OrderHistory from './components/user_components/userProfileComponents/orderHistory/OrderHistory'
import Favorite from './components/user_components/userProfileComponents/favorite/Favorite'
import DeliveryPage from './components/user_components/deliveryPage/DeliveryPage.jsx'
import Footer from './components/user_components/footer/Footer'

import AdminNavigationBar from './components/admin_components/adminNavigationBar/AdminNavigationBar'

import LoginSignUp from './pages/LoginSignUp.jsx'

import Home from './pages/pages_user/Home.jsx'
import AboutUs from './pages/pages_user/AboutUs.jsx'
import Product from './pages/pages_user/Product.jsx'
import Contact from './pages/pages_user/Contact.jsx'
import Cart from './pages/pages_user/Cart.jsx'
import User from './pages/pages_user/User.jsx'
import Products from './pages/pages_user/Products'
import SummaryPage from './pages/pages_user/SummaryPage'

import AdminProducts from './pages/pages_admin/AdminProducts'
import AdminUsers from './pages/pages_admin/AdminUsers'
import AdminOrders from './pages/pages_admin/AdminOrders'
import AdminProductAdd from './pages/pages_admin/AdminProductAdd'
import AdminProductEdit from './pages/pages_admin/AdminProductEdit'
import AdminUserOrders from './pages/pages_admin/AdminUserOrders'

function App() {
	const [menu, setMenu] = useState('home')
	const { user } = useAuth()
	console.log(user)

	return (
		<div className='main'>
			<BrowserRouter>
				<ToastContainer
					position='top-right'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<div className='content'>
					{user && user.role === 'ADMIN' ? (
						<AdminNavigationBar menu={menu} setMenu={setMenu} />
					) : (
						<NavigationBar menu={menu} setMenu={setMenu} />
					)}

					<Routes>
						{user && user.role === 'ADMIN' ? (
							<>
								<Route path='/admin/products' element={<AdminProducts />} />
								<Route path='/admin/product/:productId' element={<AdminProductEdit />} />
								<Route path='/admin/add-product' element={<AdminProductAdd />} />
								<Route path='/admin/users' element={<AdminUsers />} />
								<Route path='/admin/users/:userId/orders' element={<AdminUserOrders />} />
								<Route path='/admin/orders' element={<AdminOrders />} />
							</>
						) : (
							<>
								<Route path='/' element={<Home setMenu={setMenu} />} />
								<Route path='/aboutus' element={<AboutUs />} />
								<Route path='/products' element={<Products />} />
								<Route path='/contacts' element={<Contact />} />
								<Route path='/product/:productId' element={<Product />} />
								<Route path='/cart' element={<Cart />} />
								<Route path='/delivery' element={<DeliveryPage />} />
								<Route path='/summary' element={<SummaryPage />} />
								<Route path='/user' element={<User />}>
									<Route path='profile' element={<ProfileInfo />} />
									<Route path='wallet' element={<Wallet />} />
									<Route path='addresses' element={<Addresses />} />
									<Route path='order-history' element={<OrderHistory />} />
									<Route path='favorite' element={<Favorite />} />
								</Route>
							</>
						)}
						<Route path='/login' element={<LoginSignUp />} />
					</Routes>
				</div>
				<Footer className='footer' />
			</BrowserRouter>
		</div>
	)
}

export default App
