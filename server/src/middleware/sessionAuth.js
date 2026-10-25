import crypto from 'node:crypto';
import mongoose from 'mongoose';
import InvestigationSession from '../models/InvestigationSession.js';

const hash = token => crypto.createHash('sha256').update(token).digest('hex');
export async function requireSession(req, res, next) {
  try {
    const token = req.get('x-session-token');
    if (!token) return res.status(401).json({ success:false, data:null, error:{code:'SESSION_REQUIRED',message:'Investigation session authorization is required.'} });
    if (!mongoose.isValidObjectId(req.params.sessionId)) return res.status(403).json({ success:false, data:null, error:{code:'SESSION_DENIED',message:'Session access was denied.'} });
    const session = await InvestigationSession.findById(req.params.sessionId);
    if (!session || session.tokenHash !== hash(token)) return res.status(403).json({ success:false, data:null, error:{code:'SESSION_DENIED',message:'Session access was denied.'} });
    req.investigationSession = session; next();
  } catch (e) { next(e); }
}
export function issueToken() { const token = crypto.randomBytes(32).toString('base64url'); return { token, tokenHash: hash(token) }; }
