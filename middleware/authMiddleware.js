// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) return res.status(401).json({
            error: 'Access denied'
        });
        const decoded = jwt.verify(token, process.env.JWT_SECRET_OR_KEY);
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: 'Invalid token'
        });
    }
};

module.exports = verifyToken;