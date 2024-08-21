'use client'
import React from 'react'
import DashboardLayout from '@/components/server/user/dashboard/DashboardLayout'
import PhotoForm from '@/components/server/user/dashboard/PhotoForm'
const PhotoPage = () => {
  return (
    <DashboardLayout>
     <div className="py-2 pt-2">
                <div className="bg-white p-4 shadow-md rounded-md font-bold text-black/80">
                Account Information
                </div>
            </div>
            <div className="pt-2">
                <PhotoForm />
            </div>
    </DashboardLayout>

  )
}

export default PhotoPage