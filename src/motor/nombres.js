import { S } from '../estado.js';
import { createdVars } from '../estado.js';

export const msgNames = () => S.L.msgs || ['atrapada'];

export const cosNames = () => S.L.costumes || ['paso 1','paso 2','feliz','dolor'];

export const bdNames = () => S.L.bdOrder || ['pasto','arena','noche'];

export const varNames = () => [...(S.L.varNames || Object.keys(S.L.vars || (S.L.allowCreateVar ? {} : {puntos:0}))), ...(createdVars[S.L.id] || [])];

export function otherNames(){ const me = S.sprites[S.curSp]; return S.sprites.filter(o => o !== me && o.kind !== 'stage' && !o.isClone).map(o => o.name).filter(Boolean); }
