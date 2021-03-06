import React, {useContext, useEffect, useState} from 'react'

import Loading from '../utils/loading/Loading'
import axios from 'axios'
import Filters from './Filters'
import './products.css';
import {Link} from "react-router-dom";

function Products() {


    // const [token] = state.token

    const [loading, setLoading] = useState(false)
    // const [search, setSearch] = state.productsAPI.search
    // const [products, setProducts] = state.productsAPI.products
    // const [callback, setCallback] = state.productsAPI.callback

    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [callback, setCallback] = useState(false)
    const [search, setSearch] = useState('')


    useEffect(() =>{
        const getProducts = async () => {
            const res = await axios.get(`/product/getProducts?limit=${page*18}&title[regex]=${search}`)
            setProducts(res.data.products)

        }
        getProducts()
    },[callback, search, page])

    const deleteProduct = async(id, public_id) => {
        try {
            if(window.confirm("Do you want to delete this product?")){
                setLoading(true)
                const destroyImg = axios.post('/image/delete', {public_id},{
                    // headers: {Authorization: token}
                })
                const deleteProduct = axios.delete(`/product/deleteProducts/${id}`, {
                    // headers: {Authorization: token}
                })
                await destroyImg
                await deleteProduct
                setCallback(!callback)
                setLoading(false)
            }
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    if(loading) return <div><Loading /></div>
    return (
        <>
            <div className="filter_menu">
                <input type="text" value={search} placeholder="Enter your search!"
                       onChange={e => setSearch(e.target.value.toLowerCase())} />
            </div>
            <div className="products">
                {
                    products.map(product => (
                        <div className="product_card" key={product._id}>
                            <img src={product.images.url} alt="" />
                            <div className="product_box">
                                <h2 title={product.title}>{product.title}</h2>
                                <span>${product.price}</span>
                            </div>
                            <div className="row_btn">
                                <Link id="btn_buy" to="#!"
                                      onClick={() =>deleteProduct(product._id, product.images.public_id)}>
                                    Delete
                                </Link>
                                <Link id="btn_view" to={`/edit_product/${product._id}`}>
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
export default Products
