import { RequestHandler } from 'express';
import * as services from '../services/teachersService.js';
import { GetAllTeachersParams } from '../types/teachers.js';
import { Teachers } from '../database/models/teachers.js';
import createHttpError from 'http-errors';
export const getAllTeachers: RequestHandler = async (req, res, next) => {
  try {
    const toNumber = (value?: string) => {
      if (!value) return undefined;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const {
      page,
      perPage,
      price_per_hour,
      languages,
      levels,
    } = req.query as Record<string, string | undefined>;

    const filters: GetAllTeachersParams = {
      page: toNumber(page),
      perPage: toNumber(perPage),
      price_per_hour: toNumber(price_per_hour),
      languages,
      levels,
    };

    const result = await services.getAllTeachers(filters);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const createTeacher: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Teachers;
    const result = await services.createTeacher(body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getTeacherById: RequestHandler = async (req, res, next) => {
  try {
    const teacherId = req.params.teacherId;
    const result = await services.getTeacherById(teacherId);
    if (!result) {
      return next(createHttpError(404, 'Teacher not found'));
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateTeacherById: RequestHandler = async (req, res, next) => {
  try {
    const teacherId = req.params.teacherId;
    const result = await services.updateTeacherById(teacherId, req.body);
    if (!result) {
      return next(createHttpError(404, 'Teacher not found'));
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteTeacherById: RequestHandler = async (req, res, next) => {
  try {
    const teacherId = req.params.teacherId;
    const result = await services.deleteTeacherById(teacherId);
    if (!result) {
      return next(createHttpError(404, 'Teacher not found'));
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
