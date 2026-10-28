export const COLORS = {goal:{hex:'#22B04B', name:'verde'}, lava:{hex:'#E5322D', name:'rojo'}, wall:{hex:'#55606E', name:'gris'}, mud:{hex:'#9A6B3F', name:'marrón'}, ice:{hex:'#8FDDF7', name:'celeste'}};

export const R_ = (x0, y0, x1, y1, c) => ({x0, y0, x1, y1, c});

export const BD = {
  pasto:{bg:'#E8F5DD', dot:'#C9E4B6', map:[R_(-20,-180,10,40,'wall'), R_(172,-40,236,40,'goal')]},
  arena:{bg:'#F8ECCF', dot:'#E8D3A2', map:[R_(-120,-60,-90,180,'wall'), R_(140,-80,240,60,'wall'), R_(0,-180,60,-30,'lava'), R_(172,110,236,174,'goal')]},
  noche:{bg:'#1F2A44', dot:'#34446A', dark:true, map:[R_(-110,-180,-80,80,'wall'), R_(10,-80,40,180,'wall'), R_(-80,-40,-40,10,'lava'), R_(100,-40,150,0,'lava'), R_(172,-176,236,-110,'goal')]},
};

export const BD_FREE = Object.assign({'vacío':{bg:'#F8FCF9', dot:'#DCE8E0', map:[]}}, BD);
