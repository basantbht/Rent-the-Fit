const orderModel = require("../Models/orderModel.js");
const userModel = require("../Models/User.model.js");
const purchasedItem = require('../Models/purchasedItem.model.js');
const productModel = require('../Models/Product.model.js')

// Order using cash on delivery
const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.user._id;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            startdate: address.startdate,
            enddate: address.enddate,
            date: Date.now(),
            status: "Pending"
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        return res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};
const productReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        // console.log(req.body)
        const product = await productModel.findById(productId);

        if (!product) {
            return res
                .status(404)
                .json({ error: true, message: "Product not found" });
        }

        const hasPurchased = await orderModel.findOne({
            userId: req.user._id,
            items: productId,

        });

        if (!hasPurchased) {
            return res.status(403).json({
                error: true,
                message: "You can only review products you have purchased",
            });
        }

        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );


        if (alreadyReviewed) {
            return res
                .status(500)
                .json({ error: true, message: "Product Already reviewed" });
        }
        const review = {
            name: req.user.username,
            rating,
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        await product.save();
        return res.status(200).json({ error: false, message: review });


    } catch (error) {
        console.error("Error in productReview", error);
        return res
            .status(500)
            .json({ error: true, message: "Something went wrong." });
    }
};

// Order using Khalti (Implementation needed)
const placeOrderKhalti = async (req, res) => {
    try {
        // Implement Khalti payment logic here
        res.json({ success: true, message: "Khalti Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Fetch all orders for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ error: false, orders });
    } catch (error) {
        console.log(error);
        res.json({ error: true, message: error.message });
    }
};

// Fetch orders for a specific user
const userOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await orderModel.find({ userId });

        // Ensure each item has status, payment, and paymentMethod
        const formattedOrders = orders.map(order => ({
            ...order._doc,
            items: order.items.map(item => ({
                ...item,
                status: order.status,
                payment: order.payment,
                paymentMethod: order.paymentMethod,
                date: order.date
            }))
        }));

        res.json({ success: true, orders: formattedOrders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Fetch Khalti purchased items for a user
const khaltiOrders = async (req, res) => {
    try {
        const purchaseItems = await purchasedItem.find({
            user: req.user._id,
            status: "completed"
        });
        console.log(purchaseItems)
        return res.json({
            error: false,
            message: "All items",
            orders: purchaseItems // Changed from 'items' to 'orders' for consistency
        });

    } catch (error) {
        console.log(error);
        res.json({ error: true, message: "Error fetching orders" });
    }
};
const khaltiOrder = async (req, res) => {
    try {
        const purchaseItems = await purchasedItem.find({status: "completed"});
        console.log(purchaseItems)
        return res.json({
            error: false,
            message: "All items",
            orders: purchaseItems // Changed from 'items' to 'orders' for consistency
        });

    } catch (error) {
        console.log(error);
        res.json({ error: true, message: "Error fetching orders" });
    }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });

        res.json({ error: false, message: "Status Updated" });

    } catch (error) {
        console.log(error);
        res.json({ error: true, message: error.message });
    }
};

module.exports = {
    placeOrder,
    placeOrderKhalti,
    allOrders,
    userOrders,
    updateStatus,
    khaltiOrders,
    productReview,
    khaltiOrder
};
