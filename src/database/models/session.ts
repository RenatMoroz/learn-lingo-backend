import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Number,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export type Session = InferSchemaType<typeof sessionSchema>;
export type SessionDocument = HydratedDocument<Session>;

export const SessionsCollection = model<Session>('sessions', sessionSchema);
