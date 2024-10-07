import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to MediInventory</h1>
      <p className="text-xl mb-8">Your comprehensive solution for medication inventory control</p>
      <div className="space-x-4">
        <Link to="/catalog" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Browse Catalog
        </Link>
        <Link to="/register" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
          Get Started
        </Link>
      </div>
    </div>
  )
}

export default Home