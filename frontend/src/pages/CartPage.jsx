import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CheckCircle, ShieldCheck, Truck } from 'lucide-react'
import { AppContext } from '../App'

export default function CartPage() {
  const { cart, cartTotal, updateCartItem, removeCartItem, placeOrder } = useContext(AppContext)
  const [ordering, setOrdering] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const navigate = useNavigate()

  const handlePlaceOrder = async () => {
    setOrdering(true)
    try {
      await placeOrder()
      setOrderPlaced(true)
      setTimeout(() => navigate('/orders'), 2000)
    } catch {
      setOrdering(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500">Redirecting to your orders...</p>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={36} className="text-gray-300" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet</p>
        <Link to="/products" className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/25 transition-all">
          <ArrowLeft size={18} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center space-x-2 mb-2">
        <ShoppingBag size={18} className="text-primary-600" />
        <span className="text-primary-600 font-bold text-sm uppercase tracking-wider">Your Cart</span>
      </div>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center space-x-4 bg-white rounded-2xl p-5 border border-gray-100 card-hover">
              <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.product.color || 'from-gray-200 to-gray-300'} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <span className="text-3xl">{item.product.emoji || '🛍️'}</span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{item.product.category}</p>
                <p className="text-lg font-bold gradient-text mt-1">${item.product.price?.toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => item.quantity > 1 ? updateCartItem(item.id, item.quantity - 1) : removeCartItem(item.id)}
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateCartItem(item.id, item.quantity + 1)}
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeCartItem(item.id)}
                  className="mt-1 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24 shadow-sm">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({cart.length} items)</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium">${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold gradient-text">${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={ordering}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/25 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {ordering ? 'Processing...' : 'Place Order'}
            </button>

            <Link to="/products" className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
              Continue Shopping
            </Link>

            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center space-x-2 text-gray-400 text-xs">
                <ShieldCheck size={14} />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-xs">
                <Truck size={14} />
                <span>Free shipping on orders over $50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
