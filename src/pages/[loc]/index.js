import { prisma } from "../../prisma"
import { useState } from "react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Head from 'next/head'
import Image from 'next/image'
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import Layout from "../../components/layout"
import Places from "../../components/crosswalkForm"
import { authOptions } from "../api/auth/[...nextauth]"

export default function Home({ markers, locArray }) {
    const {user} = useUser()    
  const { isLoaded: userLoaded, isSignedIn } = useUser()
    const [loaded, setLoaded] = useState(false);
    
    // // OFFLINE DEV
    // const session = {
    //   expires: "1",
    //   user: { email: "a", name: "Delta", image: "c" },
    // }

    // const locArray = loc.split(",")

    return (
    <>
      <Head>
        <title>crossywalk - Suggest your own crosswalk</title>
        <meta name="description" content="Suggest your own crosswalk" />
        <meta property="og:title" content="Crossywalk"/>
        <meta property="og:description" content="Suggest your own crosswalk"/>
        <meta property="og:image" content="/preview.png" />
      </Head>
      
      {!loaded && <div className="flex h-screen">
        <div className="m-auto">
        <ArrowPathIcon className="w-10 h-10 mx-auto text-gray-500 animate-spin"/>
        </div>
      </div>}

      <Layout 
      main={        
        <div>
          <Places markers={markers} user={user} isSignedIn={isSignedIn} locArray={locArray} setLoaded={setLoaded}/>
        </div>
      }/>
      
    </>
  )
}

export async function getServerSideProps(context) {

  // Quick check that query contains valid location
  const loc = context.query.loc;
  const locArray = loc.split(",")
  if (locArray.length !== 3 || isNaN(locArray[0]) || isNaN(locArray[1]) || isNaN(locArray[2])) {
    return { notFound: true }
  }

  // // OFFLINE DEV
  // const markers = []

  const markers = await prisma.crosswalk.findMany();

  return {
    props: {
      markers: JSON.parse(JSON.stringify(markers)),
      locArray: JSON.parse(JSON.stringify(locArray)),
    },
  }
}
