import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        res.status(401).json({ error: 'Unauthorized' });
        return;
    } else {
        const token = authHeader.split(' ')[1];

        if(!token){
            res.status(401).json({ error: 'Token is required' });
            return;
        } else {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.userId = decoded.userId;
                next();
            } catch (error) {
                res.status(401).json({ error: error.message });
                return;
            }
        }

    }
}

export default authenticateToken;