import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  owner: { type: String, required: true, index: true }, tokenHash: { type: String, required: true }, openedEvidenceIds: { type: [String], default: [] },
  verdict: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

export default mongoose.model('InvestigationSession', sessionSchema);
