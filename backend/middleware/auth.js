import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 * 
 * How it works:
 * 1. Checks for Authorization header in request
 * 2. Extracts token from "Bearer <token>" format
 * 3. Verifies token using JWT_SECRET from environment
 * 4. If valid, attaches userId to request object and calls next()
 * 5. If invalid/missing, returns 401 Unauthorized
 * 
 * Usage: Add to routes that require authentication
 * Example: router.get("/movies", authenticateToken, async (req, res) => {...})
 */
const authenticateToken = (req, res, next) => {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;

    if (!authHeader){
        res.status(401).json({ error: 'Unauthorized' });
        return;
    } else {
        // Extract token from "Bearer <token>" format
        // split(' ') splits "Bearer token123" into ["Bearer", "token123"]
        // [1] gets the actual token
        const token = authHeader.split(' ')[1];

        if(!token){
            res.status(401).json({ error: 'Token is required' });
            return;
        } else {
            try {
                // Verify token and decode payload
                // JWT_SECRET must match the secret used when token was created
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Attach userId to request object for use in route handlers
                // This way routes can access req.userId without re-decoding token
                req.userId = decoded.userId;
                
                // Call next() to proceed to the actual route handler
                next();
            } catch (error) {
                // Token invalid, expired, or malformed — don't leak details to client
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
        }

    }
}

export default authenticateToken;