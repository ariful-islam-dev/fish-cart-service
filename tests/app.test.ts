import request from "supertest";
import app from "../src/app";
import { describe, it } from "node:test";


describe("cart", () => {
  it("should be added to cart", async () => {

    // const expect = chai.expect;
    await request(app)
      .post("/cart/add-to-cart")
      .send({
        productId: "clvfii47a0000d7dw59ay1kig",
        inventoryId: "clvfii4cg0004dmlxgkp2n1bz",
        quantity: 2
      })
      .expect(201);
  });


  it("should be get all cart product", async () => {
    await request(app)
      .get("/cart/me")
      .set("x-cart-session-id", "7a9298ac-207e-4216-ab44-14f2edaa31f5")
      .expect(200);
  })
  
  it("should be clear cart", async () => {
    await request(app)
      .get("/cart/clear")
      .set("x-cart-session-id", "87aca0f4-3e9a-4361-b25a-15200af5a067")
      .expect(200);
  })
});

