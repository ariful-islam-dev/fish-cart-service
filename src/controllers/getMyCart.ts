import redis from '../redis';
import { Request, Response, NextFunction } from 'express';
const getMyCart = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const cartSessionId = (req.headers['x-cart-session-id'] as string) || null;

        if(!cartSessionId){
            return res.status(400).json({
                code: 400,
                message: "Cart session id not found"
            })
        }

        // if cart session id exist on the store
        const session = await redis.exists(`session:${cartSessionId}`);
        if(!session){
            await redis.del(`cart:${cartSessionId}`);
            return res.status(200).json({
                code: 200,
                data: [],
                message: "Item not exist"
            })
        }

        const items = await redis.hgetall(`cart:${cartSessionId}`);

        if(Object.keys(items).length === 0){
            return res.status(200).json({
                code: 200,
                data: [],
                message: "Item not exist"
            })
        }


        // format the Items
        const formetedItem = Object.keys(items).map(key=>{
            const {quantity, inventoryId}= JSON.parse(items[key]) as { quantity:number, inventoryId:string}
            return {
                inventoryId,
                quantity,
                productId: key
            }
            })


        return res.status(200).json({
            code: 200,
            message: "Get My Cart",
            data: formetedItem
        })
    }catch(err){
        next(err)
    }
}

export default getMyCart;