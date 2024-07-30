import { formControlClasses } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

export default function UserLocation() {
  const [IPAddress,setIPAddress] = useState()
  const [geoInfo ,setGeoInfo] = useState()


  useEffect(()=>{
    getVisitorIP();
  },[])

  const getVisitorIP =async ()=>{
    try {
      const respnse = await fetch("https://api.ipify.org")
    const data = await respnse.text()
    // console.log(data ," ip data")
    setIPAddress(data)
    } catch (error) {
      console.log(error)
    }
  }
  const inputHandler = (e) => {
    setIPAddress(e.target.value)

  };
  const fetchIpInfo = async()=>{
    const respnse = await fetch(`http://ip-api.com/json/${IPAddress}`)
    const data = await respnse.json();
    console.log(data ," ipdata")
  }

const fetchIpInf = useCallback(()=>{
  const location = navigator.geolocation.getCurrentPosition(async(position)=>{

    const url = `https://api.opencagedata.com/geocode/v1/json?key=a23f761f3a1a4f5e905608f5ff431f40&q=
24.8591%2C+66.9983&pretty=1&no_annotations=1`;
    const loc = await fetch(url);
    const data = await loc.json();
    console.log(data?.results[0].formatted," ===>>> exact data");
    setGeoInfo(data?.results[0]?.formatted)
  })
})
fetchIpInf( )
  return (
    <div>
      <h3>IP to location</h3>
      <div>
        
          <button onClick={fetchIpInfo}>get info</button>
          <p>{geoInfo}</p>
      </div>
    </div>
  );
}
