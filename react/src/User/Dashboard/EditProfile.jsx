import { useState } from "react";
import { Button } from "@mui/material";
import serverIP from "../../config";
import Form from "../Register/Form";
import Save from "@mui/icons-material/Save";
import axios from "axios";
import swal from "sweetalert";
import SweetAlert2 from "react-sweetalert2";
import { LoadingButton } from "@mui/lab";
export default function EditProfile({ user }) {

    const [formData, setFormData] = useState({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        city: user.city,
        phoneNumber: user.phoneNumber.slice(2),
    })

    const [profile_img, setProfileImage] = useState(user.profile_img)
    const [submitImageLoading, setSubmitImageLoading] = useState(false)

    const url = `${serverIP.ip}/user/edit`
    const nextUrl = `${serverIP.clientIP}/user/profile`

    const handleChangeImage = (evt) => {
        const file = evt.target.files[0];

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = function handleOnLoadEnd(evt) {
            setProfileImage(evt.target.result)
        }

    }

    const changeProfileImage = async (e) => {
        axios.defaults.withCredentials = true
        setSubmitImageLoading(true)
        try {
            const response = await axios.post(`${serverIP.ip}/user/editProfileImage`, { profile_img: profile_img })
            swal({
                icon: 'success',
                text: response.data.successMessage
            })
            setSubmitImageLoading(false)
        } catch (responseError) {
            console.log(responseError)
            if (responseError.response.status == 500) {
                swal({
                    icon: 'error',
                    text: responseError.response.data.errors
                })
            }
        }
        setSubmitImageLoading(false)
    }

    const loadingButtonProps = {
        sx: {
            backgroundColor: 'green',
            textTransform: 'none',
            padding: 1,
            ':hover': { backgroundColor: '#006400' },
            borderRadius: '0',
            marginTop: 1,
        },


    }
    return (
        <>
          <h3>Profile settings</h3>
            
            <div className="profileHeader" style={{ border: 'solid 1px lightgray' }}>
                <div className="profile-img-box">
                    <img className="profile-img" src={profile_img} alt="" />
                </div>
                <div className="">
                    <Button
                        sx={{ textTransform: 'none', mt: 1, display: 'block' }}
                        onClick={() => document.getElementById('upload-btn').click()}>
                        Edit Your Photo
                    </Button>
                </div>
                <div style={{ padding: 10, width: '100%', position: 'relative', textAlign: 'right' }}>
                    <LoadingButton disabled={profile_img == user.profile_img} loading={submitImageLoading} style={{ textTransform: 'none' }} onClick={changeProfileImage} variant="contained" endIcon={<Save />}>Save</LoadingButton>
                </div>
            </div>

            <div id='edit-form'>
                <Form
                    initialData={formData}
                    url={url}
                    nextUrl={nextUrl}
                    submitButtonLabel='Save'
                    submitButtonEndIcon={<Save />}
                    headerDescription="Edit personal information"
                />
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-btn"
                    onChange={handleChangeImage}
                />

            </div>
        </>

    )

}
