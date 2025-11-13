const nodemailer = require('nodemailer');

// Create transporter with port 587 (more reliable than 465)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email server ready to send messages');
    }
});

// Send order confirmation email
exports.sendOrderConfirmation = async (order, userEmail, userName) => {
    try {
        const itemsList = order.items.map(item => 
            `<tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
            </tr>`
        ).join('');

        const mailOptions = {
            from: `"Amma's Healing" <${process.env.EMAIL_FROM}>`,
            to: userEmail,
            subject: `Order Confirmation - ${order.orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #c62828; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                        <h1 style="margin: 0;">Order Confirmed!</h1>
                    </div>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 5px 5px;">
                        <p>Dear ${userName},</p>
                        <p>Thank you for your order! We're excited to let you know that your order has been successfully placed.</p>
                        
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h2 style="margin-top: 0; color: #333;">Order Details</h2>
                            <p><strong>Order ID:</strong> ${order.orderId}</p>
                            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Status:</strong> <span style="background-color: #FFA500; color: white; padding: 3px 10px; border-radius: 3px;">${order.status}</span></p>
                        </div>

                        <h3 style="color: #333;">Items Ordered</h3>
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                            <thead>
                                <tr style="background-color: #f5f5f5;">
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsList}
                            </tbody>
                            <tfoot>
                                <tr style="background-color: #f5f5f5; font-weight: bold;">
                                    <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #ddd;">Total Amount:</td>
                                    <td style="padding: 15px; text-align: right; border-top: 2px solid #ddd; color: #4CAF50; font-size: 18px;">₹${order.totalAmount}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <h3 style="color: #333;">Shipping Address</h3>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                            <p style="margin: 5px 0;">${order.shippingAddress.name}</p>
                            <p style="margin: 5px 0;">${order.shippingAddress.phone}</p>
                            <p style="margin: 5px 0;">${order.shippingAddress.street}</p>
                            <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
                        </div>

                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
                            <p>You can track your order status by logging into your account.</p>
                            <p style="font-size: 12px; color: #999;">If you have any questions, please contact our support team.</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                        <p>Thank you for choosing Amma's Healing! 💊</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Order confirmation email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error);
        return false;
    }
};

// Send order status update email
exports.sendOrderStatusUpdate = async (order, userEmail, userName) => {
    try {
        const statusColors = {
            pending: '#FFA500',
            processing: '#2196F3',
            shipped: '#9C27B0',
            delivered: '#4CAF50',
            cancelled: '#F44336'
        };

        const statusEmojis = {
            pending: '⏳',
            processing: '📦',
            shipped: '🚚',
            delivered: '✅',
            cancelled: '❌'
        };

        const statusMessages = {
            pending: 'Your order is pending confirmation.',
            processing: 'We are processing your order.',
            shipped: 'Your order has been shipped and is on its way!',
            delivered: 'Your order has been delivered. Enjoy your purchase!',
            cancelled: 'Your order has been cancelled.'
        };

        const mailOptions = {
            from: `"Amma's Healing" <${process.env.EMAIL_FROM}>`,
            to: userEmail,
            subject: `Order Status Update - ${order.orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: ${statusColors[order.status]}; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                        <h1 style="margin: 0;">${statusEmojis[order.status]} Order Status Updated</h1>
                    </div>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 5px 5px;">
                        <p>Dear ${userName},</p>
                        <p>Your order status has been updated.</p>
                        
                        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
                            <h2 style="margin-top: 0; color: #333;">Order ID: ${order.orderId}</h2>
                            <div style="margin: 20px 0;">
                                <span style="background-color: ${statusColors[order.status]}; color: white; padding: 10px 20px; border-radius: 20px; font-size: 16px; font-weight: bold; text-transform: uppercase;">
                                    ${order.status}
                                </span>
                            </div>
                            <p style="font-size: 16px; color: #666; margin-top: 15px;">${statusMessages[order.status]}</p>
                        </div>

                        <h3 style="color: #333;">Order Summary</h3>
                        <table style="width: 100%; margin: 20px 0;">
                            <tr>
                                <td style="padding: 10px 0; color: #666;">Total Items:</td>
                                <td style="padding: 10px 0; text-align: right; font-weight: bold;">${order.items.length}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #666;">Total Amount:</td>
                                <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px; color: #4CAF50;">₹${order.totalAmount}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #666;">Payment Status:</td>
                                <td style="padding: 10px 0; text-align: right; font-weight: bold;">${order.paymentStatus}</td>
                            </tr>
                        </table>

                        ${order.status === 'shipped' ? `
                            <div style="background-color: #E3F2FD; padding: 15px; border-radius: 5px; border-left: 4px solid #2196F3; margin: 20px 0;">
                                <p style="margin: 0; color: #1976D2;">
                                    <strong>📍 Tracking Information:</strong><br>
                                    Your package is on its way! Expected delivery within 3-5 business days.
                                </p>
                            </div>
                        ` : ''}

                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
                            <p>You can view your complete order details by logging into your account.</p>
                            <p style="font-size: 12px; color: #999;">If you have any questions, please contact our support team.</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                        <p>Thank you for choosing Amma's Healing!</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Order status update email sent to ${userEmail} (Status: ${order.status})`);
        return true;
    } catch (error) {
        console.error('❌ Error sending order status email:', error);
        return false;
    }
};
