import React from 'react'
import './Payment.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
// import './Payment.scss'

const Payment = () => {

    var interval = null

    const [place, setPlace] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()

    const name = searchParams.get("name")
    const email = searchParams.get("email")
    const street = searchParams.get("street")
    const phone = searchParams.get("phone")

    const data = {
        "name": name,
        "email": email,
        "street": street,
        "phone": phone
    }

    const today = new Date();
    const des = phone + `${today.getDate()}${today.getMonth()}${today.getFullYear()}`;

    const { getTotalCartAmount, food_list, cartItems, url, token, setCartItems } = useContext(StoreContext)
    const Bank = {
        BankID: "BIDV",
        Account: "V3CASS2143274158",
        Name: "Nguyen%20Quoc%20Anh"
    }
    const [QR, setQR] = useState("")

    const API_KEY = `AK_CS.3a611df0bea111ef9cf3ed0b3d7702f1.VBHNt55fkciDbKlqKNKE67IhI4e5c7cx0y7bYigNPfxvkcBITqDIbXult9yv3UyxPCH2L7XT`
    const GET_PAID = `https://oauth.casso.vn/v2/transactions`

    const checkPaid = async () => {
        const response = await axios.get(GET_PAID, {
            headers: { Authorization: `Apikey ${API_KEY}` }
        })
        const payments = response.data.data.records
        const latestPayment = payments[payments.length - 1]

        if (latestPayment.amount === getTotalCartAmount() + 20000 && latestPayment.description.includes(des)) {
            clearInterval(interval)
            alert('Thanh toán thành công')
            setPlace(true)
        }
    }

    const getQR = () => {
        if (getTotalCartAmount()) {
            const amount = getTotalCartAmount() + 20000;
            setQR("https://img.vietqr.io/image/" + Bank.BankID + "-" + Bank.Account + "-print.png?amount=" + amount + "&addInfo=" + des + "&accountName=" + Bank.Name)
            interval = setInterval(() => { if (!place) { checkPaid() } }, 2000)
        }
    }

    const navigate = useNavigate();

    const placeOrder = async () => {
        // setPlace(false)
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        })
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 20000,
        }
        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } })
        if (response.data.success) {
            setCartItems({})
            navigate('/myorders')
        }
        else {
            alert("Error")
        }
    }

    useEffect(() => {
        if (getTotalCartAmount() != 0) {
            console.log(getTotalCartAmount());

            getQR()
        }
    }, [getTotalCartAmount()])

    useEffect(() => {
        if (place) {
            placeOrder()
        }
    }, [place])

    return (
        <div>
            <p className='head1'>Quét QR sau để thanh toán chuyển khoản. Bạn nhớ chuyển đúng nội dung và STK nhé!</p>
            <div className='payment'>
                <div className='qrcode'>
                    <img src={QR} alt="" />
                </div>
                <div className='infor'>
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
                    </div>
                    <div className='del-infor'>
                        <h2>Thông tin giao hàng</h2>
                        <div className="cart-total-detail">
                            <p>Tên người nhận: </p>
                            <p>{name}</p>
                        </div>
                        <div className="cart-total-detail">
                            <p>Email: </p>
                            <p>{email}</p>
                        </div>
                        <div className="cart-total-detail">
                            <p>Địa chỉ: </p>
                            <p>{street}</p>
                        </div>
                        <div className="cart-total-detail">
                            <p>Điện thoại: </p>
                            <p>{phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
