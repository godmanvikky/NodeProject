const request = require("supertest");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

const app = require("../app");
const expect = chai.expect;

chai.use(chaiAsPromised);
/** Pet Unit Tests */
describe("Test Case - Pets", function () {
  it("Fetching no record when db is empty", async function () {
    const res = await request(app).get("/pets");
    expect(res.body.length).to.equal(0);
    expect(res.status).to.equal(200);
  });
  it("Not Creating a Pet object with any empty field", async function () {
    const res = await request(app).post("/pets").send({});
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" is required');
  });
  it("Not creating a pet Object with age as string", async function () {
    const res = await request(app).post("/pets").send({
      name: "Coco",
      age: '"15"',
      color: "Pink",
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"age" must be a number');
  });
  it("Not creating a pet Object with name as number", async function () {
    const res = await request(app).post("/pets").send({
      name: 23,
      age: 15,
      color: "Pink",
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" must be a string');
  });
  it("Not Creating a Pet object with age field missing", async function () {
    const res = await request(app).post("/pets").send({
      name: "Coco",
      color: "Black",
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"age" is required');
  });
  it("Not Creating a Pet object with name field missing", async function () {
    const res = await request(app).post("/pets").send({
      age: 17,
      color: "Blue",
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" is required');
  });
  it("Not Creating a Pet object with name field empty", async function () {
    const res = await request(app).post("/pets").send({
      name: "",
      age: 15,
      color: "Blue",
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" is not allowed to be empty');
  });
  it("Creating the Pet Object as the data entered are correct", async function () {
    const user = {
      name: "Husky",
      age: 11,
      color: "White",
    };
    const res = await request(app).post("/pets").send(user);
    expect(res.status).to.equal(201);
    expect(res.body.name).to.equal(user.name);
    expect(res.body.age).to.equal(user.age);
    expect(res.body.color).to.equal(user.color);
  });
  /**Fetching All Pets records */
  it("Fetching All Pet records", async function () {
    const res = await request(app).get("/pets");
    expect(res.status).to.equal(200);
    expect(res.body.length).to.greaterThan(0);
  });
  it("As the name field is empty not fetching the pet record", async function () {
    const name = " ";
    const res = await request(app).get(`/pets/get/${name}`);
    expect(res.status).to.equal(404);
  });
  it("Fetching pet by name", async function () {
    const name = "Husky";
    const res = await request(app).get(`/pets/get/${name}`);
    expect(res.status).to.equal(200);
  });
  it("Not able to delete the pet as the requested name is empty", async function () {
    const name = " ";
    const res = await request(app).delete(`/pets/${name}`);
    expect(res.status).to.equal(404);
  });
  it("Removing the pet from the Pet Object", async function () {
    const id = 1;
    const res = await request(app).delete(`/pets/${id}`);
    expect(res.status).to.equal(200);
  });
});
