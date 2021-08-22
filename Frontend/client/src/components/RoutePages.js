import React, {useContext} from 'react'
import {Switch, Route} from 'react-router-dom'
import Products from './products/Products'
import Login from './Registration/Login'
import Register from './Registration/Register'
import OrderHistory from './orders/OrderHistory'
import OrderDetails from './orders/OrderDetails'
import Cart from './cart/Cart'
import NotFound from './utils/not_found/NotFound'
import CreateProduct from './AddProduct/CreateProduct'
import payment from './payment/payment'
import {GlobalState} from '../GlobalState'
import UserProducts from './products/userProducts'
import Reservation from './Registration/Reservation'
import ProductsBfrLogin from './products/ProductsBefLogin'
import Categories from "./categories/Categories";
import DetailProduct from "./detailProduct/DetailProduct";
import CreatePackage from "./AddPackage/CreatePackage";
import AdminViewPackages from "./packages/adminViewPackages";








function Pages() {




    return (
        <Switch>




            //packages
            <Route path="/adminPackages" exact component={AdminViewPackages} />
            <Route path="/create_package" exact component={CreatePackage} />


            //user products
            <Route path="/reserve/:id"  component={DetailProduct} />
            <Route path="/userProducts" exact component={UserProducts} />
            <Route path="/reservation" exact component={Reservation} />


            //admin products
            <Route path="/adminProducts" exact component={Products} />
            <Route path="/" exact component={ProductsBfrLogin} />
            <Route path="/create_category" exact component={Categories} />
            <Route path="/create_product" exact component={CreateProduct} />
            <Route path="/edit_product/:id" exact component={CreateProduct } />
            <Route path="/orderHistory" exact component={OrderHistory } />



            {/*<Route path="/payment" exact component={isLogged ? payment : NotFound} />*/}
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="*" exact component={NotFound} />
        </Switch>
    )
}

export default Pages