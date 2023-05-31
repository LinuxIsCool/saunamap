import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "../components/layout"
import { prisma } from "../prisma";
import { useMemo, Fragment, useState } from "react";
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { MapIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from '@headlessui/react'
import DeleteModal from "../components/deleteModal";
import CrosswalkPanel from "../components/crosswalkPanel";
import { useUser } from "@clerk/nextjs";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function MyCrosswalks({ crosswalkData }) {
  console.log("MyCrosswalks");
    const {user} = useUser()    
    const { isLoaded: userLoaded, isSignedIn } = useUser()
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [panelOpen, setPanelOpen] = useState(false)
    const [currCrosswalk, setCurrCrosswalk] = useState(null)

    const handleDelete = (crosswalk) => {
      setCurrCrosswalk(crosswalk)
      setDeleteOpen(true)
    }

    const handleEdit = (crosswalk) => {
      setCurrCrosswalk(crosswalk)
      setPanelOpen(true)
    }

    return (
      <>
        <Head>
          <title>My Crosswalks - crossywalk</title>
          <meta name="description" content="Suggest your own crosswalk" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/crosswalk.svg" />
        </Head>
        <Layout main={
            <div className="h-full px-6 pt-20 lg:pt-6 bg-slate-100">
                <h1 className="text-2xl">My Crosswalks</h1>
                <ul role="list" className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 auto-rows-max">

                {crosswalkData.map((crosswalk) => (
                  <li key={crosswalk.id} className="bg-white rounded-lg shadow col-span-1">
                  <div className="flex flex-col h-full p-4 gap-4">
                    <div className="flex justify-between">
                      <h1>{crosswalk.address}</h1>
                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <Menu.Button className="flex items-center text-gray-400 bg-gray-100 rounded-full hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                            <span className="sr-only">Open options</span>
                            <EllipsisVerticalIcon className="w-5 h-5" aria-hidden="true" />
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
                          <Menu.Items className="absolute right-0 z-10 w-40 mt-2 bg-white shadow-lg origin-top-right rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                  className={classNames(
                                    active ? 'bg-indigo-600 text-white' : 'text-gray-700',
                                    'block w-full px-4 py-2 text-left text-sm flex'
                                  )}
                                  onClick={() => window.location.replace(`/${crosswalk.longitude},${crosswalk.latitude},18`)}
                                >
                                  <p className="my-auto">Show on map</p>
                                  <MapIcon className="w-6 h-6 pl-2"/>
                                </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                  className={classNames(
                                    active ? 'bg-indigo-100 text-gray-900' : 'text-gray-700',
                                    'block w-full px-4 py-2 text-left text-sm'
                                  )}
                                  onClick={() => handleEdit(crosswalk)}
                                >
                                  Edit
                                </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={classNames(
                                      active ? 'bg-red-500 text-white' : 'text-red-500',
                                      'block w-full px-4 py-2 text-left text-sm'
                                    )}
                                    onClick={() => handleDelete(crosswalk)}
                                  >
                                    Delete
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                    <p className="text-sm">{crosswalk.description}</p>
                    {crosswalk._count.userVotes !== 1?
                      <p className="mt-auto">{crosswalk._count.userVotes} likes</p>
                      :
                      <p className="mt-auto">{crosswalk._count.userVotes} like</p>
                    }
                    
                  </div>
                  
                  </li>
                ))}
                </ul>
                {currCrosswalk && 
                  <div>
                    <DeleteModal key={currCrosswalk.id} open={deleteOpen} setOpen={setDeleteOpen} marker={currCrosswalk}/>
                    <CrosswalkPanel key={currCrosswalk.id} open={panelOpen} setOpen={setPanelOpen} marker={currCrosswalk} isSignedIn={isSignedIn} user={user} edit={true}/>
                  </div>
                }
                
            </div>
        }/>
      </>
    )
}


export async function getServerSideProps(context) {
    //const session = await getServerSession(context.req, context.res, authOptions)
  const { userId } = getAuth(context.req);

    if (!userId) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      }
    }

    const user = userId ? await clerkClient.users.getUser(userId) : undefined;
  console.log(user);

      const data = await prisma.crosswalk.findMany({
        where: {
            userId: user.emailAddresses[0].emailAddress
        },

        include: {
            _count: {
                select: { userVotes: true }
            }
        }
    });

  console.log(data);

    // const offlineData = [
    //   {
    //     id: 1,
    //     userId: 'hengjeung.yuen@gmail.com',
    //     latitude: 43.66601359148913,
    //     longitude: -79.4612869274421,
    //     address: 'Avenue and Cumberland',
    //     description: 'I want breakfast',
    //     votes: 4,
    //     shareInfo: 'nameImage',
    //     createdAt: '2023-01-16T22:13:23.810Z',
    //     updatedAt: '2023-01-16T22:13:23.810Z'
    //   },
    //   {
    //     id: 2,
    //     userId: 'hengjeung.yuen@gmail.com',
    //     latitude: 43.67081764090068,
    //     longitude: -79.38419891605797,
    //     address: 'Opposite the MC office',
    //     description: "I'm too lazy to take the correct exit out of bloor yonge so i risk my life outside the starbux",
    //     votes: 0,
    //     shareInfo: 'nameOnly',
    //     createdAt: '2023-01-17T23:36:45.345Z',
    //     updatedAt: '2023-01-17T23:36:45.345Z'
    //   }
    // ]
  
    return {
      props: {
        userId,
        crosswalkData: JSON.parse(JSON.stringify(data)),
        // crosswalkData: offlineData
      },
    }
  }
