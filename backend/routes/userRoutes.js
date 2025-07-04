import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';
import { isAuth, isAdmin, generateToken, baseUrl } from '../utils.js';

const userRouter = express.Router();

/** GET all users (admin) */
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find();
    res.send(users);
  })
);

/** GET user by id (admin) */
userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) res.send(user);
    else res.status(404).send({ message: 'User Not Found' });
  })
);

/** UPDATE user profile */
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

/** FORGOT PASSWORD - send email link */
userRouter.post(
  '/forgot-password',
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).send({ message: 'Email is required' });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3 * 60 * 60 * 1000;
    await user.save();

    const resetLink = `${baseUrl()}/reset-password/${token}`;
    console.log(`Reset link: ${resetLink}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vivek.gupta.22265@gmail.com', // use your email
        pass: 'wmakasiahyngdkew', // use app password
      },
    });

    const mailOptions = {
      from: 'vivek.gupta.22265@gmail.com',
      to: email,
      subject: 'Reset your Medicure password',
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 3 hours.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Error sending email.' });
      } else {
        res.send({ message: 'Reset link sent to your email.' });
      }
    });
  })
);

/** RESET PASSWORD with token */
userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).send({ message: 'Token and password required' });
      return;
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'Invalid or expired token' });
        return;
      }
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() },
      });
      if (!user) {
        res.status(404).send({ message: 'User not found or token expired' });
        return;
      }
      user.password = bcrypt.hashSync(password, 8);
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
      res.send({ message: 'Password reset successful. Please sign in.' });
    });
  })
);

/** UPDATE user (admin) */
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

/** DELETE user (admin) */
userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Cannot delete admin user' });
        return;
      }
      await user.deleteOne();
      res.send({ message: 'User deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

/** SIGNIN */
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    } else {
      res.status(401).send({ message: 'Invalid email or password' });
    }
  })
);

/** SIGNUP */
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

export default userRouter;
