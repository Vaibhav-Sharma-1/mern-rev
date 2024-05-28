import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { app } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInFailed, signInStart, signInSuccess } from '../redux/user/userSlice'
const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auth = getAuth(app)
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            dispatch(signInStart())
            const resultsFromGOogle = await signInWithPopup(auth, provider);
            console.log(resultsFromGOogle)
            const results = await axios.post("/api/auth/google", {
                name: resultsFromGOogle.user.displayName,
                email: resultsFromGOogle.user.email,
                googlePhotoUrl: resultsFromGOogle.user.photoURL,
            })
            if (!results?.data?.error) {
                dispatch(signInSuccess(results.data.data))
                navigate("/")
            }
        } catch (error) {
            return dispatch(signInFailed(error?.response?.data?.message || error?.message))
        }
    }
    return (
        <Button type='button' gradientDuoTone={'pinkToOrange'} outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Google
        </Button>
    )
}

export default OAuth