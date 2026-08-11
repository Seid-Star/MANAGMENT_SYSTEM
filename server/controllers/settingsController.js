const User = require("../models/User");

exports.getSettings = async (req, res, next) => {
  try {
    res.json(req.user.settings);
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { settings: { ...req.user.settings, ...req.body } } },
      { new: true },
    );
    res.json(user.settings);
  } catch (error) {
    next(error);
  }
};
