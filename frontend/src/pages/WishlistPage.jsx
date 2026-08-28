import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import { AppContext } from '../App'
import ProductCard from '../components/ProductCard'

export default function WishlistPage() {
  const { wishlist } = useContext(AppContext)

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart size={36} className="text-pink-300" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
        <p className="text-gray-500 mb-6">Save items you love by clicking the heart icon</p>
        <Link to="/products" className="inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700">
          <span>Browse Products</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center space-x-2 mb-2">
        <Heart size={18} className="text-pink-500" />
        <span className="text-pink-600 font-bold text-sm uppercase tracking-wider">Saved Items</span>
      </div>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Your Wishlist</h1>
      <p className="text-gray-500 mb-8">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
