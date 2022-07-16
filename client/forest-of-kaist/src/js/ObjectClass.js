import { mapClass } from "./Map";

class ObjectClass { 
  constructor(size, pos, img, type = null, id = null) {
    this.size = { width: size.width, height: size.height };
    if (pos === "center") this.pos = this.getCenterPos();
    else this.pos = { x: pos.x, y: pos.y };
    this.img = img;
    this.type = type;
    this.id = id;
  }

  setId(id) {
    this.id = id;
  }
  
  getCenterPos() {
    return {
      x: mapClass.size.width / 2 - this.size.width / 2, 
      y: mapClass.size.height / 2 - this.size.height / 2
    };
  }
}

export default ObjectClass;
