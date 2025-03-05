const { User } = require("../models");

class Controller {
  static async renderRegister(req, res) {
    try {
      res.render("auth/register")
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerRegister(req, res) {
    try {
    } catch (error) {
      res.send(error.message);
    }
  }
  static async renderLogin(req, res) {
    try {
      res.render("auth/login")
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerLogin(req, res) {
    try {
    } catch (error) {
      res.send(error.message);
    }
  }
  static async handlerLogout(req, res) {
    try {
    } catch (error) {
      res.send(error.message);
    }
  }

  static async renderUserProfileAndPosts(req, res) {
    try {
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
      let { search } = req.query;
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
