import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import About  from "./pages/About"
import Header from "./components/Header"
import FooterComponent from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import CreatePost from "./pages/CreatePost"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"
import UpdatePost from "./pages/UpdatePost"
import PostPage from "./pages/PostPage"
import ScrollToTop from "./components/ScrollToTop"
import Search from "./pages/Search"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/update-post/:postId" element={<UpdatePost />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/post/:postSlug" element={<PostPage />} />

      </Routes>
      <FooterComponent />
    </BrowserRouter>
  )
}

export default App
