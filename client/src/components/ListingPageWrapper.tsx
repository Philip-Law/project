import React from 'react'
import { useLocation } from 'react-router-dom'
import ListingPage from '../views/ListingPage'

const ListingPageWrapper = (): React.ReactElement => {
  const location = useLocation()
  const listingDetails = location.state
  console.log(listingDetails)
  if (listingDetails == null) {
    return <div>No listing details provided.</div>
  }
  return <ListingPage {...listingDetails} />
}

export default ListingPageWrapper
