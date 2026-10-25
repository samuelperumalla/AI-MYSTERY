import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true }, category: { type: String, required: true }, difficulty: { type: String, required: true }, status: { type: String, enum: ['ready'], default: 'ready' },
  summary: { type: String, required: true }, incident: { type: String, required: true }, suspects: { type: [mongoose.Schema.Types.Mixed], required: true }, evidence: { type: [mongoose.Schema.Types.Mixed], required: true }, timeline: { type: [mongoose.Schema.Types.Mixed], required: true },
  solution: { type: mongoose.Schema.Types.Mixed, required: true }, sessionOwner: { type: String, required: true, index: true }, playerTokenHash: { type: String, required: true }, requestId: { type: String, required: true, unique: true },
}, { timestamps: true, minimize: false });

export default mongoose.model('Case', caseSchema);
