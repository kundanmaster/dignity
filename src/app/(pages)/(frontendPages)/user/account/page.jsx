import React from 'react'
import DashboardLayout from '@/components/server/user/dashboard/DashboardLayout'
import AccountForm from '@/components/server/user/dashboard/AccountForm'
const AccountPage = () => {
  return (
    <DashboardLayout>
        <div className="py-2 pt-2">
                <div className="bg-white p-4 shadow-md font-bold text-black/80 rounded-md">
                Account Information
                </div>
            </div>
            <div className="pt-2">
                <AccountForm />
            </div>
    </DashboardLayout>
  )
}

export default AccountPage