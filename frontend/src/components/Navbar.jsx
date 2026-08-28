import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Heart, User, LogOut, Menu, X, Package, Store } from 'lucide-react'
import { AppContext } from '../App'

export default function Navbar() {
  const { user, cartCount, wishlist, logout, setCartOpen } = useContext(AppContext)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg shadow-primary-900/5 border-b border-white/50' : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/25 group-hover:shadow-primary-600/40 transition-shadow">
              <Store size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">
              ShopVerse
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {[
              { path: '/', label: 'Home' },
              { path: '/products', label: 'Products' },
              ...(user ? [{ path: '/orders', label: 'Orders' }] : []),
            ].map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <Link
              to="/wishlist"
              className={`relative p-2.5 rounded-xl transition-all ${
                isActive('/wishlist') ? 'bg-pink-50 text-pink-600' : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-[10px] font-bold min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center shadow-lg shadow-primary-600/30">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center space-x-1 ml-2">
                <Link to="/orders" className="p-2.5 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all">
                  <Package size={20} />
                </Link>
                <div className="flex items-center space-x-2 pl-2 ml-1 border-l border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium max-w-[100px] truncate">{user.name}</span>
                  <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex items-center space-x-1.5 ml-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary-600/25 transition-all hover:-translate-y-0.5"
              >
                <User size={16} />
                <span>Sign In</span>
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 animate-fade-in">
          <Link to="/" onClick={() => setMobileOpen(false)} className={`block py-2.5 px-3 rounded-lg font-medium ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-600'}`}>Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className={`block py-2.5 px-3 rounded-lg font-medium ${isActive('/products') ? 'bg-primary-50 text-primary-700' : 'text-gray-600'}`}>Products</Link>
          {user && (
            <Link to="/orders" onClick={() => setMobileOpen(false)} className={`block py-2.5 px-3 rounded-lg font-medium ${isActive('/orders') ? 'bg-primary-50 text-primary-700' : 'text-gray-600'}`}>Orders</Link>
          )}
          {user ? (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left py-2.5 px-3 rounded-lg text-red-500 font-medium">
              Logout
            </button>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-lg text-primary-600 font-medium">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  )
}
