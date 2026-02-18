import createHttpError from 'http-errors';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { UserCollection } from '../database/models/user.js';
import { SessionsCollection } from '../database/models/session.js';
import { ONE_DAY, ONE_MONTH } from '../helpers/constants.js';

export type AuthSession = {
  _id: string;
  accessToken: string;
  refreshToken: string;
  accessTokenValidUntil: number;
  refreshTokenValidUntil: number;
};

type RegisterPayload = {
  email: string;
  password: string;
  group?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RefreshPayload = {
  sessionId?: string;
  refreshToken?: string;
};

type GetMePayload = {
  sessionId?: string;
  accessToken?: string;
};

const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password: string, storedPassword: string) => {
  if (!storedPassword.includes(':')) {
    return password === storedPassword;
  }

  const [salt, hash] = storedPassword.split(':');
  const bufferA = Buffer.from(hash, 'hex');
  const bufferB = scryptSync(password, salt, 64);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
};

const buildSessionPayload = () => {
  return {
    accessToken: randomBytes(32).toString('hex'),
    refreshToken: randomBytes(32).toString('hex'),
    accessTokenValidUntil: Date.now() + ONE_DAY,
    refreshTokenValidUntil: Date.now() + ONE_MONTH,
  };
};

const createSession = async (userId: string) => {
  const payload = buildSessionPayload();
  const session = await SessionsCollection.create({
    userId,
    ...payload,
  });

  return {
    _id: session._id.toString(),
    ...payload,
  };
};

export const registerUserService = async ({ email, password }: RegisterPayload) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await UserCollection.findOne({ nickname: normalizedEmail });

  if (existingUser) {
    throw createHttpError(409, 'Email already in use');
  }

  const user = await UserCollection.create({
    cognitoSub: randomUUID(),
    nickname: normalizedEmail,
    password: hashPassword(password),
  });

  return {
    message: 'User registered successfully',
    user,
  };
};

export const loginService = async ({ email, password }: LoginPayload) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await UserCollection.findOne({ nickname: normalizedEmail });

  if (!user || !verifyPassword(password, user.password)) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const session = await createSession(user._id.toString());

  return {
    user,
    session,
  };
};

export const logoutService = async (sessionId?: string) => {
  if (!sessionId) {
    return { message: 'User already logged out' };
  }

  await SessionsCollection.deleteOne({ _id: sessionId });
  return { message: 'Logged out successfully' };
};

export const refreshService = async ({ sessionId, refreshToken }: RefreshPayload) => {
  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing session data');
  }

  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
    refreshTokenValidUntil: { $gt: Date.now() },
  });

  if (!session) {
    throw createHttpError(401, 'Session not found or expired');
  }

  const payload = buildSessionPayload();

  session.accessToken = payload.accessToken;
  session.refreshToken = payload.refreshToken;
  session.accessTokenValidUntil = payload.accessTokenValidUntil;
  session.refreshTokenValidUntil = payload.refreshTokenValidUntil;

  await session.save();

  const user = await UserCollection.findById(session.userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return {
    user,
    session: {
      _id: session._id.toString(),
      ...payload,
    },
  };
};

export const getMeService = async ({ sessionId, accessToken }: GetMePayload) => {
  if (!sessionId || !accessToken) {
    throw createHttpError(401, 'Not authenticated');
  }

  const session = await SessionsCollection.findOne({
    _id: sessionId,
    accessToken,
    accessTokenValidUntil: { $gt: Date.now() },
  });

  if (!session) {
    throw createHttpError(401, 'Invalid or expired session');
  }

  const user = await UserCollection.findById(session.userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return user;
};
