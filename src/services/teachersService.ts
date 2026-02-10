import { FilterQuery } from 'mongoose';
import { Teachers, TeachersCollection } from '../database/models/teachers.js';
import { GetAllTeachersParams } from '../types/teachers.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllTeachers = async (filters: GetAllTeachersParams) => {
  const { page = 1, perPage = 10 } = filters;
  const offset = (page - 1) * perPage;
  const query: FilterQuery<Teachers> = {};
  if (filters.languages) {
    const values = filters.languages
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    query.languages = { $in: values.length ? values : [filters.languages] };
  }
  if (filters.levels) {
    const values = filters.levels
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    query.levels = { $in: values.length ? values : [filters.levels] };
  }
  if (filters.price_per_hour) {
    query.price_per_hour = { $lte: filters.price_per_hour };
  }

  try {
    const totalTeachers = await TeachersCollection.countDocuments(query);
    const teachersList = await TeachersCollection.find(query)
      .skip(offset)
      .limit(perPage);

    const paginationInfo = calculatePaginationData(
      totalTeachers,
      page,
      perPage,
    );

    return {
      ...paginationInfo,
      teachers: teachersList,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error('Error fetching teachers: ' + message);
  }
};

export const createTeacher = async (body: Teachers) => {
  const result = TeachersCollection.create(body);
  return result;
};

export const getTeacherById = async (teacherId: string) => {
  try {
    return await TeachersCollection.findById(teacherId);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error('Error fetching teacher: ' + message);
  }
};

export const updateTeacherById = async (
  teacherId: string,
  data: Partial<Teachers>,
) => {
  try {
    return await TeachersCollection.findByIdAndUpdate(teacherId, data, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error('Error updating teacher: ' + message);
  }
};

export const deleteTeacherById = async (teacherId: string) => {
  try {
    return await TeachersCollection.findByIdAndDelete(teacherId);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error('Error deleting teacher: ' + message);
  }
};
