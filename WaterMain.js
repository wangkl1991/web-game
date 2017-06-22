var particles = [];
var ctx;
var canvas;
var createFlg = false;
var rotateFlg = false;
var box;

var RANGE = 35;
var DESITY = 1.3;
var K = 1;
var PRESSURE = 25;
var VISCOSITY = 0.1;
var MAX = 600;

function main()
{

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //two envents
    window.addEventListener('keydown', onKeydown);
    canvas.addEventListener('mousemove', onBoom);

    var axisX = new Vector2(1, 0);
    var axisY = new Vector2(0, 1);

    box = new ContainBox(canvas.width / 2, canvas.height / 2, 500, 500, axisX, axisY);
    onFrame();
}

function onKeydown(ev)
{
    if (ev.keyCode === 32)
    {
        createFlg = !createFlg;
    }
    if (ev.keyCode === 82)
    {
        rotateFlg = !rotateFlg;
    }
}

function onBoom(ev)
{
    var clickX = ev.clientX;
    var clickY = ev.clientY;
    var click = new Vector2(clickX, clickY);
    for (var i = 0; i < particles.length; i++)
    {
        var p = particles[i];
        var dis = click.sub(p.pos);
        if (dis.getLen() < 40)
        {
            dis.normalize();
            p.speed.setAdd(dis.scale(-5));
        }
    }
}

function renderBg()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.font = '25px serif';
    var str = "sapce：" + (createFlg ? "stop creating" : "creat particle");
    str += "  R:" + (rotateFlg ? "stop rotating" : "rotate box");
    str += "  particle number:" + particles.length + "/" + MAX;
    ctx.fillText(str, 10, 50);
}


function createParticle()
{
    if (particles.length < MAX)
    {
        var pos = new Vector2(box.x, box.y);
        var p = new Particle(pos);
        var angle = Math.random() * Math.PI * 2;
        p.speed.x = Math.cos(angle);
        p.speed.y = Math.sin(angle);
        particles.push(p);
    }
}




function onFrame()
{
    renderBg();
    if (rotateFlg)
    {
        box.rotate(box.rotation + 0.5);
    }
    if (createFlg)
    {
        createParticle();
    }
    calParticle();

    box.render(ctx);
    for (var i = 0; i < particles.length; i++)
    {
        //g
        particles[i].force.y += 0.2;
        particles[i].update(box, 10);
        particles[i].draw(ctx);
    }
    requestAnimationFrame(onFrame);
}

function calParticle()
{
    var i, j, pi, pj, dis, w;
    //desity  w = (1- r/h)^2
    for (i = 0; i < particles.length; i++)
    {
        pi = particles[i];
        pi.desity = 0;
        pi.neighbors = [];
        for (j = 0; j < i; j++)
        {
            pj = particles[j];
            dis = pj.pos.sub(pi.pos).getLen();
            if (dis < RANGE)
            {
                w = Math.pow(1 - dis / RANGE, 2);
                pi.desity += w;
                pj.desity += w;
                pi.neighbors.push(pj);
                pj.neighbors.push(pi);
            }
        }
    }
    //single pressure   p = ρK
    for (i = 0; i < particles.length; i++)
    {
        pi = particles[i];
        if (pi.desity < DESITY)
        {
            pi.desity = DESITY;
        }
        pi.pressure = (pi.desity - DESITY) * K;
    }

    //result pressure  
    //w = (1- r/h)
    //Fp = w * (pi.pressure + pj.pressure) / 2 * pj.desity * PRESSURE    
    for (i = 0; i < particles.length; i++)
    {
        pi = particles[i];
        pi.force.x = 0;
        pi.force.y = 0;
        for (j = 0; j < pi.neighbors.length; j++)
        {
            pj = pi.neighbors[j];
            dis = pi.pos.sub(pj.pos).getLen();
            w = 1 - dis / RANGE;
            var Fp = w * (pi.pressure + pj.pressure) / (2 * pj.desity) * PRESSURE;
            pi.force.x += ((pi.pos.x - pj.pos.x) / dis * Fp);
            pi.force.y += ((pi.pos.y - pj.pos.y) / dis * Fp);

            //粘稠阻力
            var viscosity = w / pj.desity * VISCOSITY;
            var dv = pi.speed.sub(pj.speed);
            pi.force.x -= dv.x * viscosity;
            pi.force.y -= dv.y * viscosity;
        }
    }
}



