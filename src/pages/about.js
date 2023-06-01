import Layout from "../src/components/layout"
import Head from "next/head"
import Link from "next/link"


export default function About() {
  return (
    <>
        <Head>
            <title>About - crossywalk</title>
            <meta name="description" content="Suggest your own crosswalk" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/sauna.png" />
            </Head>
        <Layout 
        main={        
            <div className="h-full px-6 pt-20 lg:pt-6 bg-slate-100">
                {/* <h1 className="text-2xl">So what&apos;s this all about?</h1> */}
                
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 leading-8 sm:text-4xl">So, what&apos;s this all about?</h1>
                
                <div className="flex flex-col pt-6 max-w-prose gap-4">
                    <p className="text-lg">
                        Crossywalk is a place for you to suggest and vote on 
                        crosswalks that <span className="font-bold">you think should exist.</span>
                    </p>
                    <p>
                        Every city/suburb/town has those spots. The places where people need to cross a street, 
                        know that it's dangerous, but do it anyway - because the nearest crosswalk is 5 minutes away (if you're lucky).
                    </p>
                    <p>
                        My hope is that aggregating these suggestions will make it obvious which places
                        <span className="italic"> need </span>new crosswalks - and hopefully make them a reality.
                    </p>
                    
                    <Link
                        href="/-123.361940,48.408510,12"
                        className="inline-flex items-center justify-center py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent lg:w-44 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                        <p className="text-align-center">Get started</p>
                    </Link>
                    <p className="mt-6 text-sm italic text-gray-500">
                        Made by <a className="text-indigo-700 hover:text-indigo-900" href="https://hudsonyuen.com" target="_blank" rel="noreferrer">Hudson</a>
                    </p>
                </div>
            </div>
        }/>
        </>
  )
}
