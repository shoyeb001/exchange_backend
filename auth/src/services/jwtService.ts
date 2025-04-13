import jwt from "jsonwebtoken";
import { config } from "../config";
class JWTService {
    static sign(payload: any, expire = 60 * 60 * 24 * 7, secret = config.JWT_SECRET) {
        return jwt.sign(payload, secret, { expiresIn: expire });
    }
    static verify(token: any, secret = config.JWT_SECRET) {
        return jwt.verify(token, secret);
    }
}
export default JWTService;