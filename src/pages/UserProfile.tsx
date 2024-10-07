import React from 'react'

const UserProfile: React.FC = () => {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2024-03-01',
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="bg-white p-6 rounded-md shadow">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Join Date:</strong> {user.joinDate}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Order History</h3>
        <p>No orders yet.</p>
      </div>
    </div>
  )
}

export default UserProfile