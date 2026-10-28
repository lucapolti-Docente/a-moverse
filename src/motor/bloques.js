let uid = 0;

export const nid = () => 'b' + (++uid);

export const hatFlag = (...body) => ({id:nid(), hat:'flag', body});

export const hatKey = (key, ...body) => ({id:nid(), hat:'key', key, body});

export const mv = n => ({id:nid(), type:'move', n});

export const cx = n => ({id:nid(), type:'cx', n});

export const cy = n => ({id:nid(), type:'cy', n});

export const fe = (...body) => ({id:nid(), type:'forever', body});

export const iff = (cond, ...body) => ({id:nid(), type:'if', cond, body});

export const kp = key => ({id:nid(), type:'keyp', key});

export const tc = color => ({id:nid(), type:'touchc', color});

export const orB = (a, b) => ({id:nid(), type:'or', a, b});

export const toO = target => ({id:nid(), type:'toucho', target});

export const bounceB = () => ({id:nid(), type:'bounce'});

export const pdirB = n => ({id:nid(), type:'pointdir', n});

export const ptoB = target => ({id:nid(), type:'pointto', target});

export const waitB = n => ({id:nid(), type:'wait', n});

export const setV = (v, n) => ({id:nid(), type:'setvar', v, n});

export const chV = (v, n) => ({id:nid(), type:'changevar', v, n});

export const eqB = (v, n) => ({id:nid(), type:'eq', v, n});

export const gtB = (v, n) => ({id:nid(), type:'gt', v, n});

export const ltB = (v, n) => ({id:nid(), type:'lt', v, n});

export const rndB = () => ({id:nid(), type:'gorandom'});

export const hideB = () => ({id:nid(), type:'hide'});

export const showB = () => ({id:nid(), type:'show'});

export const andB = (a, b) => ({id:nid(), type:'and', a, b});

export const sendB = msg => ({id:nid(), type:'broadcast', msg});

export const hatMsg = (msg, ...body) => ({id:nid(), hat:'msg', msg, body});

export const hatClone = (...body) => ({id:nid(), hat:'clone', body});

export const gotoO = target => ({id:nid(), type:'gotoobj', target});

export const cloneB = target => ({id:nid(), type:'clone', target});

export const delB = () => ({id:nid(), type:'delclone'});

export const bdB = bd => ({id:nid(), type:'switchbd', bd});

export const nextCos = () => ({id:nid(), type:'nextcos'});

export const setCos = cos => ({id:nid(), type:'setcos', cos});

export const repB = (n, ...body) => ({id:nid(), type:'repeat', n, body});

export const hatBd = (bd, ...body) => ({id:nid(), hat:'bd', bd, body});

export const V = name => ({v:name});

export const sayB = text => ({id:nid(), type:'say', text});

export const stopB = () => ({id:nid(), type:'stop'});

export const gotoB = (x, y) => ({id:nid(), type:'goto', x, y});

export const ARROWS = ['right','left','up','down'], WASD = ['w','a','s','d'];

export const TWIN = {right:'d', left:'a', up:'w', down:'s', d:'right', a:'left', w:'up', s:'down'};
