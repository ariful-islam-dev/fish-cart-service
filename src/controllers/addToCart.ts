import { NextFunction, Request, Response } from "express"
import { addToCartDTOSchema } from '../../schemas';
import redis from "../redis";
import { v4 as uuid } from 'uuid';
import { CART_TTL, INVENTORY_URL } from '../config';
import axios from "axios";

const addToCart = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        // validate Request
        const parseBody = await addToCartDTOSchema.safeParseAsync(req.body);
        if(!parseBody.success) {
            return res.status(400).json({
                code: 400,
                message: parseBody.error.errors[0].message
            })
        }

        let cartSessionId = (req.headers['x-cart-session-id'] as string) || null;
        if(cartSessionId){
          const exist = await redis.exists(`session:${cartSessionId}`);

          if(!exist){
            cartSessionId = null
          }
        }

        // if cart session id is not found create one
        if(!cartSessionId){
            cartSessionId = uuid();

            // set cart session id in redis store
            await redis.setex(`session:${cartSessionId}`, `${CART_TTL}`, `${cartSessionId}`);

             // set cart session id in the response  header
             res.setHeader(`x-cart-session-id`, `${cartSessionId}`);

        }

        // check in the inventory is available
        const {data} = await axios.get(`${INVENTORY_URL}/inventories/${parseBody.data.inventoryId}`);

        if(Number(data.quantity) < parseBody.data.quantity){
            return res.status(400).json({
                code: 400,
                message: "Inventory is not available"
            })


        }

        await redis.hset(
            `cart:${cartSessionId}`,
            parseBody.data.productId,
            JSON.stringify({
                inventoryId: parseBody.data.inventoryId,
                quantity: parseBody.data.quantity
            })
        );

        // update the inventory
        await axios.put(`${INVENTORY_URL}/inventories/${parseBody.data.inventoryId}`, {
            quantity: parseBody.data.quantity,
            actionType: "OUT"
        });
        
        return res.status(201).json({
            code: 201,
            message: `Item added to cart`,
            cartSessionId
        })
    } catch (error) {
        next(error)
    }
}

export default addToCart