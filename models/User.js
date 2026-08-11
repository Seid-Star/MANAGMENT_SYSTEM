const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    division: { type: String, required: true },
    year: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "supervisor", "user"],
      default: "user",
    },
    settings: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      autoAddCalendarEvents: { type: Boolean, default: true },
      phonePublic: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model("User", userSchema);
