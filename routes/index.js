const Controller = require("../controllers/controller");
const router = require("express").Router();

router.get("/register", Controller.renderRegister);
router.post("/register", Controller.handlerRegister);
router.get("/login", Controller.renderLogin);
router.post("/login", Controller.handlerLogin);
router.get("/", Controller.redirectToHome);
router.get("/home", Controller.renderPublicPosts);

const isAdmin = function (req, res, next) {
  console.log(req.session);
  if (req.session.user && req.session.user.role !== "admin") {
    const error = "You have no access";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
};

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
router.post("/profile/edit", isLoggedIn, Controller.handlerEditProfile);
router.get("/posts/add", isLoggedIn, Controller.renderAddPost);
router.post("/posts/add", isLoggedIn, Controller.handlerAddPost);
router.get("/posts/:id", Controller.renderPostDetail);
router.get("/posts/:id/edit", isLoggedIn, Controller.renderEditPost);
router.post("/posts/:id/edit", isLoggedIn, Controller.handlerEditPost);
router.get("/posts/:id/delete", isLoggedIn, Controller.handlerDeletePost);

module.exports = router;
