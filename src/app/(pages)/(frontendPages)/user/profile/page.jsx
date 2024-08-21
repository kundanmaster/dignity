'use client'
import React from 'react'
import DashboardLayout from '@/components/server/user/dashboard/DashboardLayout'
import ProfilePageForm from '@/components/server/user/dashboard/ProfilePageForm'
import { useState } from 'react';
const ProfilePage = () => {
    return (
        <DashboardLayout>
            <div className="py-2 pt-2">
                <div className="bg-white p-4 shadow-md font-bold rounded-md text-goldlight">
                  Profile
                </div>
            </div>
            <div className="pt-2">
                <ProfilePageForm />
            </div>
        </DashboardLayout>
    )
}

export default ProfilePage;