import ObjectClass from "./ObjectClass";

const imgList = {
  down1: "/images/user_down_1.png",
  down2: "/images/user_down_2.png",
  left1: "/images/user_left_1.png",
  left2: "/images/user_left_2.png",
  up1: "/images/user_up_1.png",
  up2: "/images/user_up_2.png",
  right1: "/images/user_right_1.png",
  right2: "/images/user_right_2.png"
}

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
}

const user = new CharacterObj({width: 2, height: 2}, "center", imgList, "nupjuk");

export { user };