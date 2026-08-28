import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Truck, Shield, RefreshCw, Star, Zap, Crown, TrendingUp } from 'lucide-react'
import { AppContext } from '../App'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  { name: 'Electronics', emoji: '🔌', color: 'from-blue-500 to-indigo-600', count: '50+ items' },
  { name: 'Clothing', emoji: '👔', color: 'from-pink-500 to-rose-600', count: '30+ items' },
  { name: 'Accessories', emoji: '💎', color: 'from-amber-500 to-orange-600', count: '25+ items' },
  { name: 'Food & Drinks', emoji: '🍕', color: 'from-green-500 to-emerald-600', count: '20+ items' },
  { name: 'Sports', emoji: '⚽', color: 'from-purple-500 to-violet-600', count: '15+ items' },
  { name: 'Home & Living', emoji: '🏠', color: 'from-teal-500 to-cyan-600', count: '20+ items' },
]

const STATS = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Premium Products' },
  { value: '99%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Support Available' },
]

export default function HomePage() {
  const { api } = useContext(AppContext)
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products')
        setFeatured((res.data || []).slice(0, 8))
      } catch {
        setFeatured([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [api])

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50', color: 'text-blue-600 bg-blue-50' },
    { icon: Shield, title: 'Secure Payment', desc: '100% protected checkout', color: 'text-green-600 bg-green-50' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy', color: 'text-orange-600 bg-orange-50' },
    { icon: Sparkles, title: 'Best Quality', desc: 'Curated premium products', color: 'text-purple-600 bg-purple-50' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative hero-pattern overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-sm">
                <Sparkles size={14} />
                <span>New Collection 2026</span>
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
              </span>

              <h1 className="font-display text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
                Discover Your{' '}
                <span className="gradient-text">
                  Perfect Style
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                Explore our curated collection of premium products. From tech gadgets to everyday essentials, find everything you need in one place.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-primary-600/25 transition-all hover:-translate-y-0.5"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border border-gray-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all"
                >
                  <span>Browse Categories</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl lg:text-3xl font-bold gradient-text">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="absolute w-80 h-80 bg-gradient-to-br from-primary-200/40 to-purple-200/40 rounded-full blur-3xl animate-float" />
              <div className="relative grid grid-cols-2 gap-4">
                {[
                  { emoji: '🎧', color: 'from-violet-500 to-purple-600', label: 'Audio' },
                  { emoji: '⌚', color: 'from-emerald-500 to-teal-600', label: 'Wearables' },
                  { emoji: '👟', color: 'from-orange-500 to-red-500', label: 'Sports' },
                  { emoji: '💻', color: 'from-blue-500 to-indigo-600', label: 'Tech' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`w-36 h-36 bg-gradient-to-br ${item.color} rounded-2xl flex flex-col items-center justify-center shadow-2xl shadow-gray-900/10 card-hover ${i % 2 === 0 ? 'mt-8' : ''}`}
                  >
                    <span className="text-5xl mb-2">{item.emoji}</span>
                    <span className="text-white/90 text-xs font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center space-x-3 group">
                <div className={`p-3 rounded-xl ${f.color} transition-transform group-hover:scale-110`}>
                  <f.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-primary-600 font-bold text-sm uppercase tracking-wider">Browse by Category</span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Shop by Category</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">Find exactly what you are looking for in our diverse collection</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-stagger">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products`}
              className="group text-center"
            >
              <div className={`w-full aspect-square bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-gray-900/5 card-hover group-hover:shadow-xl`}>
                <span className="text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp size={18} className="text-primary-600" />
                <span className="text-primary-600 font-bold text-sm uppercase tracking-wider">Trending Now</span>
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Handpicked just for you</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center space-x-2 bg-white text-primary-600 px-5 py-2.5 rounded-xl font-semibold border border-primary-200 hover:bg-primary-50 transition-all">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

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
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="sm:hidden mt-6 text-center">
            <Link to="/products" className="inline-flex items-center space-x-2 text-primary-600 font-semibold">
              <span>View All Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center space-x-2 mb-3">
                <Zap size={16} className="text-yellow-300" />
                <span className="text-primary-200 text-sm font-bold uppercase tracking-wider">Flash Sale</span>
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">Up to 40% Off</h3>
              <p className="text-primary-200 text-sm mb-6">On selected electronics and accessories</p>
              <Link to="/products" className="inline-flex items-center space-x-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors text-sm">
                <span>Shop the Sale</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center space-x-2 mb-3">
                <Crown size={16} className="text-yellow-200" />
                <span className="text-orange-100 text-sm font-bold uppercase tracking-wider">Premium</span>
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">New Arrivals</h3>
              <p className="text-orange-100 text-sm mb-6">Check out the latest premium collection</p>
              <Link to="/products" className="inline-flex items-center space-x-2 bg-white text-orange-700 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors text-sm">
                <span>Explore Now</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-primary-600 font-bold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mt-2">What Our Customers Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah J.', role: 'Verified Buyer', text: 'Amazing quality products! The delivery was super fast and the packaging was premium. Will definitely order again.', rating: 5 },
              { name: 'Mike R.', role: 'Regular Customer', text: 'ShopVerse has become my go-to for all shopping. Great prices, excellent customer service, and easy returns.', rating: 5 },
              { name: 'Emily K.', role: 'Verified Buyer', text: 'Love the curated collection! Every product I have bought has exceeded my expectations. Highly recommend to everyone.', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 card-hover">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-purple-600">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">Ready to Start Shopping?</h2>
            <p className="text-primary-200 mt-4 max-w-md mx-auto text-lg">
              Join thousands of happy customers and discover amazing deals every day.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center space-x-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-all hover:-translate-y-0.5 shadow-xl shadow-primary-900/20"
              >
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center space-x-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
              >
                <span>Browse Products</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="font-display font-bold text-gray-900">ShopVerse</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">Your one-stop destination for premium products at unbeatable prices.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Shop</h4>
              <div className="space-y-2">
                <Link to="/products" className="block text-sm text-gray-500 hover:text-primary-600 transition-colors">All Products</Link>
                <Link to="/products" className="block text-sm text-gray-500 hover:text-primary-600 transition-colors">Electronics</Link>
                <Link to="/products" className="block text-sm text-gray-500 hover:text-primary-600 transition-colors">Clothing</Link>
                <Link to="/products" className="block text-sm text-gray-500 hover:text-primary-600 transition-colors">Accessories</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Support</h4>
              <div className="space-y-2">
                <span className="block text-sm text-gray-500">Help Center</span>
                <span className="block text-sm text-gray-500">Shipping Info</span>
                <span className="block text-sm text-gray-500">Returns</span>
                <span className="block text-sm text-gray-500">Contact Us</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
              <div className="space-y-2">
                <span className="block text-sm text-gray-500">About Us</span>
                <span className="block text-sm text-gray-500">Careers</span>
                <span className="block text-sm text-gray-500">Privacy Policy</span>
                <span className="block text-sm text-gray-500">Terms of Service</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">&copy; 2026 ShopVerse. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-xs text-gray-400">Built with React + Go + Kubernetes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
