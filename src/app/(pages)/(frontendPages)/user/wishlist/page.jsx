import DashboardLayout from '@/components/server/user/dashboard/DashboardLayout'
import React from 'react'
import WishListModule from '@/components/server/user/dashboard/WishListModule'
const WishlistPage = () => {
  return (
    <DashboardLayout>
      <div className="py-2 pt-2 flex-grow">
        <div className="user-dashboard-topword">
          Wishlist
        </div>
      </div>
      <div className="pt-2">
        <WishListModule />
      </div>
    </DashboardLayout>
  )
}

export default WishlistPage