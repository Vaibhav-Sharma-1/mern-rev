import { useState, useEffect, useRef } from 'react';
import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css";
import axios from 'axios';
import { deleteUserFailed, deleteUserStart, deleteUserSuccess, signOutFailed, signOutStart, signOutSuccess, updateFailed, updateStart, updateSuccess } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const DashProfile = () => {
    const { currentUser, loading, error } = useSelector(state => state.user);
    const dispatch = useDispatch()
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({})
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
    const [userProfileUpdateSuccess, setUserProfileUpdateSuccess] = useState(false);
    const [userProfileUpdateError, setUserProfileUpdateError] = useState(null)
    const [imageUploadSuccess, setImageUploadSuccess] = useState(true);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [iamgeFileUrl, setImageFileUrl] = useState(null);
    const filePickerRef = useRef(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file))
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const uploadImage = async () => {
        setImageFileUploadError(null)
        setImageUploadSuccess(false)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name
        const storeageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storeageRef, imageFile)
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadingProgress(progress.toFixed(0))
        },
            (error) => {
                console.log(error, 'Could Nor Upload Image (File must be less than 2MB)')
                setImageFileUploadError('Could Nor Upload Image (File must be less than 2MB)')
                setImageFileUploadingProgress(null)
                setImageFileUrl(null)
                setImageFile(null)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFileUrl(downloadUrl)
                    setFormData({ ...formData, profilePicture: downloadUrl })
                    setImageUploadSuccess(true)
                })
            }
        )
    }

    const handleSubmit = async (e) => {
        setUserProfileUpdateSuccess(false)
        setUserProfileUpdateSuccess(false)
        e.preventDefault();

        if (Object.keys(formData).length === 0) {
            setUserProfileUpdateError('No Changes Found')
            return
        }
        if (!imageUploadSuccess) {
            setUserProfileUpdateError('Please Wait while image is uploading')
            return
        }

        try {
            dispatch(updateStart())
            setUserProfileUpdateError(null)
            const userData = await axios.put("/api/user/update/" + currentUser?._id, formData);
            if (!userData?.data?.error) {
                dispatch(updateSuccess(userData.data.data));
                setUserProfileUpdateSuccess(true)
            }
            console.log(userData)
        } catch (error) {
            setUserProfileUpdateError(error?.response?.data?.message || error?.message)
            return dispatch(updateFailed(error?.response?.data?.message || error?.message))
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false);

        try {
            dispatch(deleteUserStart());
            const deleteUserData = await axios.delete("/api/user/delete/" + currentUser?._id);
            if (!deleteUserData?.data?.error) {
                dispatch(deleteUserSuccess());
            }
        } catch (error) {
            return dispatch(deleteUserFailed(error?.response?.data?.message || error?.message))
        }
    }
    const handleSignOut = async () => {
        try {
            dispatch(signOutStart());
            const signOutUserData = await axios.post("/api/user/signout");
            if (!signOutUserData?.data?.error) {
                dispatch(signOutSuccess());
            }
        } catch (error) {
            return dispatch(signOutFailed(error?.response?.data?.message || error?.message))
        }
    }

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])

    return (
        <div className='max-w-lg mx-auto  p-3 w-full'>
            <h1 className='text-center text-3xl font-semibold my-7'>Profile</h1>
            <form className='flex flex-col gap-4 mb-4' onSubmit={handleSubmit}>
                <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} ref={filePickerRef} />
                <div className='relatve w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadingProgress && <CircularProgressbar value={imageFileUploadingProgress || 0} text={imageFileUploadingProgress} strokeWidth={5} styles={{ root: { width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }, path: { stroke: `rgba(62,152,199,${imageFileUploadingProgress / 100})` } }} />}
                    <img src={iamgeFileUrl || currentUser?.profilePicture} alt='user' className={`rounded-full w-full h-full object-cover border-8 boredr-[lightgray] ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && `opacity-60`}`} />
                </div>
                {imageFileUploadError &&
                    <Alert color='failure'>
                        {imageFileUploadError}
                    </Alert>
                }

                <TextInput type='text' id='username' placeholder='usernname' defaultValue={currentUser?.username} onChange={handleChange} />
                <TextInput type='text' id='email' placeholder='email' defaultValue={currentUser?.email} disabled />
                <TextInput type='password' id='password' placeholder='********' onChange={handleChange} />

                <Button type='submit' gradientDuoTone={'purpleToBlue'} outline className='' disabled={loading}>
                    {loading ? (<>
                        <Spinner size={"sm"} /><span className="pl-3">loading...</span>
                    </>) :
                        "Update"
                    }
                </Button>

                {currentUser.isAdmin && <Link to='/create-post'><Button type='button' gradientDuoTone='purpleToPink' className='w-full' >Create a post</Button></Link>}
            </form>

            {userProfileUpdateSuccess &&
                <Alert color='success'>
                    {`Profile Updated Successfully`}
                </Alert>
            }
            {userProfileUpdateError &&
                <Alert color='failure'>
                    {userProfileUpdateError}
                </Alert>
            }
            {error &&
                <Alert color='failure'>
                    {error}
                </Alert>
            }
            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursor-pointer' onClick={() => setShowModal(!showModal)}>Delete Account</span>
                <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header></Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this product?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteUser}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
        </div>
    )
}

export default DashProfile