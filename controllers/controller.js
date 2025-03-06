const { User } = require("../models");
const bcrypt = require("bcryptjs");

class Controller {
  static async search(req, res) {
    try {
      res.render("search");
    } catch (error) {
      res.send(error.message);
    }
  }
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
      const userProfile = {
        username: "zalpiinnn",
        image: "https://i.pinimg.com/474x/b7/a8/65/b7a865eafab76b149ac6ebaf70fdac48.jpg",
        bio: "Hobi mancing 🎣 | Fullstack Developer",
        followers: 1200,
        following: 300,
        posts: [
          { image: "https://i.pinimg.com/474x/ed/17/ea/ed17ea78b22cde754f78dc45f996556d.jpg" },
          { image: "https://i.pinimg.com/474x/1b/bc/86/1bbc86490fa6b30ae2cf13d2ac036738.jpg" },
          { image: "https://i.pinimg.com/474x/27/b0/7d/27b07d8231877d7e716523254b5a1fec.jpg" },
          { image: "https://i.pinimg.com/474x/ed/17/ea/ed17ea78b22cde754f78dc45f996556d.jpg" },
          { image: "https://i.pinimg.com/474x/1b/bc/86/1bbc86490fa6b30ae2cf13d2ac036738.jpg" },
          { image: "https://i.pinimg.com/474x/27/b0/7d/27b07d8231877d7e716523254b5a1fec.jpg" },
          { image: "https://i.pinimg.com/474x/ed/17/ea/ed17ea78b22cde754f78dc45f996556d.jpg" },
          { image: "https://i.pinimg.com/474x/1b/bc/86/1bbc86490fa6b30ae2cf13d2ac036738.jpg" },
          { image: "https://i.pinimg.com/474x/27/b0/7d/27b07d8231877d7e716523254b5a1fec.jpg" },
          { image: "https://i.pinimg.com/474x/ed/17/ea/ed17ea78b22cde754f78dc45f996556d.jpg" },
          { image: "https://i.pinimg.com/474x/1b/bc/86/1bbc86490fa6b30ae2cf13d2ac036738.jpg" },
          { image: "https://i.pinimg.com/474x/27/b0/7d/27b07d8231877d7e716523254b5a1fec.jpg" },
          { image: "https://i.pinimg.com/474x/ed/17/ea/ed17ea78b22cde754f78dc45f996556d.jpg" },
          { image: "https://i.pinimg.com/474x/1b/bc/86/1bbc86490fa6b30ae2cf13d2ac036738.jpg" },
          { image: "https://i.pinimg.com/474x/27/b0/7d/27b07d8231877d7e716523254b5a1fec.jpg" },
          { image: "https://i.pinimg.com/474x/ed/17/ea/ed17ea78b22cde754f78dc45f996556d.jpg" },
          { image: "https://i.pinimg.com/474x/1b/bc/86/1bbc86490fa6b30ae2cf13d2ac036738.jpg" },
          { image: "https://i.pinimg.com/474x/27/b0/7d/27b07d8231877d7e716523254b5a1fec.jpg" },
          { image: "https://i.pinimg.com/474x/ed/17/ea/ed17ea78b22cde754f78dc45f996556d.jpg" },
          { image: "https://i.pinimg.com/474x/1b/bc/86/1bbc86490fa6b30ae2cf13d2ac036738.jpg" },
          { image: "https://i.pinimg.com/474x/27/b0/7d/27b07d8231877d7e716523254b5a1fec.jpg" },
          { image: "https://i.pinimg.com/474x/ed/17/ea/ed17ea78b22cde754f78dc45f996556d.jpg" },
          { image: "https://i.pinimg.com/474x/1b/bc/86/1bbc86490fa6b30ae2cf13d2ac036738.jpg" },
          { image: "https://i.pinimg.com/474x/27/b0/7d/27b07d8231877d7e716523254b5a1fec.jpg" },
          { image: "https://i.pinimg.com/474x/ed/17/ea/ed17ea78b22cde754f78dc45f996556d.jpg" },
          { image: "https://i.pinimg.com/474x/1b/bc/86/1bbc86490fa6b30ae2cf13d2ac036738.jpg" },
          { image: "https://i.pinimg.com/474x/27/b0/7d/27b07d8231877d7e716523254b5a1fec.jpg" },
        ]
      };
      res.render("profile", { profile: userProfile });
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
      let images = [
        'https://i.pinimg.com/474x/44/b4/cc/44b4ccb3d79f501d6c489accd1d34108.jpg',
        'https://i.pinimg.com/474x/6f/81/cc/6f81cc4cfc1e5959138dcff59e0cc74b.jpg',
        'https://i.pinimg.com/474x/b0/9e/d3/b09ed3f24b8225428be6084e5f43f0cf.jpg',
        'https://i.pinimg.com/474x/a5/11/75/a51175a8a68ed3f04b3db758b4a259f5.jpg',
        'https://i.pinimg.com/474x/44/b4/cc/44b4ccb3d79f501d6c489accd1d34108.jpg',
        'https://i.pinimg.com/474x/6f/81/cc/6f81cc4cfc1e5959138dcff59e0cc74b.jpg',
        'https://i.pinimg.com/474x/b0/9e/d3/b09ed3f24b8225428be6084e5f43f0cf.jpg',
        'https://i.pinimg.com/474x/a5/11/75/a51175a8a68ed3f04b3db758b4a259f5.jpg',
        'https://i.pinimg.com/474x/44/b4/cc/44b4ccb3d79f501d6c489accd1d34108.jpg',
        'https://i.pinimg.com/474x/6f/81/cc/6f81cc4cfc1e5959138dcff59e0cc74b.jpg',
        'https://i.pinimg.com/474x/b0/9e/d3/b09ed3f24b8225428be6084e5f43f0cf.jpg',
        'https://i.pinimg.com/474x/a5/11/75/a51175a8a68ed3f04b3db758b4a259f5.jpg'
      ]
      res.render("home", { images })
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
