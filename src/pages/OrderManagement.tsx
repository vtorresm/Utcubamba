import React, { useState, useEffect } from 'react'
import { ShoppingCart, Package, Truck, CheckCircle, Plus, Edit, X, Bell } from 'lucide-react'
import Swal from 'sweetalert2'

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  createdAt: string
}

interface OrderItem {
  medicationId: number
  name: string
  quantity: number
  price: number
}

interface Notification {
  id: string
  message: string
  read: boolean
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [newOrderItems, setNewOrderItems] = useState<OrderItem[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Simular la carga de pedidos desde una API
    const mockOrders: Order[] = [
      {
        id: '1',
        userId: 'user1',
        items: [
          { medicationId: 1, name: 'Ibuprofen', quantity: 2, price: 9.99 },
          { medicationId: 3, name: 'Loratadine', quantity: 1, price: 12.99 }
        ],
        status: 'processing',
        totalAmount: 32.97,
        createdAt: '2024-03-15T10:30:00Z'
      },
      {
        id: '2',
        userId: 'user1',
        items: [
          { medicationId: 2, name: 'Amoxicillin', quantity: 1, price: 15.99 }
        ],
        status: 'shipped',
        totalAmount: 15.99,
        createdAt: '2024-03-14T14:45:00Z'
      }
    ]
    setOrders(mockOrders)

    // Simular notificaciones iniciales
    setNotifications([
      { id: '1', message: 'Su pedido #1 ha sido procesado', read: false },
      { id: '2', message: 'Su pedido #2 ha sido enviado', read: false }
    ])
  }, [])

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setIsCreatingOrder(false)
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <ShoppingCart className="text-yellow-500" />
      case 'processing':
        return <Package className="text-blue-500" />
      case 'shipped':
        return <Truck className="text-purple-500" />
      case 'delivered':
        return <CheckCircle className="text-green-500" />
      case 'cancelled':
        return <X className="text-red-500" />
    }
  }

  const handleCreateOrder = () => {
    setIsCreatingOrder(true)
    setSelectedOrder(null)
    setNewOrderItems([])
  }

  const handleAddItem = () => {
    setNewOrderItems([...newOrderItems, { medicationId: 0, name: '', quantity: 1, price: 0 }])
  }

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = [...newOrderItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setNewOrderItems(updatedItems)
  }

  const handleRemoveItem = (index: number) => {
    setNewOrderItems(newOrderItems.filter((_, i) => i !== index))
  }

  const handleSubmitOrder = () => {
    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      userId: 'user1',
      items: newOrderItems,
      status: 'pending',
      totalAmount: newOrderItems.reduce((total, item) => total + item.price * item.quantity, 0),
      createdAt: new Date().toISOString()
    }
    setOrders([...orders, newOrder])
    setIsCreatingOrder(false)
    showNotification('success', `Su nuevo pedido #${newOrder.id} ha sido creado`)
  }

  const handleCancelOrder = (orderId: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar pedido',
      cancelButtonText: 'No, mantener pedido'
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ))
        showNotification('info', `El pedido #${orderId} ha sido cancelado`)
      }
    })
  }

  const showNotification = (icon: 'success' | 'error' | 'warning' | 'info', message: string) => {
    Swal.fire({
      icon,
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    const newNotification: Notification = {
      id: (notifications.length + 1).toString(),
      message,
      read: false
    }
    setNotifications([...notifications, newNotification])
  }

  const handleReadNotification = (notificationId: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Pedidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Mis Pedidos</h3>
            <button
              onClick={handleCreateOrder}
              className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 flex items-center"
            >
              <Plus size={18} className="mr-1" /> Nuevo Pedido
            </button>
          </div>
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOrder?.id === order.id ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Pedido #{order.id}</span>
                  {getStatusIcon(order.status)}
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="font-semibold mt-2">${order.totalAmount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">
            {isCreatingOrder ? 'Crear Nuevo Pedido' : 'Detalles del Pedido'}
          </h3>
          {isCreatingOrder ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-4">Artículos del Pedido</h4>
              {newOrderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nombre del medicamento"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    className="flex-grow px-2 py-1 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                    className="w-24 px-2 py-1 border rounded"
                  />
                  <button onClick={() => handleRemoveItem(index)} className="text-red-500">
                    <X size={18} />
                  </button>
                </div>
              ))}
              <button onClick={handleAddItem} className="mt-2 text-blue-500 hover:text-blue-600">
                + Agregar artículo
              </button>
              <div className="mt-4">
                <button
                  onClick={handleSubmitOrder}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Crear Pedido
                </button>
              </div>
            </div>
          ) : selectedOrder ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Pedido #{selectedOrder.id}</h4>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium capitalize" style={{
                    backgroundColor: 
                      selectedOrder.status === 'pending' ? 'rgb(253, 230, 138)' :
                      selectedOrder.status === 'processing' ? 'rgb(191, 219, 254)' :
                      selectedOrder.status === 'shipped' ? 'rgb(216, 180, 254)' :
                      selectedOrder.status === 'delivered' ? 'rgb(167, 243, 208)' :
                      'rgb(254, 202, 202)',
                    color:
                      selectedOrder.status === 'pending' ? 'rgb(146, 64, 14)' :
                      selectedOrder.status === 'processing' ? 'rgb(30, 64, 175)' :
                      selectedOrder.status === 'shipped' ? 'rgb(107, 33, 168)' :
                      selectedOrder.status === 'delivered' ? 'rgb(6, 95, 70)' :
                      'rgb(153, 27, 27)'
                  }}>
                    {selectedOrder.status}
                  </span>
                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                    <button
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 text-sm"
                    >
                      Cancelar Pedido
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Fecha del pedido: {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <div className="mb-4">
                <h5 className="font-semibold mb-2">Artículos:</h5>
                <ul className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <li key={item.medicationId} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Selecciona un pedido para ver sus detalles o crea uno nuevo.</p>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Bell className="mr-2" /> Notificaciones
        </h3>
        {notifications.length > 0 ? (
          <ul className="space-y-2">
            {notifications.map(notification => (
              <li
                key={notification.id}
                className={`p-3 rounded-md ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}
              >
                <div className="flex justify-between items-center">
                  <span>{notification.message}</span>
                  {!notification.read && (
                    <button
                      onClick={() => handleReadNotification(notification.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Marcar como leída
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay notificaciones nuevas.</p>
        )}
      </div>
    </div>
  )
}

export default OrderManagement