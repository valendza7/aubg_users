"use strict";

const { query, param, body } = require("express-validator");
const { validation_error_checker } = require("../helper/helper"),
		userModel = mysqlModel.user,
		userProfileModel = mysqlModel.user_profile

exports.validate = (method) => {
	if (method == 'getone') {
		return [
			param('user_id', "User ID is invalid").exists().isInt().toInt()
		]
	}
	else if (method == 'create') {
		return [
			body('first_name', "Provide First Name").exists().bail().notEmpty().bail().isString(),
			body('last_name', "Provide Last Name").optional().bail().isString(),
			body('email', "Provide valid Email").exists().bail().notEmpty().bail().isString().isEmail(),
			body('phone_no', "Provide Phonenumber").exists().bail().notEmpty().bail().isMobilePhone().custom((value) => {
				if (value.length !== 10) {
				  return Promise.reject("Phone number should be 10 digits");
				} else {
				  return true;
				}
			  }),
			body('gender', "Provide Gender").exists().bail().notEmpty().bail().isString().isIn(['male', 'female', 'others']).withMessage('Gender is invalid'),
			body('address', "Provide Address").optional().bail().isString()
		]
	}
	else if (method == 'update') {
		return [
			body('first_name', "Provide First Name").isString().optional(),
			body('last_name', "Provide Last Name").optional().bail().isString(),
			body('email', "Provide Email").isString().isEmail().optional(),
			body('phone_no', "Provide Phonenumber").isString().optional().isMobilePhone().custom((value) => {
				if (value.length !== 10) {
				  return Promise.reject("Phone number should be 10 digits");
				} else {
				  return true;
				}
			  }),
			body('gender', "Provide Gender").isString().optional().isIn(['male', 'female', 'others']).withMessage('Gender is invalid'),
			body('address', "Provide Address").optional().isString()
		]
	}
	else if (method == 'delete') {
		return [
			param('user_id', "User ID is invalid").exists().bail().isInt().toInt()
		]
	}
}

//get list
exports.read = async (req, res, next) => {
	try {
		let response = {}
		const data = await userModel.findAll()
		if(data.length > 0) response['users'] = data
		else {
			response['message'] = "No users found"
		}
		res.commonsuccess(response)
	} catch (error) {
		next({
			source: "read", type: "error",
			content: error
		})
	}
}

//get single on userid
exports.get = async (req, res, next) => {
	try {
		validation_error_checker(req)
		let user_id = req.params.user_id
		let response = {}
		const data = await userModel.findAll({where: {user_id: user_id}})
		if(data.length > 0) response['users'] = data
		else {
			response['message'] = "User not found"
		}
		res.commonsuccess(response)
	} catch (error) {
		next({
			source: "get", type: "error",
			content: error
		})
	}
}

//create user
exports.create = async (req, res, next) => {
	try {
		validation_error_checker(req)
		const userExists = await userModel.findOne({ email: req.body.email });
		if (userExists) {
			return res.status(401).json({ error: 'User with provided email exists! Provide a different email' });
		}
		let response = {}
		let user = req.body
		let insertUser = {
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			phone_no: user.phone_no,
			gender: user.gender,
			address: user.address
		}
		
		let createdUser = await userModel.create(insertUser)
		response['message'] = "User Created"
		response['user'] = createdUser
		res.commonsuccess(response)
	} catch (error) {
		next({
			source: "create", type: "error",
			content: error
		})
	}
}

//update user
exports.update = async (req, res, next) => {
	try {
		validation_error_checker(req)
		let reqUserData = req.body, user_id = req.params.user_id
		let updateUser = {}, response = {}

		let userdata = await userModel.findByPk(user_id)

		if(userdata) {
			for (const [k,v] of Object.entries(reqUserData)) {
				if(v && v != 'null') updateUser[k] = v
			}
	
			let updated = await userModel.update(updateUser, { where: {user_id: user_id}})
			response['message'] = "User Updated"
	
			if(updated) response['user'] = await userModel.findByPk(user_id)
		}else {
			response['message'] = "User not found"
		}	

		res.commonsuccess(response)

	} catch (error) {
		next({
			source: "update", type: "error",
			content: error
		})
	}
}

//delete user
exports.delete = async (req, res, next) => {
	try {
		validation_error_checker(req)
		let user_id = req.params.user_id, response = {}

		let userdata = await userModel.findByPk(user_id)

		if(userdata) {
			let updated = await userModel.destroy({ where: {user_id: user_id}})
			response['message'] = "User Deleted"
	
			if(updated) response['user'] = userdata.user_id
		}else {
			response['message'] = "User not found"
		}

		res.commonsuccess(response)

	} catch (error) {
		next({
			source: "delete", type: "error",
			content: error
		})
	}
}

exports.uploadprofile = async (req, res) => {
	try {
		let response = {}
		const user_id = req.params.user_id
		let data = {}
        if(req.file) {
            data.image = req.file.location
        }
		let userdata = await userModel.findByPk(user_id)

		let updateProfile = await userProfileModel.create({
			user_id: userdata.user_id,
			file_url: data.image
		})
		if(updateProfile) response['message'] = "upload successful"
		else response['message'] = "upload unsuccessful"
		res.commonsuccess(response)
	} catch (error) {
		next({
			source: "uploadprofile", type: "error",
			content: error
		})
	}
}