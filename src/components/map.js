import React, { useRef, useState, useEffect, useMemo } from "react"
import Map, { Marker, Popup, ViewState } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBox from "./searchBox";
import AuthModal from "./authModal";
import axios from "axios";
import CrosswalkPanel from "./crosswalkPanel";
import { HeartIcon, LinkIcon, PaperAirplaneIcon, ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import MaxModal from "./maxModal";
import Copied from "./copied";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

export default function MapComponent({ markers, locArray, setLoaded }) {
  const {user} = useUser()    
  const { isLoaded: userLoaded, isSignedIn } = useUser()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMaxOpen, setMaxModalOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [popupInfo, setPopupInfo] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  
  const [selected, setSelected] = useState(null);
  const [addActive, setAddActive] = useState(false);
  const [cursorType, setCursorType] = useState('pointer')
  const [viewState, setViewState] = useState({
    longitude: locArray[0],
    latitude: locArray[1],
    zoom: locArray[2]
  });
  const [marker, setMarker] = useState(null) // could memo later if necessary

  const locations = [
    {name: 'Dallas Road', long: -123.361940, lat: 48.408510},
    {name: 'Willows Beach', long: -123.303606, lat: 48.433760},
    {name: 'Esquimalt Lagoon', long: -123.419159, lat: 48.430321},
    {name: 'Tofino', long: -125.906616, lat: 49.152985},
    {name: 'Pender Island', long: -123.2894 , lat: 48.7867},
  ]

  const mapContainer = useRef(null);
  const mapRef = useRef();
  const router = useRouter();

  const handleClick = (evt) => {
    if (cursorType === 'crosshair') {
      setCursorType('pointer')

      // Set state with temp marker, not added to db
      setMarker({lat: evt.lngLat.lat, lng: evt.lngLat.lng})
      setPanelOpen(true)
    }
  }


  const handleAddClick = async () => {
    console.log(isSignedIn);
    if (!isSignedIn) {
      setModalOpen(true)
      return
    }

    // Check if user has hit upload limit, currently 5
    //const userId = user.email;
    //await axios.post("/api/db/checkUser", {
      //userId
    //}).then(response => {
      //if (response.data._count.id >= 5) {
        //setMaxModalOpen(true)
        //return
      //} else {
        //setAddActive(true)
        //setCursorType('crosshair')
      //}
    //})
    setAddActive(true)
    setCursorType('crosshair')
  }

  const handleCancel = () => {
    setAddActive(false)
    setCursorType('pointer')
    setMarker(null)
  }

  const checkCrosswalk = async (crosswalk, isSignedIn) => {
    console.log("Test...")
    console.log("isSignedIn:");
    console.log(isSignedIn);
    console.log(user);
    if (isSignedIn) {
      const markerId = crosswalk.id;
      const userId = user.emailAddresses[0].emailAddress;
  
      await axios.post("/api/db/checkCrosswalk", {
        userId, markerId
      }).then(response => {
        console.log("Test");
        console.log(response);
        setPopupInfo({marker: response.data.marker, upvoted: response.data.upvoted})
      }).catch(error => {
        console.log(error.response.data)
      })
    } else {
      console.log("Not signed in.")
      setPopupInfo({marker: crosswalk, upvoted: false})
    }
  }

  const handleUpvote = async (crosswalk) => {
    if (!isSignedIn) {
      console.log('need auth')
      setModalOpen(true)
      return
    }

    const markerId = popupInfo.marker.id;
    const userId = user.emailAddresses[0].emailAddress;

    // If not voted yet, add a vote
    if (!popupInfo.upvoted) {
      await axios.post("/api/db/upvoteCrosswalk", {
        userId, markerId
      }).catch(error => {
        console.log(error.response.data)
      })
    } else {
      // If already voted, remove a vote
      await axios.post("/api/db/downvoteCrosswalk", {
        userId, markerId
      }).catch(error => {
        console.log(error.response.data)
      })
    }
    checkCrosswalk(crosswalk, isSignedIn)
  }
  
  const copyLink = (info) => {
    navigator.clipboard.writeText(`https://crossywalk.com/${info.longitude},${info.latitude},19`);
    setShowCopied(true)
  }

  const jumpLocation = (location) => {
    mapRef.current?.flyTo({
      center: [location.long, location.lat],
      zoom: 12,
      speed: 4,
    })
    setPopupInfo(null)
    router.push(`/${location.long},${location.lat},12`, undefined, { shallow: true })
  }

  useEffect(() => {

    if (selected !== null) {
        setPopupInfo(null)
        mapRef.current?.flyTo({
          center: [selected.lng, selected.lat],
          zoom: 18,
          speed: 1.8,
        })
    }
  }, [selected])

  useEffect(() => {
    if (!panelOpen && addActive) {
      setCursorType('crosshair')
    }
  })

  useEffect(() => {
    setTimeout(()=>{
      setShowCopied(false)
     }, 5000)
  }
  , [showCopied])

  const existingMarkers = useMemo(
    () =>
      markers.map((marker) => (
        <Marker
          key={`marker-${marker.id}`}
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="center"
          onClick={e => {
            // Prevent autoclose
            e.originalEvent.stopPropagation();
            
            checkCrosswalk(marker, isSignedIn);
            mapRef.current?.flyTo({
              center: [marker.longitude, marker.latitude],
              zoom: 19,
              speed: 1.8,
            })
          }}
        >
          <img className="w-10 h-10" src="/sauna2.png"/>
        </Marker>
      )),
    [isSignedIn, checkCrosswalk, markers]
  );

  return (
    <div>
      <div className="absolute z-10 flex flex-col w-full px-3 pt-16 gap-3 lg:gap-6 lg:px-6 lg:pt-6 lg:flex-row lg:w-auto">
          <SearchBox setSelected={setSelected}/>
          
          {!addActive && 
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent lg:h-14 lg:w-48 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleAddClick}
            >
              <PlusIcon className="w-5 h-5 mr-1 -ml-1" aria-hidden="true" />
              <p>
                Suggest crosswalk
              </p>
            </button>
          } 

          {addActive &&
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-400 border border-transparent cursor-not-allowed lg:w-48 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled
            >
              <p className="px-4 text-align-center">Select a location on the map</p>
            </button>
          } 

          {addActive &&
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-400 border border-transparent lg:w-24 rounded-md hover:bg-red-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleCancel}
            >
              <p className="px-4 text-align-center">Cancel</p>
            </button>
          }

          <div className="flex justify-between order-first lg:hidden gap-3">
            {locations.map((location) => (
              <button
                className="inline-flex items-center justify-center px-4 py-2 text-xs text-sm font-medium text-white border border-transparent lg:text-sm lg:w-30 grow rounded-md bg-zinc-400 hover:bg-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                onClick={() => jumpLocation(location)}
              >
                {location.name}
                <ArrowSmallRightIcon className="hidden w-4 h-4 my-auto ml-1 sm:block" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        {/* Jump buttons in large view */}
        <div className="absolute z-10 flex justify-between lg:ml-auto lg:flex-col gap-3 lg:w-30 lg:top-6 lg:right-6 lg:mb-0">
            {locations.map((location) => (
              <button
                className="inline-flex items-center justify-center px-4 py-2 text-xs text-sm font-medium text-white border border-transparent lg:text-sm lg:w-30 grow rounded-md bg-zinc-400 hover:bg-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                onClick={() => jumpLocation(location)}
              >
                {location.name}
                <ArrowSmallRightIcon className="hidden w-4 h-4 my-auto ml-1 sm:block" aria-hidden="true" />
              </button>
            ))}
          </div>
        
        <div ref={mapContainer} className=''>
          <Map
            {...viewState}
            ref={mapRef}
            onMove={evt => setViewState(evt.viewState)}
            style={{width: '100%', height: '100vh'}}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
            onClick={(evt) => handleClick(evt)}
            cursor={cursorType}
            maxZoom={20}
            minZoom={3}
            dragRotate={false}
            onLoad={() => setLoaded(true)}
          >
            {marker && 
              <div>
                <Marker longitude={marker.lng} latitude={marker.lat} anchor="center">
                  <img className="w-10 h-10" src="sauna.png"/>
                </Marker>
              </div>
            }

            {existingMarkers}

            {popupInfo && (
              <Popup
                anchor="bottom"
                longitude={Number(popupInfo.marker.longitude)}
                latitude={Number(popupInfo.marker.latitude)}
                onClose={() => setPopupInfo(null)}
                closeButton={false}
                maxWidth="350px"
              >
                <div className="flex flex-col m-1 gap-1">
                  <div className="flex justify-between">
                    <h1 className="font-sans text-lg font-medium">{popupInfo.marker.address}</h1>
                    <LinkIcon 
                      className="w-5 h-5 my-auto text-gray-600 cursor-pointer hover:text-indigo-900"
                      onClick={() => copyLink(popupInfo.marker)}
                    />
                  </div>
                  <p className="text-xs italic text-gray-700">Suggested by: <span className="font-medium">{popupInfo.marker.userName}</span></p>
                  <p className="mt-2 text-sm">{popupInfo.marker.description}</p>
                  
                  <div className="flex mt-3 gap-2">
                  {popupInfo.upvoted ? 
                  <HeartIcon className="w-6 h-6 cursor-pointer fill-red-500" onClick={() => handleUpvote(popupInfo.marker)}/>
                  :
                  <HeartIcon className="w-6 h-6 cursor-pointer" onClick={() => handleUpvote(popupInfo.marker)}/>
                  
                }
                  <p className="my-auto text-sm text-gray-700">{popupInfo.marker._count.userVotes}</p>
                </div>
                </div>
              </Popup>
            )}
          </Map>
        </div>
        <CrosswalkPanel open={panelOpen} setOpen={setPanelOpen} marker={marker} user={user} isSignedIn={isSignedIn} edit={false}/>
        <AuthModal open={modalOpen} setOpen={setModalOpen} viewState={viewState}/>
        <MaxModal open={modalMaxOpen} setOpen={setMaxModalOpen}/>
        <Copied show={showCopied} setShow={setShowCopied}/>
    </div>
  )
}
