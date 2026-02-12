//backend/controllers/CustomerDetails_contro/CustomerProfileDetails_contro/CustomerProfileDetails_contro.js
const UserRegister = require("../../../models/UserRegister.js");

const getCustomerProfile = async (req, res) => {
    try {
        const user = await UserRegister.findById(req.userId).select('fullName phone email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

module.exports = { getCustomerProfile };

