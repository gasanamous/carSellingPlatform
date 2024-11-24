import ImagePreview from './ImagePreview';
import * as react from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './Upload.css'
import axios from 'axios';
import { Alert, AlertTitle, Button, styled, Divider } from '@mui/material/';
import { useNavigate, useLocation } from "react-router-dom";
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';

const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),
    },
    margin: 15,
    colorAdjust: 'exact'
}));

export default function Upload() {
    const location = useLocation()
    const navigate = useNavigate()
    const [image, setImage] = react.useState('https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg')
    const [loaded, setLoaded] = react.useState(true)

    axios.defaults.withCredentials = true;

    const handleImageChanges = (evt) => {
        const image = evt.target.files[0]
        const reader = new FileReader()

        reader.readAsDataURL(image)

        reader.onloadstart = function hanleOnLoadStart() {
            setLoaded(false)
        }

        reader.onloadend = function handleOnLoadEnd(evt) {
            setImage(evt.target.result)
            setLoaded(true)
        }

    }
    const handleSubmit = async (evt) => {
        evt.preventDefault()

        navigate('/signup/activate' , {replace :true, state : location.state})
    }

    return (
        <>
            <form id='upload-form' encType="multipart/form-data">

                <div id="header">
                    {<h2>Hey, {location.state.formData.firstname} </h2>}
                    <p>Welcome to our platform! Your profile image helps personalize your experience and makes it easier for others to recognize you. Please upload a clear and appropriate image that represents you professionally or personally.</p>
                    <p><strong>Guidelines for Profile Images:</strong></p>
                    <ul>
                        <li>Use a high-quality image that clearly shows your face or the subject you want to represent.</li>
                        <li>Choose a professional or appropriate image that aligns with the purpose of your profile.</li>
                        <li>Avoid using images with offensive, inappropriate, or copyrighted content.</li>
                    </ul>
                    <p>If you encounter any issues during the upload process, feel free to reach out to our support team for assistance.</p>
                </div>

                <fieldset>
                    <legend>
                        Profile Picture
                    </legend>
                    <ImagePreview src={image} loaded={loaded} />

                    <Button
                        component="label"
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        id='file-input'
                    >
                        Upload image
                        <VisuallyHiddenInput onChange={handleImageChanges} type="file" name='profimg' />
                    </Button>

                    <Root >
                        <Divider>OR</Divider>
                    </Root>

                    <LoadingButton
                        onClick={handleSubmit}
                        endIcon={<SendIcon />}

                        loadingPosition="end"
                        variant="contained"
                        sx={{ backgroundColor: 'green' }}
                        id='btn'
                    >
                        <span>REGISTER</span>
                    </LoadingButton>                        </fieldset>



                <Alert className="alert" severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Error while uploading a profile image, Try again
                </Alert>
            </form>
        </>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    top: 5,
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
});