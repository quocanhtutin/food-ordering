import orderModel from "../models/oderModel.js";
import userModel from "../models/userModel.js";
import stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)



//placing user order for frontend
const placeOrder = async (req, res) => {

    const frontend_url = `http://localhost:5174`;

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "vnd",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "vnd",
                product_data: {
                    name: "Delivery charges"
                },
                unit_amount: 20000
            },
            quantity: 1
        })

        res.json({ success: true })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "not paid" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//user orders fo frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}); //get all orders data
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.json({ success: true, message: "Status updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}

// reset data order
const resetDataOrders = async (req, res) => {
    try {
        await orderModel.deleteMany()
        res.json({ success: true })
    } catch (error) {
        console.log(error);
        res.json({ success: false })
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, resetDataOrders }