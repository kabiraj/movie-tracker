import jwt from 'jsonwebtoken';

// runs before the actual route. if there is no valid token, we send 401 and stop. if valid, we put userId on the request and continue.
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    // frontend sends "Bearer <token>", so we take the second part
    const token = authHeader.split(' ')[1];

    if(!token){
        res.status(401).json({ error: 'Token is required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
}

export default authenticateToken;
