import { MOVEW_S } from './programas.js';

export const BUG = (x, y, program) => ({name:'Bichito', kind:'bug', x, y, program});

export const WASP = (name, x, y, program, dir=90, color='#7A4DD8') => ({name, kind:'wasp', x, y, dir, program, color});

export const COIN = (x, y, program) => ({name:'Moneda', kind:'coin', x, y, program, color:'#E0A100'});

export const HEART = (x, y, program) => ({name:'Corazón', kind:'heart', x, y, program, color:'#E11D48'});

export const SEED = (x, y, program) => ({name:'Semilla', kind:'seed', x, y, program, color:'#8B5A2B', hidden:true});

export const BAG = (x, y, program) => ({name:'Bolsa', kind:'bag', x, y, program, color:'#A16207'});

export const SWORD = (x, y, program) => ({name:'Espada', kind:'sword', x, y, program, color:'#94A3B8', hidden:true});

export const SHIP = (x, y, program) => ({name:'Nave', kind:'ship', x, y, program, color:'#6D28D9', hidden:true});

export const WASPH = (name, x, y, program, hidden, color) => Object.assign(WASP(name, x, y, program, 90, color || '#7A4DD8'), {hidden: !!hidden});

export const STAGE = (program) => ({name:'Escenario', kind:'stage', x:0, y:0, program, color:'#64748B'});

export const BUGW = (extra=[]) => BUG(-200,-150, () => [MOVEW_S(), ...extra]);

export const BUGC = (x, y, program, cos='paso 1') => Object.assign(BUG(x, y, program), {costume:cos});
