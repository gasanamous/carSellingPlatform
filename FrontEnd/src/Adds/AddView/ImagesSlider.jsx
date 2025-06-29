import Carousel from 'react-bootstrap/Carousel';
import '../Font.css'

function Slider({ images }) {
    return (
        <Carousel>
            {
                images.map((currenImage,index) => (
                    <Carousel.Item key={`carousal-img-${index}`} className='carousel-item'>
                        <img key={`img-${index}`} className='img-slide' src={currenImage} alt="img" />
                    </Carousel.Item>
                ))
            }
        </Carousel>
    );
}
export default Slider;