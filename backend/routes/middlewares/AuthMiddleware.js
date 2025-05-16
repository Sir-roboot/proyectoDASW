const jwt = require('jsonwebtoken');

class AuthMiddleware {
    static verifyToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token inválido o expirado' });
            }

            req.userId = decoded.id;
            req.userRole = decoded.role;
            next();
        });
    }

    static isAdmin(req, res, next) {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Acceso restringido a administradores' });
        }
        next();
    }

    static isCustomer(req, res, next) {
        if (req.userRole !== 'customer') {
            return res.status(403).json({ message: 'Acceso restringido a clientes' });
        }
        next();
    }
}

module.exports = AuthMiddleware;
