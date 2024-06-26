import User from '../modals/user.js';
import * as jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { name, email,password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ errorMessage: "Bad request" });
    }

    const isExistingUser = await User.findOne({ email: email });

    if (isExistingUser) {
      return res.status(409).json({ message: "User alreday exist" });
    }

   const hashedPassword = await bcrypt.hash(password,10)

    const userData = new User({
      name,
      email,
      password : hashedPassword,
    });

    await userData.save();
    res.json({ message: "User register success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};

export const loginUser = async (req, res,) => {
  try {
    const {  password, email } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }
    const userDetails = await User.findOne({ email: email});
    if (!userDetails) {
        return res
            .status(409)
            .json({ errorMessage: "User doesn't exists" });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      userDetails.password
    )

    if (!isPasswordMatched) {
      return res
          .status(401)
          .json({ errorMessage: "Invalid credentials" });
  }

    const token = jwt.default.sign(
        { userId: userDetails._id ,
         userName: userDetails.name },
        "123abcd",
        { expiresIn: "48h" }
    )


      res.json(
        {
        token: token,
        name:userDetails.name,
        userId:userDetails._id,
        email:email,
        })


} catch (e) {
    console.log(e);
    res.status(500).json({ errorMessage: "Something went wrong!" });
  }
};
export const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, email, oldPassword, newPassword } = req.body;
  
      if (!userId) {
        return res.status(400).json({ errorMessage: "User ID is required" });
      }
  
      const userDetails = await User.findById(userId);
      if (!userDetails) {
        return res.status(404).json({ errorMessage: "User not found" });
      }
  
      if (name) {
        userDetails.name = name;
      }
  
      if (email) {
        const isExistingUser = await User.findOne({ email: email });
        if (isExistingUser && isExistingUser._id.toString() !== userId) {
          return res.status(409).json({ errorMessage: "Email already in use" });
        }
        userDetails.email = email;
      }
  
      if (oldPassword && newPassword) {
        const isPasswordMatched = await bcrypt.compare(oldPassword, userDetails.password);
        if (!isPasswordMatched) {
          return res.status(401).json({ errorMessage: "Old password is incorrect" });
        }
        userDetails.password = await bcrypt.hash(newPassword, 10);
      } else if (oldPassword || newPassword) {
        return res.status(400).json({ errorMessage: "Both old and new passwords are required" });
      }
  
      await userDetails.save();
      res.json({ message: "User details updated successfully" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ errorMessage: "Something went wrong!" });
    }
};

export const addPerson = async (req, res) => {
    try {
        const { userId } = req.params;
        const { person } = req.body;

        // Validate person input
        if (!person || typeof person !== 'string') {
            return res.status(400).json({ message: 'Invalid person input' });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the person already exists in addPeople
        if (user.addPeople.includes(person)) {
            return res.status(400).json({ message: 'Person already added' });
        }

        // Add the person to addPeople
        user.addPeople.push(person);
        await user.save();

        res.status(200).json({ message: 'Person added successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all items in addPeople array
export const getAddPeople = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ addPeople: user.addPeople });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
