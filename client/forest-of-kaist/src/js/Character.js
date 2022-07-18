import ObjectClass from "./ObjectClass";

const imgPath = "/images/user_down_1.png";

class CharacterObj extends ObjectClass {
  constructor(size, pos, img, name) {
    super(size, pos, img, "character");
    this.name = name;
  }
  
  speed = 0.1;
  
  left(pos) {
    return {
      x: parseFloat((pos.x - this.speed).toFixed(1)),
      y: pos.y
    };
  }
  right(pos) {
    return {
      x: parseFloat((pos.x + this.speed).toFixed(1)),
      y: pos.y
    };
  }
  up(pos) {
    return {
      x: pos.x,
      y: parseFloat((pos.y - this.speed).toFixed(1))
    };
  }
  down(pos) {
    return {
      x: pos.x,
      y: parseFloat((pos.y + this.speed).toFixed(1))
    };
  }
  
  setPos(pos) {
    this.pos = { x: pos.x.toFixed(1), y: pos.y.toFixed(1) };
  }
  
  setImg(img) {
    this.img = img;
  }
}

const user = new CharacterObj({width: 2, height: 2}, "center", imgPath, "nupjuk");

export { user };