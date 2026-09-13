import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, length: 6 },
    host: { type: String, required: true },
    hostSocketId: { type: String, default: null },
    viewer: { type: String, default: null },
    viewerSocketId: { type: String, default: null },
    status: { type: String, enum: ['waiting', 'paired', 'ended'], default: 'waiting' },
  },
  { timestamps: true }
);

sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200 });

export default mongoose.model('Session', sessionSchema);
