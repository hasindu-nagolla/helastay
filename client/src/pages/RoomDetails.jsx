import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { roomsDummyData } from '../assets/assets';

const RoomDetails = () => {

    const {id} = useParams()
    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        const room = roomsDummyData.find(room => room._id === id)
        room && setRoom(room);
        room && setMainImage(room.images[0]);
    }, [])

  return (
    <div>
        <h1 className='pt-64'>Room Details</h1>
    </div>
  )
}

export default RoomDetails