import { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import axios from "axios"
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (errorMessage) {
      setErrorMessage(null)
    }
    setFormData({
      ...formData, [e.target.id]: e.target.value.trim()
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.username || !formData?.email || !formData?.password) {
      return setErrorMessage("All Fields are required")
    }

    setLoading(true)
    try {
      const userData = await axios.post("/api/auth/signup", formData);
      setLoading(false)
      console.log(userData)
    } catch (error) {
      setLoading(false)
      return setErrorMessage(error?.response?.data?.message || error?.message)
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
          <p className="text-sm mt-5">This is a demo project. You can sign up with your email and password or with Google.</p>
        </div>

        <div className="flex-1 ">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label>Your username</Label>
              <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
            </div>
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
            <OAuth/>
          </form>

          <div className="flex gap-2 mt-5 text-sm">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">Sign in</Link>
          </div>
          {errorMessage &&
            <Alert className="mt-5" color={"failure"}>{errorMessage}</Alert>
          }
        </div>
      </div>
    </div>
  )
}
