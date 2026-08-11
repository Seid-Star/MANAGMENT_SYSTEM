const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Remove existing admin account
    await User.deleteOne({ email: "admin@example.com" });

    // Let the User model hash the password automatically
    const admin = new User({
      fullName: "System Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      division: "Admin",
      year: "1st",
    });

    await admin.save();

    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
