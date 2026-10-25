import { z } from 'zod';

const short = z.string().min(1);
export const generatedCaseSchema = z.object({
  title: z.string().min(3).max(100), summary: z.string().min(20), incident: z.string().min(30),
  suspects: z.array(z.object({ id: short, name: short, role: short, ageRange: z.string().optional().default('Adult'), motive: short, alibi: short, personality: short, avatar: z.string().optional().default('') })).length(4),
  evidence: z.array(z.object({ id: short, type: z.enum(['message','witness','photo','cctv','document','physical','digital']), title: short, description: short, timestamp: short, participants: z.array(z.string()).optional().default([]), content: z.string().optional().default(''), location: z.string().optional().default(''), clue: z.string().optional().default('') })).min(8),
  timeline: z.array(z.object({ time: short, event: short, relatedEvidenceIds: z.array(z.string()).default([]) })).min(4),
  solution: z.object({ culpritId: short, motive: short, method: short, explanation: short, reconstruction: z.string().min(20), keyEvidenceIds: z.array(z.string()).min(2) }),
});

export function validateGeneratedCase(data) {
  const parsed = generatedCaseSchema.parse(data);
  const suspectIds = parsed.suspects.map(s => s.id);
  const evidenceIds = parsed.evidence.map(e => e.id);
  if (new Set(suspectIds).size !== 4 || new Set(evidenceIds).size !== evidenceIds.length) throw new Error('Generated IDs must be unique');
  if (!suspectIds.includes(parsed.solution.culpritId)) throw new Error('Culprit must match a suspect');
  if (parsed.evidence.filter(e => e.type).map(e => e.type).filter((x, i, a) => a.indexOf(x) === i).length < 3) throw new Error('At least three evidence types are required');
  if (parsed.solution.keyEvidenceIds.some(id => !evidenceIds.includes(id))) throw new Error('Solution references missing evidence');
  if (parsed.timeline.some(item => item.relatedEvidenceIds.some(id => !evidenceIds.includes(id)))) throw new Error('Timeline references missing evidence');
  return parsed;
}
