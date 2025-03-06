const Controller = require("../controllers/controller");
const router = require("express").Router();

router.get("/register", Controller.renderRegister);
router.post("/register", Controller.handlerRegister);
router.get("/login", Controller.renderLogin);
router.post("/login", Controller.handlerLogin);
router.get("/", Controller.redirectToHome)
router.get("/home", Controller.renderPublicPosts)
router.get("/search", Controller.search)

// const isAdmin = function (req, res, next) {
//     console.log(req.session);
//     if (req.session.user && req.session.user.role !== "admin") {
//         const error = "You have no access";
//         res.redirect(`/login?error=${error}`);
//     } else {
//         next();
//     }
// };

// router.use((req, res, next) => {
//     console.log(req.session);
//     if (!req.session.user) {
//         const error = "Please login first";
//         res.redirect(`/login?error=${error}`);
//     } else {
//         next();
//     }
// });

router.get("/logout", Controller.handlerLogout);
router.get("/profile", Controller.renderUserProfileAndPosts);
router.get("/profile/edit", Controller.renderEditProfile);
router.post("/profile/edit", Controller.handlerEditProfile);
router.get("/posts/add", Controller.renderAddPost);
router.post("/posts/add", Controller.handlerAddPost);
router.get("/posts/:id", Controller.renderPostDetail);
router.get("/posts/:id/edit", Controller.renderEditPost);
router.post("/posts/:id/edit", Controller.handlerEditPost);
router.post("/posts/:id/delete", Controller.handlerDeletePost);

module.exports = router;
