function Vector2(x, y)
{
    this.x = x;
    this.y = y;
}

Vector2.prototype.dot = function (p)
{
    return this.x * p.x + this.y * p.y;
}

Vector2.prototype.add = function (p)
{
    var rtn = new Vector2(this.x + p.x, this.y + p.y);
    return rtn;
}

Vector2.prototype.setAdd = function (p)
{
    this.x += p.x;
    this.y += p.y;
    return this;
}

Vector2.prototype.setSub = function (p)
{
    this.x -= p.x;
    this.y -= p.y;
    return this;
}

Vector2.prototype.sub = function (p)
{
    var rtn = new Vector2(this.x - p.x, this.y - p.y);
    return rtn;
}

Vector2.prototype.scale = function (p)
{
    this.x *= p;
    this.y *= p;
    return this;
}

Vector2.prototype.getLen2 = function ()
{
    return (this.x * this.x + this.y * this.y);
}

Vector2.prototype.getLen = function()
{
    return Math.sqrt(this.getLen2());
}

Vector2.prototype.normalize = function()
{
    var l = this.getLen();
    this.x /= l;
    this.y /= l;
    return this;
}

Vector2.prototype.clone = function()
{
    var r = new Vector2(this.x,this.y);
    return r;
}
