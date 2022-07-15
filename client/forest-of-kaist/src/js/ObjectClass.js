import { mapClass } from "./Map";

const objList = [];

class ObjectClass { 
  constructor(size, pos, img, user = false, id = null) {
    this.size = { width: size.width, height: size.height };
    if (pos === "center") this.pos = this.getCenterPos();
    else this.pos = { x: pos.x, y: pos.y };
    this.img = img;
    if (!user) objList.push(this);
    this.id = null;
    console.log(objList);
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
