/** APIs */
const express = require("express");
/*Data Validation*/
const Joi = require("@hapi/joi");

const PetModel = require("../models/pets");
const { validateBody, validateParams } = require("../middlewares/route");

const router = express.Router();

/** Post Api calls to create pet with name,age and color*/
router.post(
  "/",
  validateBody(
    Joi.object().keys({
      name: Joi.string().required().description("Pets Name"),
      age: Joi.number().integer().required().description("Pets Age"),
      color: Joi.string().required().description("Pets Color"),
    }),
    {
      stripUnknown: true,
    }
  ),
  async (req, res, next) => {
    try {
      const Pets = new PetModel(req.body);
      await Pets.save();
      res.status(201).json(Pets);
    } catch (excep) {
      next(excep);
    }
  }
);

/** Get Api call for getting all the Pets */
router.get("/", async (req, res, next) => {
  try {
    const response = await PetModel.find({}, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  } catch (excep) {
    next(excep);
  }
});
/** Get Api call for searching the pet by name*/
router.get(
  "/get/:name",
  validateParams(
    Joi.object().keys({
      name: Joi.string().required(),
    }),
    {
      stripUnknown: true,
    }
  ),
  async (req, res, next) => {
    try {
      const response = await PetModel.find(
        {
          name: req.params.name,
        },
        (err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
    } catch (excep) {
      next(excep);
    }
  }
);

/** Delete Api call to delete all the Pet by id */
router.delete(
  "/:id",
  validateParams(
    Joi.object().keys({
      id: Joi.string().required(),
    }),
    {
      stripUnknown: true,
    }
  ),
  async (req, res, next) => {
    try {
      await PetModel.deleteMany({ _id: req.params.id }, (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Pet deleted Sucessfully");
        }
      });
    } catch (excep) {
      next(excep);
    }
  }
);

module.exports = router;
