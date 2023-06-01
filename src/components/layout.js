import Link from 'next/link'
import { useState, Fragment } from 'react';
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, Bars3Icon, InformationCircleIcon, QueueListIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function Layout({ main }) {
  const { isLoaded: userLoaded, isSignedIn } = useUser()
  const {user} = useUser()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // // OFFLINE DEV
    // const session = {
    //     expires: "1",
    //     user: { email: "a", name: "Delta", image: "c" },
    //   }

    const authenticated = !! isSignedIn

    return (
        <div className='flex flex-col w-screen h-screen lg:flex-row'>
            <div className="fixed z-10 flex justify-between w-full py-2 bg-gray-800 lg:relative lg:w-max lg:flex-col lg:py-0">
                <div className="flex w-full lg:flex-col lg:flex-1 lg:pt-5 lg:pb-4">
                    <Link 
                        className="flex mx-4 lg:mx-5 gap-3" 
                        href="/-79.4005188,43.6622882,11"
                    >              
                        <img src="/sauna.svg" className='my-auto h-7 w-7 lg:h-9 lg:w-9' alt="Sauna Icon."/>
                        <h1 className='my-auto text-yellow-500 lg:text-xl font-fredoka-one'>saunaweb</h1>
                    </Link>
                    
                    <nav className="flex-1 px-2 lg:mt-5 space-y-1 lg:ml-0 " aria-label="Sidebar">
                        {authenticated ?
                        <div className='flex flex-col h-full'>
                        {/* Mobile view small */}
                        <div className='flex self-end pr-2 my-auto md:hidden'>
                            
                            <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <Menu.Button className="flex w-6 h-6 text-gray-300 cursor-pointer hover:text-white">
                            <span className="sr-only">Open options</span>
                            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-20 w-40 mt-2 bg-white shadow-lg origin-top-right rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                  className={classNames(
                                    active ? 'bg-indigo-600 text-white' : 'text-gray-700',
                                    'block w-full px-4 py-2 text-left text-sm flex'
                                  )}
                                  href="/mySaunas"
                                >
                                  <p className="my-auto">My Saunas</p>
                                  <QueueListIcon className="w-6 h-6 pl-2"/>
                                </Link>
                                )}
                              </Menu.Item>
                              {/* <Menu.Item> */}
                                {/* {({ active }) => ( */}
                                  {/* <Link */}
                                  {/* className={classNames( */}
                                    {/* active ? 'bg-indigo-100 text-gray-900' : 'text-gray-700', */}
                                    {/* 'block w-full px-4 py-2 text-left text-sm' */}
                                  {/* )} */}
                                  {/* href="/about" */}
                                {/* > */}
                                  {/* About */}
                                {/* </Link> */}
                                {/* )} */}
                              {/* </Menu.Item> */}
                              {/* <Menu.Item> */}
                                {/* {({ active }) => ( */}
                                  {/* <button */}
                                    {/* className={classNames( */}
                                      {/* active ? 'bg-gray-500 text-white' : 'text-gray-500', */}
                                      {/* 'block w-full px-4 py-2 text-left text-sm' */}
                                    {/* )} */}
                                    {/* onClick={() => signOut()} */}
                                  {/* > */}
                                    {/* Logout */}
                                  {/* </button> */}
                                {/* )} */}
                              {/* </Menu.Item> */}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                            
                        </div>
                        {/* desktop view large */}
                        <div className='flex justify-between hidden h-full md:flex lg:flex-col'>
                            <Link className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white group rounded-md"
                                href='/mySaunas'
                            >
                                <QueueListIcon className='hidden w-6 h-6 mr-2 lg:block'/>
                                <p>My Saunas</p>
                            </Link>
                            
                            {/* <div className='flex flex-row lg:flex-col gap-2'> */}
                                {/* <Link className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white group rounded-md" */}
                                    {/* href='/about' */}
                                {/* > */}
                                    {/* <InformationCircleIcon className='hidden w-6 h-6 mr-2 lg:block'/> */}
                                    {/* <p>About</p> */}
                                {/* </Link> */}
                                {/* <div className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-700 hover:text-white group rounded-md"  */}
                                    {/* onClick={() => signOut({callbackUrl: '/'})}> */}
                                    {/* <ArrowLeftOnRectangleIcon className='hidden w-6 h-6 mr-2 lg:block'/> */}
                                    {/* <p>Logout</p> */}
                                {/* </div> */}
                            {/* </div> */}
                            </div>
                        </div>
                        :
                        <div className='flex justify-between lg:flex-col gap-2'>
                            <Link 
                                className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white group rounded-md"
                                href='/about'
                            >
                                <InformationCircleIcon className='hidden w-6 h-6 mr-2 lg:block'/>
                                <p>About</p>
                            </Link>
                            <button 
                                className="flex items-center px-2 py-2 mr-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white group rounded-md"
                                onClick={() => signIn("google", {callbackUrl: '/'})}
                            >
                                <ArrowRightOnRectangleIcon className='hidden w-6 h-6 mr-2 lg:block'/>
                                <p className=''>Login</p>
                                <ArrowRightOnRectangleIcon className='w-6 h-6 ml-2 -mr-2 lg:hidden'/>
                                
                            </button>
                        </div>
                        }
                    </nav>
                </div>

                {authenticated &&
                <div className="flex flex-shrink-0 lg:bg-gray-700 md:px-3 lg:p-4">
                    <div className="flex items-center">
                        <div>
                          {/* <Image */}
                            {/* src={user.profileImageUrl} */}
                            {/* alt="User Profile Image" */}
                            {/* className="inline-block w-8 h-8 rounded-full lg:h-9 lg:w-9" */}
                            {/* width={56} */}
                            {/* height={56} */}
                          {/* /> */}
                          <UserButton/>
                        {/* <img */}
                            {/* className="inline-block w-8 h-8 rounded-full lg:h-9 lg:w-9" */}
                            {/* src={session.user.image} */}
                            {/* alt="" */}
                        {/* /> */}
                        </div>
                        <div className="ml-3">
                        <p className="hidden text-sm font-medium text-white lg:flex">{user.firstName}</p>
                        </div>
                    </div>
                </div>
                }
            </div>

            <main className='fixed w-screen h-screen lg:relative lg:flex-1'>
                {main}
            </main>
        
        </div>
    )
}
