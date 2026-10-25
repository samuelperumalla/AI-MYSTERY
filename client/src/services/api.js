const BASE=import.meta.env.VITE_API_BASE_URL||'http://localhost:5000/api/v1';
function playerId(){let id=localStorage.getItem('amr-player-id');if(!id){id=crypto.randomUUID();localStorage.setItem('amr-player-id',id);}return id;}
function playerToken(){let token=localStorage.getItem('amr-player-token');if(!token){token=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');localStorage.setItem('amr-player-token',token);}return token;}
export function getPlayerId(){return playerId();}
function sessionToken(caseId){return sessionStorage.getItem(`amr-token-${caseId}`);}
export function saveSession(caseId,data){sessionStorage.setItem(`amr-token-${caseId}`,data.token);sessionStorage.setItem(`amr-session-${caseId}`,data.sessionId);}
export function getSession(caseId){return {token:sessionToken(caseId),sessionId:sessionStorage.getItem(`amr-session-${caseId}`)};}
async function request(path,{body,caseScoped=false,sessionScoped=false,...options}={}){const headers={'Content-Type':'application/json','x-player-id':playerId(),'x-player-token':playerToken(),...options.headers};if(sessionScoped){headers['x-session-token']=sessionToken(caseScoped);}
  const response=await fetch(`${BASE}${path}`,{...options,headers,body:body?JSON.stringify(body):undefined});let json;try{json=await response.json();}catch{throw new Error('The server returned an unreadable response.');}if(!response.ok)throw Object.assign(new Error(json?.error?.message||'Request failed.'),{status:response.status,code:json?.error?.code,data:json?.data});return json.data;}
export const createMystery=payload=>request('/cases',{method:'POST',body:payload});
export const getCase=id=>request(`/cases/${id}`);
export const getHistory=()=>request('/cases');
export async function createSession(caseId){const result=await request(`/cases/${caseId}/sessions`,{method:'POST'});saveSession(caseId,result);return result;}
export const markEvidenceOpened=(caseId,sessionId,evidenceId)=>request(`/cases/${caseId}/sessions/${sessionId}/evidence/${evidenceId}/open`,{method:'POST',caseScoped:caseId,sessionScoped:true,body:{}});
export const submitAccusation=(caseId,sessionId,payload)=>request(`/cases/${caseId}/sessions/${sessionId}/accusation`,{method:'POST',caseScoped:caseId,sessionScoped:true,body:payload});
export const getVerdict=(caseId,sessionId)=>request(`/cases/${caseId}/sessions/${sessionId}/verdict`,{caseScoped:caseId,sessionScoped:true});
