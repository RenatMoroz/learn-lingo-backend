import createHttpError from 'http-errors';
import { Types } from 'mongoose';
import { Reviews, ReviewsCollection } from '../database/models/reviews.js';
import { TeachersCollection } from '../database/models/teachers.js';

type CreateReviewInput = Omit<Reviews, 'teacherId'> & { teacherId?: string };

export const getAllReviews = async () => {
  return await ReviewsCollection.find();
};

export const getReviewsByTeacherId = async (teacherId: string) => {
  return await ReviewsCollection.find({ teacherId });
};

export const getReviewById = async (reviewId: string) => {
  return await ReviewsCollection.findById(reviewId);
};

export const createReviewsForTeacher = async (
  teacherId: string,
  payload: CreateReviewInput | CreateReviewInput[],
) => {
  if (!Types.ObjectId.isValid(teacherId)) {
    throw createHttpError(400, 'Invalid teacher id');
  }

  const teacher = await TeachersCollection.findById(teacherId);
  if (!teacher) {
    throw createHttpError(404, 'Teacher not found');
  }

  if (Array.isArray(payload)) {
    const normalizedPayload = payload.map(review => ({
      ...review,
      teacherId,
    }));

    return await ReviewsCollection.insertMany(normalizedPayload);
  }

  return await ReviewsCollection.create({
    ...payload,
    teacherId,
  });
};

export const updateReviewById = async (
  reviewId: string,
  data: Partial<Reviews>,
) => {
  return await ReviewsCollection.findByIdAndUpdate(reviewId, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteReviewById = async (reviewId: string) => {
  return await ReviewsCollection.findByIdAndDelete(reviewId);
};
