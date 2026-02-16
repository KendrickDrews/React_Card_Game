import lineart from '../assets/SpriteTest_1/SpriteTest_1_LineArt.png'
import eye from '../assets/SpriteTest_1/SpriteTest_1_Eye.png'
import main from '../assets/SpriteTest_1/SpriteTest_1_Main.png'
import socks from '../assets/SpriteTest_1/SpriteTest_1_Socks.png'
import back from '../assets/SpriteTest_1/SpriteTest_1_Top.png'
import under from '../assets/SpriteTest_1/SpriteTest_1_Under.png'
import lineartSVG from '../assets/SpriteTest_1/SpriteTest_1_LineArt.svg'
import './Cricket.scss'
  
const Cricket = ({width}:{width: number}) => {
  


  // To make the hover better, give the card container a child container which moves up on hover
    return (
    <div style={{width: width}} className="character-img-container">
        <img width={width} className="unit-img" style={{}} src={eye} />
        <img width={width} className="unit-img"  src={main} />
        <img width={width} className="unit-img"  src={socks} />
        <img width={width} className="unit-img"  src={back} />
        <img width={width} className="unit-img"  src={under} />
        {/* <img width={width} className="unit-img"  src={lineart} /> */}
        <img width={width} className="unit-img"  src={lineartSVG} />
    </div>
      
    )
  }
  
  export default Cricket
  