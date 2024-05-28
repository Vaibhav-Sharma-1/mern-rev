import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, FileInput, Select, Spinner, TextInput } from "flowbite-react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import axios from "axios"
import { app } from "../firebase";
import ReactQuill from 'react-quill';
import { CircularProgressbar } from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css";
import 'react-quill/dist/quill.snow.css';
import { useSelector } from "react-redux";

const UpdatePost = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user)
    const { postId } = useParams()

    const [imageFile, setImageFile] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [publishLoading, setPublishLoading] = useState(false)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file);
        }
    }

    const uploadImage = async () => {
        if (!imageFile) return setImageFileUploadError('Please select an image');

        setImageFileUploadError(null)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name
        const storeageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storeageRef, imageFile)
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress)
            setImageFileUploadingProgress(progress.toFixed(0))
        },
            (error) => {
                console.log(error, 'Could Nor Upload Image (File must be less than 2MB)')
                setImageFileUploadError('Could Not Upload Image (File must be less than 2MB)')
                setImageFileUploadingProgress(null)
                setImageFile(null)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFileUploadingProgress(null)
                    setFormData({ ...formData, image: downloadUrl })
                })
            }
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setPublishLoading(true)
            const res = await axios.put(`/api/post/update/${postId}/${currentUser._id}`, formData);
            setPublishLoading(false)
            if (!res.data.error) {
                setPublishError(null);
                navigate(`/post/${res.data.data.slug}`);
            }

        } catch (error) {
            setPublishLoading(false)
            setPublishError(error?.response?.data?.message || error?.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await axios.get(`/api/post/getposts?postId=${postId}`);
                if (res.data.error) {
                    console.log(res.data.message);
                    setPublishError(res.data.message);
                    return;
                }
                if (!res.data.error) {
                    setPublishError(null);
                    console.log(res.data.data)
                    setFormData(res.data.data[0]);
                }
            };

            fetchPost();
        } catch (error) {
            setPublishError(error?.response?.data?.message || error?.message || 'Something went wrong');
        }
    }, [postId]);
    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type='text' placeholder="Title" required id='title' className="flex-1" onChange={(e) => setFormData({ ...formData, title: e.target.value })} value={formData?.title} />
                    <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })} value={formData?.category}>
                        <option value={'uncategorized'}>Select a category</option>
                        <option value={'javascript'}>JavaScript</option>
                        <option value={'react.js'}>React</option>
                    </Select>
                </div>

                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput type='file' accept='image/*' id='image' onChange={handleImageChange} />
                    <Button type='button' disabled={imageFileUploadingProgress} gradientDuoTone={'purpleToBlue'} size={'sm'} outline onClick={uploadImage}>{imageFileUploadingProgress ? (
                        <div className='w-16 h-16'>
                            <CircularProgressbar
                                value={imageFileUploadingProgress}
                                text={`${imageFileUploadingProgress || 0}%`}
                            />
                        </div>
                    ) : (
                        'Upload Image'
                    )}</Button>
                </div>
                {imageFileUploadError &&
                    <Alert color='failure'>
                        {imageFileUploadError}
                    </Alert>
                }
                {formData?.image && (
                    <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <ReactQuill theme="snow" placeholder="write " className="h-72 mb-12" required value={formData?.content} onChange={(e) => setFormData({ ...formData, content: e })} />

                <Button type="submit" gradientDuoTone="purpleToPink" disabled={publishLoading}>
                    {publishLoading ? (<><Spinner size={"sm"} /><span className="pl-3">loading...</span></>) : "Update Post"}
                </Button>

                {publishError && (
                    <Alert className='mt-5' color='failure'>
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    )
}

export default UpdatePost