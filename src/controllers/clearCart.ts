import { NextFunction, Response } from 'express';
import { Request } from 'express';
import redis from '../redis';
const clearCart = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const cartSessionId = await req.headers['x-cart-session-id'] as string || null;

        if(!cartSessionId){
            return res.status(400).json({
                code: 400,
                message: "Cart session id not found"
            })
        }

        // if cart session id exist on the store
        const exists = await redis.exists(`session:${cartSessionId}`);
        if(!exists){
            
            delete req.headers['x-cart-session-id'];
            return res.status(200).json({
                code: 200,
                message: "Cart is empty"
            })
        }
        await redis.del(`cart:${cartSessionId}`);
        await redis.del(`session:${cartSessionId}`);

        delete req.headers['x-cart-session-id'];
            return res.status(200).json({
                code: 200,
                message: "Cart cleared"
            })

    } catch (error) {
        next(error)
    }
};

export default clearCart