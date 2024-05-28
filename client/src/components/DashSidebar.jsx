import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { signOutFailed, signOutStart, signOutSuccess } from '../redux/user/userSlice';
import axios from 'axios';

const DashSidebar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user)
    const [tab, setTab] = useState('')
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
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        setTab(tabFromUrl)
    }, [location.search])
    return (
        <Sidebar aria-label="Default sidebar example" className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>

                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item as='div' active={tab === 'profile'} icon={HiUser} label={currentUser?.isAdmin ? "Admin" : 'User'} labelColor='dark'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser && currentUser.isAdmin &&
                        <>
                            {currentUser && currentUser.isAdmin && (
                                <Link to='/dashboard?tab=dash'>
                                    <Sidebar.Item
                                        active={tab === 'dash' || !tab}
                                        icon={HiChartPie}
                                        as='div'
                                    >
                                        Dashboard
                                    </Sidebar.Item>
                                </Link>
                            )}
                            <Link to="/dashboard?tab=posts">
                                <Sidebar.Item as='div' active={tab === 'posts'} icon={HiDocumentText} labelColor='dark'>
                                    Posts
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=users">
                                <Sidebar.Item as='div' active={tab === 'users'} icon={HiOutlineUserGroup} labelColor='dark'>
                                    Users
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=comments'>
                                <Sidebar.Item
                                    active={tab === 'comments'}
                                    icon={HiAnnotation}
                                    as='div'
                                >
                                    Comments
                                </Sidebar.Item>
                            </Link>
                        </>
                    }


                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>)
}

export default DashSidebar