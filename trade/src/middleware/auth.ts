import { NextFunction, Response } from 'express';
import CustomErrorHandler from '../services/customErrorHandler';
import JWTService from '../services/jwtService';

interface JwtPayload {
    id: string;
    role: string;
    sessionId: string;
}

const auth = async (req: any, res: Response, next: NextFunction) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(' ')[1];
    console.log(token)
    try {
        const { id, role, sessionId } = (JWTService.verify(token)) as JwtPayload;
        console.log(role, "Role____")
        console.log(id, "Id______")
        console.log(sessionId, "sessionID------")
        if (!id || !role) {
            return next(CustomErrorHandler.unAuthorized('Invalid token'));
        }
        const user = {
            id,
            role,
            sessionId
        };
        req.user = user;
        console.log(user)
        next();
    } catch (err) {
        return next(CustomErrorHandler.unAuthorized());
    }
};

export default auth;