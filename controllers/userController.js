const User = require("../models/users");

const fs = require("fs")

const renderHomePage = async (req, res, next) => {

    const users = await User.find({});

    try {
        res.render("index", { users: users, title: "Node Express Mongo DB", isHome: true, isAdd: false })
    } catch (error) {
        res.status(500).send(error);
    }
}

/* GET ALL USERS */
const getAllUsers = async (req, res, next) => {
    const users = await User.find({});

    try {
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
}

/* GET ONE USER */
const getOneUser = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found user with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving user with id=" + id });
        });

}

/** RETUR TEMPLATE ADD USER */

const addUser = (req, res, next) => {
    res.render("addUser", { title: "Node Express Mongo DB", isHome: false, isAdd: true })
}

/* SAVE USER */
const saveUser = async (req, res, next) => {
    //const user = new User(req.body);
    //console.log(req.file);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file ? req.file.filename : "avatar.png",
    });

    try {
        await user.save();
        //res.send(user);
        req.session.message = {
            type: "success",
            message: "User added successfully !"
        }
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
}

/* EDIT USER TEMPLATE */
const editUser = (req, res, next) => {

    const id = req.params.id;

    User.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).send({
                    message: `Cannot update user with id=${id}. Maybe user was not found!`
                });
            } else {
                res.render("editUser", { user: user, title: "Node Express Mongo DB", isHome: false, isAdd: false })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating user with id=" + id
            });
        });
}

/* UPDATE USER */
const updateUser = (req, res, next) => {
    if (!req.body) {
        return res.status(400).send({
            message: "User to update can not be empty!"
        });
    }
    let new_image = ""
    const id = req.params.id;

    if (req.file) {
        //console.log(req.file);
        new_image = req.file.filename
        try {
            if(req.body.old_image != "avatar.png")
            fs.unlinkSync("./uploads/" + req.body.old_image)
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image
    }

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    }, { useFindAndModify: false })
        .then(user => {
            if (!user) {
                res.status(404).send({
                    message: `Cannot update user with id=${id}. Maybe user was not found!`
                });
            } else {
                /*res.send({
                    message: "User was updated successfully."
                });*/
                req.session.message = {
                    type: "success",
                    message: "User updated successfully !"
                }
                res.redirect('/');
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating user with id=" + id
            });
        });
}

/* DELETE USER */
const deleteUser = (req, res, next) => {
    const id = req.params.id;
    User.findByIdAndRemove(id)
        .then(user => {
            if (!user) {
                res.status(404).send({
                    message: `Cannot delete user with id=${id}. Maybe user was not found!`
                });
            } else {
                if(user.image != "avatar.png") {
                    try {
                        fs.unlinkSync("./uploads/" + user.image)
                    } catch (err) {
                        console.log(err);
                    }
                }
                /*res.send({
                    message: "User was deleted successfully!"
                });*/
                req.session.message = {
                    type: "success",
                    message: "User deleted successfully !"
                }
                res.redirect('/');
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete user with id=" + id
            });
        });
}

/* DELETE MULTIPLE USERS */
const deleteAllUsers = (req, res, next) => {
    User.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} users were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
}

/* FIND MULTIPLE USERS BY CONDITIONS */
const findSomeUsersByConditions = (req, res, next) => {
    User.find({ name: "Nantenaina" })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}

module.exports = { renderHomePage, getAllUsers, getOneUser, addUser, saveUser, editUser, updateUser, deleteUser, deleteAllUsers, findSomeUsersByConditions }