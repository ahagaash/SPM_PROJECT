import React, {useContext, useEffect, useState} from 'react'
//import {Modal,Button} from 'react-bootstrap'
import Loading from '../utils/loading/Loading'
import axios from 'axios'
import Filters from './Filters'
import './package.css';
import {Link} from "react-router-dom";


function UserViewPackages () {


    // const [token] = state.token

    const [loading, setLoading] = useState(false)
    // const [search, setSearch] = state.productsAPI.search
    // const [products, setProducts] = state.productsAPI.products
    // const [callback, setCallback] = state.productsAPI.callback

    ///new item///
    //const [visible, setVisible] = useState(false);



    ///

    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [callback, setCallback] = useState(false)
    const [search, setSearch] = useState('')
//
    
    //

    useEffect(() =>{
        const getProducts = async () => {
            const res = await axios.get(`/package/getPackage?limit=${page*18}&PackageName[regex]=${search}`)
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
            {/*<div className="products">*/}
            {
                products.map(product => (


                    <div className="detail">
                        <img src={product.images.url} alt="" />
                        <div className="box-detail">
                            <div className="row">
                                <h2>{product.PackageName}</h2>

                            </div>

                            <p>{product.description}</p>
                            <span style={{color:"red"}}>$ {product.price} Per KM</span>



                            <div className="row_btn">
                                <Link id="btn_view" to={`/package_reservation/${product._id}`} style={{width:300}}>
                                    Reserve
                                </Link>

                            </div>
                        </div>
                    </div>

                ))



                ///////////////////


            }
            {/*</div>*/}

        </>
    )
}
export default UserViewPackages
