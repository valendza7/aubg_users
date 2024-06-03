"use strict"

const { validationResult } = require("express-validator");

const validationErrorFormatter = ({ location, msg, param, value }) => `${param}: ${msg}:${value}`;

exports.validation_error_checker = (req) => {
	const errors = validationResult(req).formatWith(validationErrorFormatter);
	if (!errors.isEmpty()) throw errors.array().join(", ")
}