import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

    const { getTotalCartAmount, token, userName, userEmail } = useContext(StoreContext)

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/cart")
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])



    return (
        <div>
            <form onSubmit={() => navigate('/payment')} className='place-order'>
                <div className="place-order-left">
                    <p className="title">Thông tin giao hàng</p>
                    <input required name='name' value={userName} type="text" placeholder='Họ tên' />
                    <input required name='email' value={userEmail} type="email" placeholder='Email' />
                    <input required name='street' type="text" placeholder='Địa chỉ' />
                    <input required name='phone' type="text" placeholder='Số điện thoại' />
                </div>
                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Tổng tiền</h2>
                        <div>
                            <div className="cart-total-detail">
                                <p>Hóa đơn</p>
                                <p>{getTotalCartAmount()}đ</p>
                            </div>
                            <hr />
                            <div className="cart-total-detail">
                                <p>Phí giao hàng</p>
                                <p>{getTotalCartAmount() === 0 ? 0 : 20000}đ</p>
                            </div>
                            <hr />
                            <div className="cart-total-detail">
                                <b>Tổng</b>
                                <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20000}đ</b>
                            </div>
                        </div>
                        <button type='submit'>Thanh toán</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default PlaceOrder
