const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization; // Get the token from the Authorization header

    // Check if token is provided
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: 'Invalid token' });
    }
}

const requireAdmin = (req, res, next) => { 
    if (req.user && req.user.role === 'admin') {
        next(); //User is admin, proceed to next middleware or route handler
    } else {
        res.status(403).json({ error: 'Admin access required' }); //User is not admin, return forbidden error
    }
}

module.exports = {authMiddleware, requireAdmin};