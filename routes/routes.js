const express = require("express")
const {getAllUsers, getOneUser, addUser, saveUser, editUser, updateUser, deleteUser, deleteAllUsers, findSomeUsersByConditions,renderHomePage
} = require("../controllers/userController")

const router = express.Router()


const multer = require("multer")

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads")
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        //console.log(extension);
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }
})

const upload = multer({
    storage: storage,
}).single("image")

/* HOME PAGE */
router.get("/", renderHomePage);

/* GET ALL USERS */
router.get("/users", getAllUsers);

/* GET SINGLE USER BY ID */
router.get('/user/:id', getOneUser);

/** GET TEMPLATE FORM ON ADD USER */
router.get("/add", addUser);

/* SAVE USER */
router.post("/add-user", upload, saveUser);

/** GET TEMPLATE FORM ON EDIT USER */
router.get('/edit-user/:id', editUser);

// UPDATE USER
//router.put('/user/:id', updateUser);
router.post('/update-user/:id', upload, updateUser);

/* DELETE ONE USER */
//router.delete('/user/:id', deleteUser);
router.get('/delete-user/:id', deleteUser);

router.delete('/users', deleteAllUsers);

router.get('/users-with-name', findSomeUsersByConditions);

module.exports = router;