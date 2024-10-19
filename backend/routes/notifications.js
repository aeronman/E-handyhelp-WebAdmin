const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); // Adjust the path to your Handyman model


router.post('/', async (req, res) => {
    try {
        const { handymanId, userId, notification_content, notif_for } = req.body;

        const notification = new Notification({
            handymanId,
            userId,
            notification_content,
            notif_for,
            date_sent: new Date(),
        });

        await notification.save();
        res.status(201).json({ message: 'Notification sent successfully', notification });
    } catch (error) {
        res.status(500).json({ message: 'Error sending notification', error });
    }
});

module.exports = router;
