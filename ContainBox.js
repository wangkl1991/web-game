function ContainBox(x, y, width, height, axisX, axisY)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.axisX = axisX;
    this.axisY = axisY;
    this.rotation = 0;
}

ContainBox.prototype.rotate = function (r)
{
    this.rotation = r;
    var cos = Math.cos(r / 180 * Math.PI);
    var sin = Math.sin(r / 180 * Math.PI);
    this.axisX.x = cos;
    this.axisX.y = sin;
    this.axisY.x = -sin;
    this.axisY.y = cos;
}


ContainBox.prototype.render = function (ctx)
{
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    var vx = new Vector2(this.axisX.x, this.axisX.y);
    var vy = new Vector2(this.axisY.x, this.axisY.y);
    var w = vx.scale(this.width / 2);
    var h = vy.scale(this.height / 2);
    var negW = new Vector2(-w.x, -w.y);

    var p1 = h.sub(w);
    var p2 = h.add(w);
    var p3 = w.sub(h);
    var p4 = negW.sub(h);
    ctx.moveTo(p1.x + this.x, p1.y + this.y);
    ctx.lineTo(p2.x + this.x, p2.y + this.y);
    ctx.lineTo(p3.x + this.x, p3.y + this.y);
    ctx.lineTo(p4.x + this.x, p4.y + this.y);
    ctx.lineTo(p1.x + this.x, p1.y + this.y);
    ctx.stroke();
}