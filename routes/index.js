const Controller = require("../controllers/controller");
const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/register", Controller.renderRegister);
router.post("/register", Controller.handlerRegister);
router.get("/login", Controller.renderLogin);
router.post("/login", Controller.handlerLogin);
router.get("/", Controller.redirectToHome);
router.get("/home", Controller.renderPublicPosts);

const isLoggedIn = function (req, res, next) {
  console.log(req.session);
  if (!req.session.user) {
    const error = "Please login first";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
};

router.get("/logout", isLoggedIn, Controller.handlerLogout);
router.get("/profile", isLoggedIn, Controller.renderUserProfileAndPosts);
router.get("/profile/edit", isLoggedIn, Controller.renderEditProfile);
router.post("/profile/edit", upload.single("profilePicture"), Controller.handlerEditProfile);
router.get("/posts/add", isLoggedIn, Controller.renderAddPost);
router.post("/posts/add", isLoggedIn, upload.single("image"), Controller.handlerAddPost);
router.get("/posts/:id", Controller.renderPostDetail);
router.get("/posts/:id/edit", isLoggedIn, Controller.renderEditPost);
router.post("/posts/:id/edit", isLoggedIn, Controller.handlerEditPost);
router.get("/posts/:id/delete", isLoggedIn, Controller.handlerDeletePost);

module.exports = router;
