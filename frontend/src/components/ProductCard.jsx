import { useContext } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { AppContext } from '../App'

export default function ProductCard({ product }) {
  const { user, addToCart, wishlist, toggleWishlist } = useContext(AppContext)
  const isWishlisted = wishlist.some(p => p.id === product.id)
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  return (
    <div className="group bg-white rounded-2xl overflow-hidden card-hover border border-gray-100/80">
      <div className={`relative h-52 bg-gradient-to-br ${product.color || 'from-gray-200 to-gray-300'} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />

        <span className="text-7xl group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
          {product.emoji || '🛍️'}
        </span>

        {product.badge && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-gray-800 shadow-sm">
            {product.badge}
          </span>
        )}

        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 shadow-sm ${
            isWishlisted
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white scale-110 shadow-pink-500/30'
              : 'bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-pink-50 hover:text-pink-500 hover:scale-110'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {discount > 0 && (
          <span className="absolute bottom-3 left-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-red-500/25">
            -{discount}%
          </span>
        )}

        <button
          onClick={() => user ? addToCart(product.id) : null}
          disabled={!user}
          className={`absolute bottom-3 right-3 p-3 rounded-xl transition-all duration-300 shadow-lg ${
            user
              ? 'bg-white text-primary-600 hover:bg-primary-600 hover:text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-primary-600/20'
              : 'hidden'
          }`}
          title={user ? 'Add to cart' : 'Sign in to add to cart'}
        >
          <ShoppingCart size={18} />
        </button>
      </div>

      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">
            {product.category}
          </p>
          <div className="flex items-center space-x-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.review_count?.toLocaleString()})</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-gray-900">${product.price?.toFixed(2)}</span>
            {product.original_price > product.price && (
              <span className="text-sm text-gray-400 line-through">${product.original_price?.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={() => user ? addToCart(product.id) : null}
            disabled={!user}
            className={`md:hidden p-2.5 rounded-xl transition-all duration-200 ${
              user
                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:shadow-lg hover:shadow-primary-600/25 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title={user ? 'Add to cart' : 'Sign in to add to cart'}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
