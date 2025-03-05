const Controller = require("../controllers/controller");
const router = require("express").Router();

router.get("/register", Controller.renderRegister)
router.post("/register", Controller.handlerRegister)
router.get("/login", Controller.renderLogin)
router.post("/login", Controller.handlerLogin)
router.get("/logout", Controller.handlerLogout)

router.get("/profile", Controller.renderUserProfileAndPosts)
router.get("/profile/edit", Controller.renderEditProfile)
router.post("/profile/edit", Controller.handlerEditProfile)
router.get("/posts", Controller.renderPublicPosts)
router.get("/posts/add", Controller.renderAddPost)
router.post("/posts/add", Controller.handlerAddPost)
router.get("/posts/:id", Controller.renderPostDetail)
router.get("/posts/:id/edit", Controller.renderEditPost)
router.post("/posts/:id/edit", Controller.handlerEditPost)
router.post("/posts/:id/delete", Controller.handlerDeletePost)

module.exports = router;
