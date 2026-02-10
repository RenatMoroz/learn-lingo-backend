import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

const teachersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    surname: {
      type: String,
      required: true,
    },
    languages: {
      type: Array,
      default: [],
    },
    levels: {
      type: Array,
      default: [],
    },
    rating: {
      type: Number,
      required: true,
    },

    price_per_hour: {
      type: Number,
      required: true,
    },
    lessons_done: {
      type: Number,
      default: 0,
      required: true,
    },
    avatar_url: {
      type: String,
    },
    lesson_info: {
      type: String,
    },

    conditions: {
      type: Array,
      default: [],
    },
    experience: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export type Teachers = InferSchemaType<typeof teachersSchema>;
export type TeachersDocument = HydratedDocument<Teachers>;

export const TeachersCollection = model<Teachers>('teachers', teachersSchema);
