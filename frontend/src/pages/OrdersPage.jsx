import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Package, Clock, CheckCircle, Truck, ArrowRight } from 'lucide-react'
import { AppContext } from '../App'

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200', label: 'Confirmed' },
  shipped: { icon: Truck, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Shipped' },
  delivered: { icon: Package, color: 'text-primary-600 bg-primary-50 border-primary-200', label: 'Delivered' },
}

export default function OrdersPage() {
  const { api } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders')
        setOrders(res.data || [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [api])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package size={36} className="text-gray-300" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">No Orders Yet</h1>
        <p className="text-gray-500 mb-6">Your order history will appear here</p>
        <Link to="/products" className="inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700">
          <span>Start Shopping</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center space-x-2 mb-2">
        <Package size={18} className="text-primary-600" />
        <span className="text-primary-600 font-bold text-sm uppercase tracking-wider">Order History</span>
      </div>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map(order => {
          const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
          const StatusIcon = status.icon

          return (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover">
              <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-gray-50/50">
                <div>
                  <span className="text-sm font-semibold text-gray-900">Order #{order.id}</span>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.color}`}>
                    <StatusIcon size={14} />
                    <span>{status.label}</span>
                  </span>
                  <span className="text-lg font-bold text-gray-900">${order.total_amount?.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {order.items?.map(item => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.product?.color || 'from-gray-200 to-gray-300'} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <span className="text-lg">{item.product?.emoji || '🛍️'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.price?.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-700">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
