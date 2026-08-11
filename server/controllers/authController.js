const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword, division, year } =
      req.body;

    if (!fullName || !email || !password || !division || !year) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email address is already in use" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      division,
      year,
      role: "user",
    });

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        division: user.division,
        year: user.year,
        role: user.role,
        settings: user.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        division: user.division,
        year: user.year,
        role: user.role,
        settings: user.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};
