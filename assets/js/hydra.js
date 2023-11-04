var hydra = new Hydra({ detectAudio: false })

let mouseXCord = 0;
document.body.addEventListener('mousemove', function(e){
  mouseXCord = e.clientX;
})

osc(10, 0.5, 0.001)
    .kaleid(10)
    .color(1, .5, 0.2)
    .colorama(() => mouseXCord * 0.0005)
    .rotate(10, () => mouseXCord)
    .modulateRotate(o0, () => mouseXCord * 0.00001, 0.001)
    .modulate(o0, 1)
.out(o0)



// osc(5, 0.5, 0.001)
// .kaleid([3,4,5,7,8,9,10].fast(0.1))
// // .color(0.5, 0.3)
// // .colorama(0.4)
// // .rotate(0.009,()=>Math.sin(time)* -0.001 )
// // .modulateRotate(o0,()=>Math.sin(time) * 0.003)
// // .modulate(o0, 0.9)
// // .scale(0.9)
// .out(o0)