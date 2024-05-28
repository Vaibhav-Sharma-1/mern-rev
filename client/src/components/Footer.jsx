import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';

const FooterComponent = () => {
    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full text-center">
                <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
                    <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            MERN
                        </span>
                        blog
                    </Link>

                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="Company" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">About</Footer.Link>
                                <Footer.Link href="#">Recent Blogs</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="help center" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">LinkedIN</Footer.Link>
                                <Footer.Link href="#">Contact Us</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="legal" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">Privacy Policy</Footer.Link>
                                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                    </div>

                </div>
                <Footer.Divider />
                <div className="w-full  px-4 py-6 flex flex-col justify-center sm:flex-row sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="vaibhavsharma987s6@gmail.com" year={2024} />
                    <div className="mt-4 flex justify-center space-x-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsTwitter} />
                        <Footer.Icon href="#" icon={BsGithub} />
                        <Footer.Icon href="#" icon={BsDribbble} />
                    </div>
                </div>
            </div>
        </Footer>
    )
}

export default FooterComponent