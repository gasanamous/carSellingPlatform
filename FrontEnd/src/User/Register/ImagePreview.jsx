import Loader from './Loader'
import './Loader.css'
export default function ImagePreview(props) {
    return (
        <div id='img-preview'>
            {(!props.loaded && <Loader />) || (props.loaded && props.src && <img src={props.src} alt="" />)}
        </div>
    );
}