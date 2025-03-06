const formatDate = require("../helpers/helper");
const { User, Profile, Post, Hashtag, PostHashtag } = require("../models");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

class Controller {
  static async redirectToHome(req, res) {
    try {
      res.redirect("/home");
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderRegister(req, res) {
    try {
      let { error } = req.query;
      res.render("auth/register", { error, session: req.session });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerRegister(req, res) {
    try {
      let { email, name, password } = req.body;
      let newUser = await User.create({ email, name, password });
      await Profile.create({ name, UserId: newUser.id });
      res.redirect("/login");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((el) => el.message);
        res.redirect(`/register?error=${errors}`);
      } else {
        res.send(error.message);
      }
    }
  }
  static async renderLogin(req, res) {
    try {
      let { error } = req.query;
      res.render("auth/login", { error, session: req.session });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerLogin(req, res) {
    try {
      let { email, password } = req.body;
      let user = await User.findOne({ where: { email } });
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
          };
          res.redirect("/home");
        } else {
          let error = "Invalid password";
          res.redirect(`/login?error=${error}`);
        }
      } else {
        let error = "Invalid email";
        res.redirect(`/login?error=${error}`);
      }
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerLogout(req, res) {
    try {
      req.session.destroy((error) => {
        if (error) {
          res.send(error);
        } else {
          console.log("Session Destroyed");
          res.redirect("/login");
        }
      });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async renderUserProfileAndPosts(req, res) {
    try {
      let { message } = req.query;
      let id = req.session.user.id;
      let postCount = await Profile.countPost(id);
      let profile = await Profile.findOne({
        where: { UserId: id },
        include: {
          model: User,
          include: {
            model: Post,
          },
        },
      });
      res.render("profile", {
        profile,
        postCount,
        formatDate,
        message,
        session: req.session,
      });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderEditProfile(req, res) {
    try {
      let { error } = req.query;
      let id = req.session.user.id;
      let profile = await Profile.findOne({
        include: User,
        where: { UserId: id },
      });
      res.render("edit-profile", { profile, error, session: req.session });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerEditProfile(req, res) {
    try {
      let { name, birthday, gender, bio, isPrivate } = req.body;
      let id = req.session.user.id;
      let user = await User.findByPk(id);
      await user.update({ name });
      let profile = await Profile.findOne({
        include: User,
        where: { UserId: id },
      });
      let profilePicture = profile.profilePicture;
      if (req.file) {
        if (profile.profilePicture) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "public",
            profile.profilePicture
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        profilePicture = `/uploads/${req.file.filename}`;
      }
      await profile.update({
        profilePicture,
        birthday,
        gender,
        bio,
        isPrivate,
      });
      res.redirect("/profile");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((el) => el.message);
        res.redirect(`/profile/edit?error=${errors}`);
      } else {
        res.send(error.message);
      }
    }
  }
  static async renderAddPost(req, res) {
    try {
      let { error } = req.query;
      let hashtags = await Hashtag.findAll();
      res.render("add-post", { hashtags, error, session: req.session });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerAddPost(req, res) {
    try {
      let UserId = req.session.user.id;
      let { caption, hashtags } = req.body;
      if (!hashtags || hashtags.length === 0) {
        res.redirect("/posts/add?error=Hashtags are required");
      } else {
        let image = req.file ? `/uploads/${req.file.filename}` : null;
        if (!image) {
          return res.redirect("/posts/add?error=Image is required");
        }
        let newPost = await Post.create({ image, caption, UserId });
        for (const hashtag of hashtags) {
          await PostHashtag.create({ PostId: newPost.id, HashtagId: hashtag });
        }
        res.redirect("/profile");
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((el) => el.message);
        res.redirect(`/posts/add?error=${errors}`);
      } else {
        res.send(error.message);
      }
    }
  }
  static async renderPublicPosts(req, res) {
    try {
      let { search, message } = req.query;
      let whereCondition = {};
      if (search) {
        search = search.replace(/^#/, "");
        whereCondition = {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        };
      }
      let data = await Post.findAll({
        include: [
          {
            model: Hashtag,
            where: whereCondition,
          },
          {
            model: User,
            required: true,
            include: [
              {
                model: Profile,
                where: {
                  isPrivate: false,
                },
              },
            ],
          },
        ],
      });
      res.render("home", { data, search, message, session: req.session });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderPostDetail(req, res) {
    try {
      let { error } = req.query;
      let { id } = req.params;
      let post = await Post.findByPk(id, { include: [User, Hashtag] });
      res.render("post-detail", {
        post,
        formatDate,
        error,
        session: req.session,
      });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderEditPost(req, res) {
    try {
      let { error } = req.query;
      let { id } = req.params;
      let hashtags = await Hashtag.findAll();
      let post = await Post.findByPk(id, { include: Hashtag });
      let checkedHashtagIds = post.Hashtags.map((el) => el.id);
      if (
        req.session.user.role === "admin" ||
        req.session.user.id === post.UserId
      ) {
        res.render("edit-post", {
          post,
          hashtags,
          checkedHashtagIds,
          error,
          session: req.session,
        });
      } else {
        error = "You don't have access to edit this post";
        res.redirect(`/posts/${id}?error=${error}`);
      }
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerEditPost(req, res) {
    try {
      let { id } = req.params;
      let { caption, hashtags } = req.body;
      if (!hashtags || hashtags.length === 0) {
        res.redirect(`/posts/${id}/edit?error=Hashtags are required`);
      } else {
        let post = await Post.findByPk(id);
        await post.update({ caption });
        await PostHashtag.destroy({
          where: { PostId: id },
        });
        for (const hashtag of hashtags) {
          await PostHashtag.create({ PostId: id, HashtagId: hashtag });
        }
        res.redirect(`/posts/${id}`);
      }
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerDeletePost(req, res) {
    try {
      let { error } = req.query;
      let { id } = req.params;
      let post = await Post.findByPk(id);
      if (
        req.session.user.role === "admin" ||
        req.session.user.id === post.UserId
      ) {
        await post.destroy();
        let message = `Successfully deleted post with id ${post.id}`;
        if (req.session.user.id === post.UserId) {
          res.redirect(`/profile?message=${message}`);
        } else {
          res.redirect(`/home?message=${message}`);
        }
      } else {
        error = "You don't have access to delete this post";
        res.redirect(`/posts/${id}?error=${error}`);
      }
    } catch (error) {
      res.send(error.message);
    }
  }
}

module.exports = Controller;
