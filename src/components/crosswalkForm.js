import { useState, useEffect } from "react";
import MapComponent from "./map";
import { useUser } from "@clerk/nextjs";


export default function Places({ markers, locArray, setLoaded }) {

    const {user} = useUser()    
      const { isLoaded: userLoaded, isSignedIn } = useUser()
    const [selected, setSelected] = useState(null);
    
    useEffect(() => {
        if (selected !== null) {
            setViewState({longitude: selected.lng, latitude: selected.lat, zoom: 18})
            console.log(selected)
        }
    }, [selected])
    
    
  console.log("isSignedIn:");
  console.log(isSignedIn);

    return (
        <MapComponent markers={markers} locArray={locArray} setLoaded={setLoaded}/>        
    );
}
