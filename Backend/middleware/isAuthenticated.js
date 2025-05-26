import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization token missing or malformed",
                success: false,
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({
            message: "Authentication failed",
            success: false,
        });
    }
};

export default isAuthenticated;
