import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import * as services from '../services/reviewsService.js';

export const getAllReviews: RequestHandler = async (_req, res, next) => {
  try {
    const result = await services.getAllReviews();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getReviewsByTeacherId: RequestHandler = async (req, res, next) => {
  try {
    const teacherId = req.params.teacherId;
    const result = await services.getReviewsByTeacherId(teacherId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getReviewById: RequestHandler = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const result = await services.getReviewById(reviewId);

    if (!result) {
      return next(createHttpError(404, 'Review not found'));
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const createReviewsForTeacher: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const teacherId = req.params.teacherId;
    const result = await services.createReviewsForTeacher(teacherId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateReviewById: RequestHandler = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const result = await services.updateReviewById(reviewId, req.body);

    if (!result) {
      return next(createHttpError(404, 'Review not found'));
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteReviewById: RequestHandler = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const result = await services.deleteReviewById(reviewId);

    if (!result) {
      return next(createHttpError(404, 'Review not found'));
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
