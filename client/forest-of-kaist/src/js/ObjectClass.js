import { mapClass } from "./Map";

const objList = [];

class ObjectClass { 
  constructor(size, pos, img, user = false) {
    this.size = { width: size.width, height: size.height };
    if (pos === "center") this.pos = this.getCenterPos();
    else this.pos = { x: pos.x, y: pos.y };
    this.img = img;
    if (!user) objList.push(this);
    console.log(objList);
  }
  
  getCenterPos() {
    return {
      x: mapClass.size.width / 2 - this.size.width / 2, 
      y: mapClass.size.height / 2 - this.size.height / 2
    };
  }
}

export default ObjectClass;