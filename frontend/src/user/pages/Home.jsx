import React from 'react'
import Hero from '../components/Hero'
import BestSeller from '../components/BestSeller'
import LatestCollection from '../components/LatestCollection'
import OurPolicy from '../components/OurPolicy'

const Home = () => {
  return (
    <div>
    <Hero />
    <LatestCollection />
    <BestSeller />
    <OurPolicy />
    </div>
  )
}

export default Home