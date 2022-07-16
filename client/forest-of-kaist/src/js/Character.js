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

<<<<<<< HEAD
const user = new CharacterObj({width: 2, height: 2}, "center", imgList, "nupjuk");
=======
const user = new CharacterObj({width: 2, height: 2}, {x: 50.0, y: 50.0}, imgList, "nupjuk", true);

// function Character() {
//   const [posImg, setPosImg] = useState({
//     pos: user.pos,
//     img: user.img.down1
//   });
  
//   // For cashing images
//   const [isLoading, setIsLoading] = useState(true);
//   useEffect(() => {
//     const imgs = Object.values(imgList);
//     cacheImages(imgs);
//   }, []);
//   const cacheImages = async (srcArray) => {
//     const promises = await srcArray.map((src) => {
//       return new Promise(function (resolve, reject) {
//         const img = new Image();
        
//         img.src = src;
//         img.onload = resolve();
//         img.onerror = reject();
//       });
//     });
//     await Promise.all(promises);
//     setIsLoading(false);
//   };
  
  
//   const imgElement = React.createElement(
//     "img",
//     { 
//       src: posImg.img,
//       alt: character.name, 
//       width: mapClass.unitToPx(character.size.width),
//       height: mapClass.unitToPx(character.size.height),
//       style: { position: "absolute", left: view.unitposToPxpos(posImg.pos).x, top: view.unitposToPxpos(posImg.pos).y}
//     }
//   )
//   return (
//     <div>
//       { isLoading ? "Loading image ..." : imgElement }
//     </div>
//   );
// }
>>>>>>> 81549f509c1bc5715f81c914127e5fe0e7e900eb

export { user };