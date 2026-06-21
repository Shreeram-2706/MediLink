import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    const { dtoken } = req.headers;
    
    if (!dtoken) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not Authorized. Login Again' 
        });
    }
    
    try {
        const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.body.docId = decoded.id;
        req.user = {
            id: decoded.id,
            role: 'doctor'
        };
        
        next();
    } catch (error) {
        console.log('Auth Middleware Error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token. Please login again.' 
        });
    }
};

export default authDoctor;