/** To Check Unit Test Cases of all API's */

const request = require("supertest");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

const app = require("../app");
const expect = chai.expect;

chai.use(chaiAsPromised);

/** Pet Unit Tests */

describe("Test Case - Pets", function () {
  it("should not fetch record when db is empty", async function () {
    const res = await request(app).get("/pets");
    expect(res.body.length).to.equal(0);
    expect(res.status).to.equal(200);
  });

  it("should not create a pet with no name field parms", async function () {
    const res = await request(app).post("/pets").send({});
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" is required');
  });

  it("should not create a pet with age as string", async function () {
    const res = await request(app).post("/pets").send({
      name: "Coco",
      age: '"15"',
      color: "Pink",
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"age" must be a number');
  });

  it("should not create a pet with name as number", async function () {
    const res = await request(app).post("/pets").send({
      name: 23,
      age: 15,
      color: "Pink",
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" must be a string');
  });

  it("should not create pet with no age field", async function () {
    const res = await request(app).post("/pets").send({
      name: "Coco",
      color: "Black",
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"age" is required');
  });

  it("should not create pet with no name field ", async function () {
    const res = await request(app).post("/pets").send({
      age: 17,
      color: "Blue",
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" is required');
  });

  it("should not create pet with any field as empty", async function () {
    const res = await request(app).post("/pets").send({
      name: "",
      age: 15,
      color: "Blue",
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" is not allowed to be empty');
  });

  it("should create the pet record", async function () {
    const pet = {
      name: "Dan",
      age: 16,
      color: "Brown",
    };
    const res = await request(app).post("/pets").send(pet);
    expect(res.status).to.equal(201);
    expect(res.body.name).to.equal(pet.name);
    expect(res.body.age).to.equal(pet.age);
    expect(res.body.color).to.equal(pet.color);
  });

  /**Fetching All Pets records */
  it("should fetch all the pet records", async function () {
    const pet = {
      name: "Husky",
      age: 11,
      color: "White",
    };
    const petres = await request(app).post("/pets").send(pet);
    const res = await request(app).get("/pets");
    expect(res.status).to.equal(200);
    expect(res.body.length).to.greaterThan(0);
  });

  it("should not fetch pet as the name field is empty", async function () {
    const name = " ";
    const res = await request(app).get(`/pets/get/${name}`);
    expect(res.status).to.equal(404);
  });

  it("should fetch pet by name", async function () {
    const pet = {
      name: "Bro",
      age: 9,
      color: "White",
    };
    const petres = await request(app).post("/pets").send(pet);
    const res = await request(app).get(`/pets/get/${pet.name}`);
    expect(res.status).to.equal(200);
  });

  it("should not delete the pet as the requested name is empty", async function () {
    const name = " ";
    const res = await request(app).delete(`/pets/${name}`);
    expect(res.status).to.equal(404);
  });

  it("should remove the pet by id from the record", async function () {
    const pet = {
      name: "Dusky",
      age: 9,
      color: "Black",
    };
    const petres = await request(app).post("/pets").send(pet);
    const res = await request(app).delete(`/pets/${petres.body._id}`);
    expect(res.status).to.equal(200);
  });
});
