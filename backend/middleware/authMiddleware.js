const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = {
            id: verified.id,
            role: verified.role, // Include role in the request object
        };
        next(); // Move to the next middleware/route handler
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateToken;
