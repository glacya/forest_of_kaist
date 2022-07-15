class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ObjectClass { 
    constructor(size, pos, img, id, user = false) {
      this.size = { width: size.width, height: size.height };
      if (pos === "center") this.pos = this.getCenterPos();
      else this.pos = { x: pos.x, y: pos.y };
      this.id = id;
      this.img = img;
      this.user = user;
    }
    
    getCenterPos() {
      return {
        x: mapClass.size.width / 2 - this.size.width / 2, 
        y: mapClass.size.height / 2 - this.size.height / 2
      };
    }
}

class BuildingObj extends ObjectClass {
    constructor(size, pos, img, id, name) {
      super(size, pos, img, id);
      this.name = name;
    }
}

exports.Point = Point;
exports.ObjectClass = ObjectClass;
exports.BuildingObj = BuildingObj;