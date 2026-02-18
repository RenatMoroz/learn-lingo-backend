import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

const reviewsSchema = new Schema(
  {
    reviewer_name: {
      type: String,
      required: true,
    },
    reviewer_rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'teachers',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export type Reviews = InferSchemaType<typeof reviewsSchema>;
export type ReviewsDocument = HydratedDocument<Reviews>;

export const ReviewsCollection = model<Reviews>('reviews', reviewsSchema);
