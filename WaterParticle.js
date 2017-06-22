function Particle(pos)
{
    this.pos = pos;
    this.speed = new Vector2(0, 0);
    this.force = new Vector2(0, 0);
    this.neighbors = [];
    this.desity = 0;
    this.pressure = 0;
    this.color = "rgba(255,255,255,1)";
}

Particle.prototype.update = function (box, borderWidth)
{
    this.speed.setAdd(this.force);
    this.pos.setAdd(this.speed);

    var relPos = new Vector2(this.pos.x - box.x, this.pos.y - box.y);
    //以box中心，box的边为坐标轴，vw，vh为距边的长度
    var vw = relPos.dot(box.axisX);
    var vh = relPos.dot(box.axisY);

    var left = -box.width / 2 + borderWidth;
    var top = -box.height / 2 + borderWidth;
    var right = box.width / 2 - borderWidth;
    var bottom = box.height / 2 - borderWidth;

    var hitFlg = false;
    var p;
    var out1 = new Vector2(0, 0);
    var out2 = new Vector2(0, 0);

    if (vw < left || vw > right) 
    {
        hitFlg = true;
        p = box.axisY.clone();
        p.scale(this.speed.dot(p));
        this.speed = p.scale(2).sub(this.speed);
        out1 = relPos.clone().normalize();
        out1.scale(Math.abs(vw) - right);
    }
    if (vh < top || vh > bottom) 
    {
        hitFlg = true;
        p = box.axisX.clone();
        p.scale(this.speed.dot(p));
        this.speed = p.scale(2).sub(this.speed);
        out2 = relPos.clone().normalize();
        out2.scale(Math.abs(vh) - bottom);
    }
    if (hitFlg)
    {
        this.pos.setSub(out1);
        this.pos.setSub(out2);
        // this.speed.scale(0.99);
    }
}

Particle.prototype.draw = function (ctx)
{
    var str = "rgba(255,255,255,1)";
    ctx.fillStyle = str;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 4, 0, Math.PI * 2, false);
    ctx.fill();
}

