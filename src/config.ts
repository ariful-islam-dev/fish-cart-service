import dotenv from 'dotenv';
import { Request } from 'express';
dotenv.config({ path: '/.env' });


export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;

export const CART_TTL = process.env.CART_TTL ? parseInt(process.env.CART_TTL) : 3600;

export const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:4002'