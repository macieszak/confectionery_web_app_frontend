import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../../configuration/axiosConfig'
import { FaHeart } from 'react-icons/fa'
import { AuthContext } from '../../context/AuthContext'
import '../CSS/Product.css'
import { toast } from 'react-toastify'

const Product = ({ fetchCartItemCount }) => {
	const { productId } = useParams()
	const { user } = useContext(AuthContext)
	const [product, setProduct] = useState({
		id: '',
		name: '',
		category: '',
		price: '',
		description: '',
		imageUrl: '',
	})
	const [imageSrc, setImageSrc] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [quantity, setQuantity] = useState(1)

	useEffect(() => {
		setIsLoading(true)
		const fetchProduct = async () => {
			try {
				const { data } = await axios.get(`/products/${productId}`)
				setProduct({
					id: data.id,
					name: data.name,
					category: data.category,
					price: data.price,
					description: data.description,
					imageUrl: data.image.name,
				})
				fetchImage(data.image.name)
			} catch (error) {
				console.error('Error fetching product details:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchProduct()
	}, [productId])

	const fetchImage = async imageName => {
		try {
			const response = await axios.get(`/products/img/${imageName}`, { responseType: 'blob' })
			const imageBlob = response.data
			const reader = new FileReader()
			reader.readAsDataURL(imageBlob)
			reader.onloadend = () => {
				setImageSrc(reader.result)
			}
		} catch (error) {
			console.error('Failed to load image:', error)
			setImageSrc('')
		}
	}

	const addToFavorites = async () => {
		if (!user) {
			alert('Please log in to add favorites')
			return
		}

		const payload = new URLSearchParams()
		payload.append('favoriteProductId', product.id)

		try {
			const response = await axios.post(`/users/${user.id}/favorites`, payload, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
			if (response.status === 200) {
				toast.success('Product added to favorites successfully!')
			} else {
				alert('Failed to add to favorites: ' + response.statusText)
			}
		} catch (error) {
			console.error('Error adding to favorites:', error)
			alert('Failed to add to favorites. See console for details.')
		}
	}

	const addToCart = async () => {
		if (!user) {
			alert('Please log in to add products to the cart')
			return
		}

		try {
			const response = await axios.post(`users/${user.id}/products/${product.id}/${quantity}`)
			if (response.status === 200) {
				toast.success('Product added to cart successfully!')
				window.dispatchEvent(new CustomEvent('updateCartCount'))
			} else {
				alert('Failed to add product to cart: ' + response.statusText)
			}
		} catch (error) {
			console.error('Error adding product to cart:', error)
			alert('Failed to add product to cart. See console for details.')
		}
	}

	if (!product) {
		return <div>Ładowanie...</div>
	}

	const handleQuantityChange = delta => {
		setQuantity(prev => Math.max(1, prev + delta))
	}

	return (
		<div className='product-container'>
			<div className='product-image-section'>
				<img src={imageSrc} alt={product.name} className='product-image' />
			</div>
			<div className='product-details-section'>
				<h2 className='product-title'>{product.name}</h2>
				<p className='product-category'>{product.category}</p>
				<p className='product-price'>{product.price} zł</p>
				<div className='product-quantity'>
					<button onClick={() => handleQuantityChange(-1)}>-</button>
					<span className='quantity-value'>{quantity}</span>
					<button onClick={() => handleQuantityChange(1)}>+</button>
				</div>
				<div className='product-actions'>
					<button className='add-to-cart-btn' onClick={addToCart}>
						Add to cart
					</button>
					<button className='add-to-favorites-btn' onClick={addToFavorites}>
						<FaHeart />
					</button>
				</div>
				<div className='product-description'>
					<p>Description</p>
					<div className='product-description-text'>
						<p>{product.description}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Product
