const router = require("express").Router();
const createError = require("http-errors");
const User = require("../models/user_model");
const { authSchema } = require("../helpers/validationSchema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwtHelper");

// User registration
router.post("/register", async (req, res, next) => {
  try {
    // const {email,password} = req.body;
    // if(!email || !password) throw createError.BadRequest()

    const result = await authSchema.validateAsync(req.body);
    const emailExist = await User.findOne({ email: result.email });
    if (emailExist)
      throw createError.Conflict(`${email} is already been registered.`);

    const user = new User(result);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    res
      .status(200)
      .send({ message: "Registered Successfully.", accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createError.NotFound("User not registered.");

    const isMatched = await user.isValidPassword(result.password);
    if (!isMatched)
      throw createError.Unauthorized("Username/Password not valid");

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res
      .status(200)
      .send({ message: "Successfull..", accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest("Invalid Email/Password"));
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    const newAccessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);
    console.log(newRefreshToken);
    res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
});

router.delete("/logout", async (req, res, next) => {
  res.send({ message: "logout" });
});

module.exports = router;
