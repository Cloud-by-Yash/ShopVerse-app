import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { AppContext } from '../App'

export default function CartSidebar({ open, onClose }) {
  const { cart, cartTotal, updateCartItem, removeCartItem } = useContext(AppContext)

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag size={16} className="text-white" />
              </div>
              <h2 className="font-display text-xl font-bold text-gray-900">Your Cart</h2>
              {cart.length > 0 && (
                <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{cart.length}</span>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <p className="font-semibold text-gray-600">Your cart is empty</p>
                <p className="text-sm mt-1">Add some products to get started</p>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="mt-4 text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center space-x-1"
                >
                  <span>Browse Products</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center space-x-3 bg-gray-50/80 rounded-xl p-3 hover:bg-gray-100/80 transition-colors">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.product.color || 'from-gray-200 to-gray-300'} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <span className="text-2xl">{item.product.emoji || '🛍️'}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-sm font-bold text-primary-600 mt-0.5">${item.product.price?.toFixed(2)}</p>

                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => item.quantity > 1 ? updateCartItem(item.id, item.quantity - 1) : removeCartItem(item.id)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeCartItem(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-100 space-y-4 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400">Shipping and taxes calculated at checkout</p>
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white text-center py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-600/25 transition-all hover:-translate-y-0.5"
              >
                View Cart & Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
