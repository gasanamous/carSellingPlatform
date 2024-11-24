//npm install react-masonry-css
import Masonry from "react-masonry-css";
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Tooltip } from "@mui/material";
export default function CarImagesViewer({ images, deleteImage }) {

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    };

    const removeIconProps = {
        sx: {
            position: 'absolute',
            top: 2,
            right: 2,
            bgcolor: 'white',
            ':hover': { bgcolor: 'white' }
        }
    }

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', margin: '0 auto', padding : '10px', border : 'solid 1px lightgray' }}
        >
            {images.map((image, index) => (
                <div key={index} style={{ width: '100%', marginBottom: '10px', position: 'relative' }}>
                    <Tooltip title='remove' placement='top'>
                        <IconButton {...removeIconProps} size="small" onClick={() => deleteImage(image)}>
                            <RemoveIcon htmlColor="red" fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <img src={image} alt={`Image ${index}`} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                </div>
            ))}
        </Masonry>
    );
}