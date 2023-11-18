const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
require("dotenv").config();

const auth = async (req, res, next) => {
  const header = req.headers("authorization");

  const [bearer, token] = header.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }
  jwt.verify(token, process.env["MY_SECRET_KEY"], async (error, decode) => {
    if (error) {
      return res.send({
        Status: (401)["Unauthorized"],
        "Content-Type": "application/json",
        ResponseBody: {
          message: "Not authorized",
        },
      });
    } else {
      req.user = decode;
      const user = await User.findById(decode.id).exec();
      if (!user || user.token !== token) {
        return res.send({
          Status: (401)["Unauthorized"],
          "Content-Type": "application/json",
          ResponseBody: {
            message: "Not authorized",
          },
        });
      }

      req.user = { id: user._id };
      next();
    }
  });
};

module.exports = auth;
