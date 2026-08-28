import { useState, useEffect, useContext } from 'react'
import { Search, SlidersHorizontal, Package } from 'lucide-react'
import { AppContext } from '../App'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Accessories', 'Food & Drinks', 'Sports', 'Home & Living']

export default function ProductsPage() {
  const { api } = useContext(AppContext)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = {}
        if (category !== 'All') params.category = category
        if (search) params.search = search
        const res = await api.get('/api/products', { params })
        setProducts(res.data || [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounce)
  }, [api, search, category])

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'newest') return b.id - a.id
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Package size={18} className="text-primary-600" />
          <span className="text-primary-600 font-bold text-sm uppercase tracking-wider">Our Collection</span>
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-500 mt-1">Discover our complete collection of premium products</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 text-sm bg-gray-50/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm text-gray-700 bg-transparent focus:outline-none font-medium"
              >
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-600/20'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{sorted.length}</span> product{sorted.length !== 1 ? 's' : ''}
            {category !== 'All' && <span> in <span className="font-semibold text-primary-600">{category}</span></span>}
          </p>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-100">
              <div className="h-52 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-600 text-lg font-semibold">No products found</p>
          <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
          <button
            onClick={() => { setSearch(''); setCategory('All'); }}
            className="mt-4 text-primary-600 text-sm font-medium hover:text-primary-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
          {sorted.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
