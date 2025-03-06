const { User } = require("../models");
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
      await User.create({ email, name, password });
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
          res.redirect("/login")
        }
      })
    } catch (error) {
      res.send(error.message);
    }
  }

  static async renderUserProfileAndPosts(req, res) {
    try {
      res.render("profile");
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderEditProfile(req, res) {
    try {
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerEditProfile(req, res) {
    try {
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderAddPost(req, res) {
    try {
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerAddPost(req, res) {
    try {
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderPublicPosts(req, res) {
    try {
      res.render("home")
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderPostDetail(req, res) {
    try {
      let { id } = req.params;
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderEditPost(req, res) {
    try {
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerEditPost(req, res) {
    try {
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerDeletePost(req, res) {
    try {
    } catch (error) {
      res.send(error.message);
    }
  }
}

module.exports = Controller;
