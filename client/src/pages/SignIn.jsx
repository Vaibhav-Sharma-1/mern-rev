import { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signInStart, signInSuccess, signInFailed } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

import OAuth from "../components/OAuth";
export default function SignIn() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user)

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id]: e.target.value.trim()
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.email || !formData?.password) {
      return dispatch(signInFailed("All Fields are required"))
    }

    try {
      dispatch(signInStart())
      const userData = await axios.post("/api/auth/signin", formData);
      if (!userData?.data?.error) {
        dispatch(signInSuccess(userData.data.data))
        navigate("/")
      }
      console.log(userData)
    } catch (error) {
      return dispatch(signInFailed(error?.response?.data?.message || error?.message))
    }

  }
  return (
    <div className="min-h-screen  mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col items-center gap-5 md:flex-row">
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              MERN
            </span>
            blog
          </Link>
          <p className="text-sm mt-5">This is a demo project. You can sign in with your email and password or with Google.</p>
        </div>

        <div className="flex-1 ">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            <div>
              <Label>Email</Label>
              <TextInput type="email" placeholder="name@abc.com" id="email" onChange={handleChange} />
            </div>
            <div>
              <Label>Password</Label>
              <TextInput type="password" placeholder="********" id="password" onChange={handleChange} />
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {loading ? (<>
                <Spinner size={"sm"} /><span className="pl-3">loading...</span>
              </>) :
                "Sign In"
              }
            </Button>
            <OAuth />
          </form>

          <div className="flex gap-2 mt-5 text-sm">
            <span>{`Don't Have an account?`}</span>
            <Link to="/sign-in" className="text-blue-500">Sign up</Link>
          </div>
          {errorMessage &&
            <Alert className="mt-5" color={"failure"}>{errorMessage}</Alert>
          }
        </div>
      </div>
    </div>
  )
}
