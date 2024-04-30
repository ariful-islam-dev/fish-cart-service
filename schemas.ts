
import { z } from "zod";

export const addToCartDTOSchema = z.object({
  productId: z.string(),
  quantity: z.number().int(),
  inventoryId: z.string()
})