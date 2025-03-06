const formatDate = require("../helpers/helper");
const { User, Profile, Post, Hashtag, PostHashtag } = require("../models");
const bcrypt = require("bcryptjs");

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
      res.render("auth/register", { error });
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
      res.render("auth/login", { error });
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
          res.redirect("/profile");
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
      let id = req.session.user.id;
      let profile = await Profile.findOne({
        where: { UserId: id },
        include: {
          model: User,
          include: {
            model: Post,
          },
        },
      });
      res.render("profile", { profile, formatDate });
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
      res.render("edit-profile", { profile, error });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerEditProfile(req, res) {
    try {
      let { profilePicture, name, birthday, gender, bio, isPrivate } = req.body;
      let id = req.session.user.id;
      let user = await User.findByPk(id);
      await user.update({ name });
      let profile = await Profile.findOne({
        include: User,
        where: { UserId: id },
      });
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
      res.render("add-post", { hashtags, error });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerAddPost(req, res) {
    try {
      let UserId = req.session.user.id;
      let { image, caption, hashtags } = req.body;
      if (!hashtags || hashtags.length === 0) {
        res.redirect("/posts/add?error=Hashtags are required");
      } else {
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
      res.render("home");
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderPostDetail(req, res) {
    try {
      let { error } = req.query;
      let user = req.session.user;
      let { id } = req.params;
      let post = await Post.findByPk(id, { include: [User, Hashtag] });
      res.render("post-detail", { post, formatDate, user, error });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderEditPost(req, res) {
    try {
      let { error } = req.query;
      let { id } = req.params;
      let hashtags = await Hashtag.findAll();
      let post = await Post.findByPk(id, {include: Hashtag});
      let checkedHashtagIds = post.Hashtags.map(el => el.id)
      if (
        req.session.user.role === "admin" ||
        req.session.user.id === post.UserId
      ) {
        res.render("edit-post", { post, hashtags, checkedHashtagIds, error });
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
        res.redirect("/profile");
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
        res.redirect("/profile");
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
