import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const { t, lang, toggleLang } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => { logout(); clearCart(); window.location.href = '/'; };
  const isActive = (path) => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const NAV = [
    { path:'/admin', label:t.dashboard, icon:'📊' },
    { path:'/admin/orders', label:t.orders, icon:'📦' },
    { path:'/admin/menu', label:t.menuItems, icon:'🍽️' },
    { path:'/admin/users', label:t.users, icon:'👥' },
  ];

  const sidebarBg = '#0d1120';
  const sidebarBorder = '#1e2d3d';
  const mainBg = 'var(--bg)';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)';

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:mainBg }}>

      {/* ===== MOBILE TOP BAR (hamburger only, hidden when drawer open) ===== */}
      {!mobileOpen && (
        <div className="admin-mobile-topbar" style={{
          display:'none', alignItems:'center', gap:'14px',
          position:'fixed', top:0, left:0, right:0, height:'56px',
          background:sidebarBg, borderBottom:`1px solid ${sidebarBorder}`,
          padding:'0 16px', zIndex:1003, boxSizing:'border-box'
        }}>
          <button onClick={() => setMobileOpen(true)}
            style={{ display:'flex', flexDirection:'column', gap:'5px', padding:'8px', borderRadius:'8px', border:`1px solid ${sidebarBorder}`, background:cardBg, cursor:'pointer', flexShrink:0 }}>
            <span style={{ width:'20px', height:'2px', background:'#fff', borderRadius:'2px' }} />
            <span style={{ width:'20px', height:'2px', background:'#fff', borderRadius:'2px' }} />
            <span style={{ width:'20px', height:'2px', background:'#fff', borderRadius:'2px' }} />
          </button>
          <div style={{ fontSize:'17px', fontWeight:800 }}>
            <span style={{ color:'#e84040' }}>Galkio</span><span style={{ color:'#fff' }}>Food</span>
          </div>
        </div>
      )}

      {/* ===== DRAWER OVERLAY ===== */}
      {mobileOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1001, backdropFilter:'blur(2px)' }}
          onClick={() => setMobileOpen(false)} />
      )}

      {/* ===== SIDEBAR / DRAWER ===== */}
      <aside style={{
        width:'240px', background:sidebarBg, borderRight:`1px solid ${sidebarBorder}`,
        display:'flex', flexDirection:'column', padding:'20px 14px',
        position:'fixed', top:0, left:0, bottom:0, zIndex:1002,
        overflowY:'auto', overflowX:'hidden', boxSizing:'border-box'
      }} className={`admin-sidebar${mobileOpen ? ' sidebar-open' : ''}`}>

        {/* Brand row + mobile close button */}
        <div style={{ marginBottom:'28px', paddingLeft:'8px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:'20px', fontWeight:800, whiteSpace:'nowrap' }}>
              <span style={{ color:'#e84040' }}>Galkio</span><span style={{ color:'#fff' }}>Food</span>
            </div>
            <div style={{ color:'#64748b', fontSize:'11px', marginTop:'2px', whiteSpace:'nowrap' }}>Admin Panel</div>
          </div>
          <button
            className="admin-sidebar-close"
            onClick={() => setMobileOpen(false)}
            style={{ display:'none', background:cardBg, border:`1px solid ${sidebarBorder}`, borderRadius:'8px', color:'#fff', width:'30px', height:'30px', cursor:'pointer', fontSize:'14px', flexShrink:0 }}>
            ✕
          </button>
        </div>

        <div style={{ color:'#475569', fontSize:'10px', fontWeight:700, letterSpacing:'1px', marginBottom:'8px', paddingLeft:'8px' }}>
          MANAGEMENT
        </div>

        <nav style={{ display:'flex', flexDirection:'column', gap:'3px', flex:1 }}>
          {NAV.map(item => (
            <Link key={item.path} to={item.path} title={item.label} style={{
              display:'flex', alignItems:'center', gap:'12px',
              padding:'11px 12px', borderRadius:'10px',
              color: isActive(item.path) ? '#fff' : '#64748b',
              fontSize:'14px', fontWeight:500, position:'relative',
              background: isActive(item.path) ? 'rgba(232,64,64,0.15)' : 'transparent',
              borderLeft: isActive(item.path) ? '3px solid #e84040' : '3px solid transparent',
              transition:'all 0.2s'
            }}>
              <span style={{ fontSize:'18px', width:'22px', textAlign:'center', flexShrink:0 }}>{item.icon}</span>
              <span style={{ whiteSpace:'nowrap' }}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ borderTop:`1px solid ${sidebarBorder}`, paddingTop:'14px', display:'flex', flexDirection:'column', gap:'8px' }}>
          <div style={{ display:'flex', gap:'6px' }}>
            <button onClick={toggleTheme}
              style={{ flex:1, padding:'8px', background:cardBg, border:`1px solid ${sidebarBorder}`, borderRadius:'8px', color:'#94a3b8', fontSize:'14px', cursor:'pointer' }}
              title={isDark ? 'Light Mode' : 'Dark Mode'}>
              {isDark ? '☀️' : '🌙'}
            </button>
            <button onClick={toggleLang}
              style={{ flex:1, padding:'8px', background:cardBg, border:`1px solid ${sidebarBorder}`, borderRadius:'8px', color:'#94a3b8', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
              🌐 {lang.toUpperCase()}
            </button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 10px', background:cardBg, borderRadius:'12px', border:`1px solid ${sidebarBorder}` }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#e84040', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:700, color:'#fff', flexShrink:0 }}>
              {user?.name?.[0] || 'A'}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:'#fff', fontSize:'12px', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</p>
              <p style={{ color:'#64748b', fontSize:'10px' }}>Super Admin</p>
            </div>
            <button onClick={handleLogout}
              style={{ background:'transparent', border:`1px solid #ef4444`, borderRadius:'8px', color:'#ef4444', padding:'5px 8px', cursor:'pointer', fontSize:'13px', flexShrink:0 }}
              title={t.logout}>🚪</button>
          </div>
        </div>
      </aside>

      <main style={{ marginLeft:'240px', flex:1, padding:'28px', minHeight:'100vh', background:mainBg, transition:'margin-left 0.2s, background 0.3s', boxSizing:'border-box' }} className="admin-main">
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-topbar { display: flex !important; }
          .admin-sidebar {
            width: min(280px, 85vw) !important;
            background: #0d1120 !important;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            box-shadow: 4px 0 20px rgba(0,0,0,0.3);
          }
          .admin-sidebar.sidebar-open {
            transform: translateX(0);
          }
          .admin-sidebar-close {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .admin-main {
            margin-left: 0 !important;
            padding: 16px !important;
            padding-top: 72px !important;
            width: 100%;
          }
        }
        @media (min-width: 769px) {
          .admin-mobile-topbar { display: none !important; }
        }
      `}</style>
    </div>
  );
}