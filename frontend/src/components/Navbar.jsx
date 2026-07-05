import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount, clearCart } = useCart();
  const { lang, t, toggleLang } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropping, setDropping] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); setDropping(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (location.pathname.startsWith('/admin')) return null;

  const isActive = (path) => location.pathname === path;
  const handleLogout = () => {
    logout(); clearCart();
    setDropping(false); setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/menu', label: t.menu },
  ];

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '68px', position: 'sticky', top: 0, zIndex: 1000,
        background: 'var(--navbar)', borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--card-shadow)', transition: 'all 0.3s',
        width: '100%', boxSizing: 'border-box'
      }} className="main-navbar">

        {/* Logo */}
        <Link to="/" style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
          <span style={{ color: '#e84040' }}>Galkio</span>
          <span style={{ color: 'var(--text)' }}>Food</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', gap: '4px' }} className="nav-links">
          {navLinks.map(l => (
            <Link key={l.path} to={l.path} style={{
              fontSize: '14px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px',
              position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              color: isActive(l.path) ? '#e84040' : 'var(--text2)',
              background: isActive(l.path) ? 'rgba(232,64,64,0.08)' : 'transparent'
            }}>
              {l.label}
              {isActive(l.path) && (
                <span style={{ position: 'absolute', bottom: '-2px', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '2px', background: '#e84040', borderRadius: '2px' }} />
              )}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* Theme Toggle - hidden on mobile (available in drawer) */}
          <button onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'}
            style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            className="nav-links">
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Language Toggle - hidden on mobile (available in drawer) */}
          <button onClick={toggleLang} title="Change Language"
            style={{ padding: '6px 10px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
            className="nav-links lang-btn">
            🌐 <span>{lang.toUpperCase()}</span>
          </button>

          {/* Cart Badge - hidden on mobile (available in drawer) */}
          <Link to="/cart" style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}
            className="nav-links">
            🛒
            {itemCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#e84040', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' }}>
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* User Dropdown (Desktop) */}
          {user ? (
            <div style={{ position: 'relative' }} className="nav-links">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--card)', cursor: 'pointer' }}
                onClick={() => setDropping(!dropping)}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e84040', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 500 }} className="hide-mobile">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <span style={{ color: 'var(--text3)', fontSize: '11px', transition: 'transform 0.2s', transform: dropping ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
              </div>
              {dropping && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setDropping(false)} />
                  <div style={{ position: 'absolute', top: '50px', right: 0, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px', minWidth: '170px', zIndex: 999, boxShadow: 'var(--card-shadow)' }}>
                    <div style={{ padding: '8px 12px', marginBottom: '4px', borderBottom: '1px solid var(--border)' }}>
                      <p style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 600 }}>{user.name}</p>
                      <p style={{ color: 'var(--text3)', fontSize: '11px' }}>{user.email}</p>
                    </div>
                    {!user.isAdmin && user.hasOrdered && (
                      <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', color: 'var(--text2)', fontSize: '14px', borderRadius: '8px' }}
                        onClick={() => setDropping(false)}>
                        📦 {t.myOrders}
                      </Link>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', color: '#ef4444', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}
                      onClick={handleLogout}>
                      🚪 {t.logout}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }} className="nav-links">
              <Link to="/login" style={{ padding: '7px 16px', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', background: 'var(--card)', fontSize: '13px', fontWeight: 500 }}>
                {t.login}
              </Link>
              <Link to="/signup" style={{ padding: '7px 16px', background: '#e84040', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
                {t.signup}
              </Link>
            </div>
          )}

          {/* Hamburger Button (Mobile only) */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', flexDirection: 'column', gap: '5px', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', cursor: 'pointer', flexShrink: 0 }}
            className="hamburger-btn">
            <span style={{ width: '20px', height: '2px', background: 'var(--text)', borderRadius: '2px', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ width: '20px', height: '2px', background: 'var(--text)', borderRadius: '2px', transition: 'all 0.3s', opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ width: '20px', height: '2px', background: 'var(--text)', borderRadius: '2px', transition: 'all 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* ===== MOBILE DRAWER OVERLAY ===== */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1001, backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)} />
      )}

      {/* ===== MOBILE DRAWER ===== */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100vh', width: '280px',
        background: 'var(--card)', borderLeft: '1px solid var(--border)',
        zIndex: 1002, padding: '0', overflowY: 'auto', boxSizing: 'border-box',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease', boxShadow: '-4px 0 20px rgba(0,0,0,0.3)'
      }} className="mobile-drawer">

        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <Link to="/" style={{ fontSize: '18px', fontWeight: 800 }}>
            <span style={{ color: '#e84040' }}>Galkio</span>
            <span style={{ color: 'var(--text)' }}>Food</span>
          </Link>
          <button onClick={() => setMobileOpen(false)}
            style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* User Info (if logged in) */}
        {user && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#e84040', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {user.name[0].toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                <p style={{ color: 'var(--text3)', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div style={{ padding: '12px' }}>
          <p style={{ color: 'var(--text3)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', padding: '8px 8px 4px', textTransform: 'uppercase' }}>Menu</p>
          {navLinks.map(l => (
            <Link key={l.path} to={l.path}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', color: isActive(l.path) ? '#e84040' : 'var(--text2)', fontSize: '15px', fontWeight: isActive(l.path) ? 600 : 400, background: isActive(l.path) ? 'rgba(232,64,64,0.08)' : 'transparent', marginBottom: '4px' }}>
              {l.path === '/' ? '🏠' : '🍽️'} {l.label}
            </Link>
          ))}

          {/* Cart Link */}
          <Link to="/cart"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', color: 'var(--text2)', fontSize: '15px', marginBottom: '4px' }}>
            <span>🛒 {t.yourCart || 'Cart'}</span>
            {itemCount > 0 && (
              <span style={{ background: '#e84040', color: '#fff', borderRadius: '50px', padding: '2px 8px', fontSize: '12px', fontWeight: 700 }}>{itemCount}</span>
            )}
          </Link>

          {/* My Orders (if user ordered) */}
          {user && !user.isAdmin && user.hasOrdered && (
            <Link to="/orders"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', color: 'var(--text2)', fontSize: '15px', marginBottom: '4px' }}>
              📦 {t.myOrders}
            </Link>
          )}
        </div>

        {/* Settings Section */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text3)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', padding: '8px 8px 4px', textTransform: 'uppercase' }}>Settings</p>

          {/* Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', background: 'var(--bg2)', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text2)', fontSize: '14px' }}>
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <button onClick={toggleTheme}
              style={{ width: '48px', height: '26px', borderRadius: '50px', border: 'none', background: isDark ? '#e84040' : '#cbd5e1', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }}>
              <span style={{ position: 'absolute', top: '3px', left: isDark ? '24px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
            </button>
          </div>

          {/* Language Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', background: 'var(--bg2)', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text2)', fontSize: '14px' }}>🌐 Language</span>
            <button onClick={toggleLang}
              style={{ padding: '4px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
              {lang === 'en' ? '🇸🇴 SO' : '🇬🇧 EN'}
            </button>
          </div>
        </div>

        {/* Auth Buttons */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          {user ? (
            <button onClick={handleLogout}
              style={{ width: '100%', padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              🚪 {t.logout}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/login"
                style={{ display: 'block', padding: '12px', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', fontWeight: 500, textAlign: 'center', background: 'var(--bg2)' }}>
                {t.login}
              </Link>
              <Link to="/signup"
                style={{ display: 'block', padding: '12px', background: '#e84040', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>
                {t.signup}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CSS for hamburger visibility */}
      <style>{`
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          .nav-links { display: none !important; }
          .mobile-drawer { display: block !important; }
          .main-navbar { padding: 0 16px !important; }
          .hide-mobile { display: none !important; }
          .mobile-drawer { width: min(280px, 85vw) !important; }
        }
        @media (min-width: 769px) {
          .mobile-drawer { transform: translateX(100%) !important; }
        }
      `}</style>
    </>
  );
}