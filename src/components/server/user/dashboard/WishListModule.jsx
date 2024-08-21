import Image from 'next/image'
import React from 'react'
import programming from '/public/images/pages/first_aid.jpg'
import { FaRegStar, FaStar } from "react-icons/fa";
const WishListModule = () => {
    return (
        <div className="py-2 pt-2 grid grid-cols-4 gap-10">
            <div className="bg-white p-4 shadow-md rounded-md text-black/80">
                <div className="flex flex-col space-y-2">
                    <Image src={programming} alt="wishlist" />
                    <p className="bg-black/80  font-bold  text-primarygold w-fit px-4 py-1 rounded-sm">CPR</p>
                    <p className='flex flex-row items-center justify-between'><span> Reviews </span><span className='flex flex-row items-center'>
                        <span><FaRegStar /></span>
                        <span><FaRegStar /></span>
                        <span><FaRegStar /></span>
                        <span className='text-goldlight'><FaStar /></span>
                        <span className='text-goldlight'><FaStar /></span>2</span> </p>
                    <hr />
                    <p className='flex flex-row justify-between items-center font-medium space-x-0.5'>
                        <span>Time 00.0.000</span>
                        <span>1 Lectures</span></p>
                </div>
            </div>
            <div className="bg-white p-4 shadow-md rounded-md text-black/80">
                <div className="flex flex-col space-y-2">
                    <Image src={programming} alt="wishlist" />
                    <p className="bg-black/80  font-bold  text-primarygold w-fit px-4 py-1 rounded-sm">Basic Nutrition</p>
                    <p className='flex flex-row items-center justify-between'><span> Reviews </span><span className='flex flex-row items-center'>
                        <span><FaRegStar /></span>
                        <span><FaRegStar /></span>
                        <span><FaRegStar /></span>
                        <span className='text-goldlight'><FaStar /></span>
                        <span className='text-goldlight'><FaStar /></span>2</span> </p>
                    <hr />
                    <p className='flex flex-row justify-between items-center font-medium space-x-0.5'>
                        <span>Time 00.0.000</span>
                        <span>1 Lectures</span></p>
                </div>
            </div>
        </div>
    )
}

export default WishListModule