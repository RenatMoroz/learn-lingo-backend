import { RequestHandler } from 'express';
import { CookieOptions } from 'express';
import * as authServices from '../services/authService.js';
import { ONE_DAY, ONE_MONTH } from '../helpers/constants.js';

const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

export const registerUserController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const { email, password, group } = req.body as {
      email: string;
      password: string;
      group?: string;
    };

    const result = await authServices.registerUserService({
      email,
      password,
      group,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const loginController: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const { user, session } = await authServices.loginService({
      email,
      password,
    });

    res.cookie('refreshToken', session.refreshToken, {
      ...cookieConfig,
      maxAge: ONE_MONTH,
    });
    res.cookie('accessToken', session.accessToken, {
      ...cookieConfig,
      maxAge: ONE_DAY,
    });
    res.cookie('sessionId', session._id, {
      ...cookieConfig,
      maxAge: ONE_MONTH,
    });

    res.status(200).json({
      message: 'Login successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController: RequestHandler = async (req, res, next) => {
  try {
    await authServices.logoutService(req.cookies?.sessionId);

    res.clearCookie('refreshToken', cookieConfig);
    res.clearCookie('accessToken', cookieConfig);
    res.clearCookie('sessionId', cookieConfig);

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const refreshController: RequestHandler = async (req, res, next) => {
  try {
    const { user, session } = await authServices.refreshService({
      sessionId: req.cookies?.sessionId,
      refreshToken: req.cookies?.refreshToken,
    });

    res.cookie('refreshToken', session.refreshToken, {
      ...cookieConfig,
      maxAge: ONE_MONTH,
    });
    res.cookie('accessToken', session.accessToken, {
      ...cookieConfig,
      maxAge: ONE_DAY,
    });
    res.cookie('sessionId', session._id, {
      ...cookieConfig,
      maxAge: ONE_MONTH,
    });

    res.status(200).json({
      message: 'Session refreshed successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const getMeController: RequestHandler = async (req, res, next) => {
  try {
    const user = await authServices.getMeService({
      sessionId: req.cookies?.sessionId,
      accessToken: req.cookies?.accessToken,
    });

    res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
};
