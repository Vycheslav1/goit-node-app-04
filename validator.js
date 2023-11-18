const express = require("express");

const Joi = require("joi");

const schema = Joi.object({
  id: Joi.string().alphanum().min(4),
  name: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string()
    .pattern(new RegExp("[0-9]{3} [0-9]{3} [0-9]{4}"))
    .required(),
  favorite: Joi.boolean().valid(true),
  password: Joi.string().alphanum().min(4).required,
});

const schemaId = new Joi.object({
  id: Joi.string().alphanum().min(4),
});

const schemaRegister = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().alphanum().min(4).required,
});

const schemaLogin = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().alphanum().min(4).required,
});

module.exports = { schema, schemaId, schemaRegister, schemaLogin };
