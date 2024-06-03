"use strict";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminModel = mysqlModel.admin

//register admin
exports.register = async (req, res, next) => {
	try {
		let response = {}
		const { username, password } = req.body;
		const adminExists = await adminModel.findOne({ email: req.body.email });
		if (adminExists) {
			return res.status(401).json({ error: 'Admin with provided email exists! Provide a different email' });
		}
		const hashedPassword = await bcrypt.hash(password, 8);
		const admin = new adminModel({ username, password: hashedPassword });
		await admin.save();
		response['message'] = 'User registered successfully'
		res.commonsuccess(response)
	} catch (error) {
		next({
			source: "register", type: "error",
			content: error
		})
	}
}

//admin login
exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		let response = {}
		const admin = await adminModel.findOne({ username });
		if (!admin) {
			return res.status(401).json({ error: 'Authentication failed' });
		}
		const passwordMatch = await bcrypt.compare(password, admin.password);
		if (!passwordMatch) {
			return res.status(401).json({ error: 'Authentication failed' });
		}
		const token = jwt.sign({ adminId: admin.admin_id }, process.env.JWT_SECRET_OR_KEY, {
			expiresIn: process.env.JWT_TOKEN_EXPIRATION,
		});
		response['token'] = token
		res.commonsuccess(response)
	} catch (error) {
		next({
			source: "login", type: "error",
			content: error
		})
	}
}