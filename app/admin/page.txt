'use client';
import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [section, setSection] = useState('dashboard');
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0 });

  // New post form state
  const [form, setForm] = useState({
    title: '', category: '', genre: '', year: '', language: '',
    rating: '', description: '', thumbnail: '', tags: '', status: 'published',
    links: [{ label: '', url: '', isPremium: false }]
  });

  useEffect(() => {
    if (section === 'dashboard' || section === 'manage') {
      fetch('/api/posts?page=1').then(r => r.json()).then(data => {
        setPosts(data.posts);
        setStats({ total: data.total });
      });
    }
  }, [section]);

  async function submitPost(e) {
    e.preventDefault();
    const body = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      links: form.links.filter(l => l.label && l.url),
    };
    const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      alert('Post published!');
      setForm({ title: '', category: '', genre: '', year: '', language: '', rating: '', description: '', thumbnail: '', tags: '', status: 'published', links: [{ label: '', url: '', isPremium: false }] });
    }
  }

  async function deletePost(id) {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setPosts(posts.filter(p => p._id !== id));
  }

  const addLink = () => setForm(f => ({ ...f, links: [...f.links, { label: '', url: '', isPremium: false }] }));
  const updateLink = (i, key, val) => setForm(f => {
    const links = [...f.links];
    links[i][key] = val;
    return { ...f, links };
  });

  const s = { background: '#0a0918', minHeight: '100vh', display: 'flex', color: '#e5e7eb', fontFamily: 'Segoe UI, sans-serif' };
  const sidebarStyle = { width: '220px', background: 'rgba(30,27,46,0.85)', borderRight: '1px solid rgba(168,85,247,0.15)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '4px' };
  const navBtn = (sec) => ({
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', background: section === sec ? 'rgba(147,51,234,0.2)' : 'transparent', color: section === sec ? '#d8b4fe' : '#9ca3af', width: '100%', textAlign: 'left'
  });
  const inputStyle = { width: '100%', padding: '10px 14px', background: 'rgba(15,13,31,0.8)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px', color: '#e5e7eb', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginTop: '6px' };
  const labelStyle = { display: 'block', color: '#9ca3af', fontSize: '13px' };
  const cardStyle = { background: 'rgba(30,27,46,0.7)', border: '1px solid rgba(168,85,247,0.1)', borderRadius: '12px', padding: '1.25rem' };

  return (
    <div style={s}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(168,85,247,0.15)' }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', background: 'linear-gradient(to right, #c084fc, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🎬 CineVault</div>
          <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>Admin Panel</div>
        </div>
        <button style={navBtn('dashboard')} onClick={() => setSection('dashboard')}>📊 Dashboard</button>
        <button style={navBtn('add')} onClick={() => setSection('add')}>➕ Add Movie</button>
        <button style={navBtn('manage')} onClick={() => setSection('manage')}>📋 Manage Posts</button>
        <button style={navBtn('categories')} onClick={() => setSection('categories')}>🏷️ Categories</button>
        <button style={navBtn('settings')} onClick={() => setSection('settings')}>⚙️ Settings</button>
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(168,85,247,0.15)' }}>
          <a href="/" style={{ ...navBtn(''), display: 'flex', textDecoration: 'none', color: '#9ca3af' }}>🌐 View Site</a>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>

        {/* Dashboard */}
        {section === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[['Total Posts', stats.total, '📄'], ['Total Views', '124k', '👁'], ['Users', '3,241', '👤'], ['Premium', '187', '👑']].map(([label, val, icon]) => (
                <div key={label} style={cardStyle}>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 4px' }}>{icon} {label}</p>
                  <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{val}</p>
                </div>
              ))}
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Posts</h2>
            <div style={{ background: 'rgba(30,27,46,0.7)', border: '1px solid rgba(168,85,247,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead><tr style={{ borderBottom: '1px solid rgba(168,85,247,0.1)' }}>
                  {['Title', 'Category', 'Views', 'Date', 'Actions'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 500, fontSize: '12px' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {posts.slice(0, 5).map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(168,85,247,0.07)' }}>
                      <td style={{ padding: '12px 16px', color: '#fff' }}>{p.title}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ background: 'rgba(147,51,234,0.2)', color: '#c084fc', fontSize: '11px', padding: '2px 8px', borderRadius: '999px' }}>{p.category}</span></td>
                      <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{p.views}</td>
                      <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => deletePost(p._id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Post */}
        {section === 'add' && (
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>Add New Movie</h1>
            <form onSubmit={submitPost} style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Kalki 2898 AD" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select</option>
                    {['Bollywood', 'Hollywood', 'Web Series', 'South Indian', 'Animation'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Genre</label>
                  <input style={inputStyle} value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} placeholder="Action, Sci-Fi" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div><label style={labelStyle}>Year</label><input style={inputStyle} value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2024" /></div>
                <div><label style={labelStyle}>Language</label><input style={inputStyle} value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} placeholder="Hindi" /></div>
                <div><label style={labelStyle}>Rating</label><input style={inputStyle} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} placeholder="8.3" /></div>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Movie story..." />
              </div>
              <div>
                <label style={labelStyle}>Thumbnail URL</label>
                <input style={inputStyle} value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input style={inputStyle} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="prabhas, sci-fi, 2024" />
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: '8px' }}>Download Links</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {form.links.map((link, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input style={{ ...inputStyle, flex: 1, marginTop: 0 }} placeholder="Label (e.g. 720p - 1.4GB)" value={link.label} onChange={e => updateLink(i, 'label', e.target.value)} />
                      <input style={{ ...inputStyle, flex: 2, marginTop: 0 }} placeholder="URL" value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} />
                      <label style={{ color: '#9ca3af', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                        <input type="checkbox" checked={link.isPremium} onChange={e => updateLink(i, 'isPremium', e.target.checked)} style={{ width: 'auto' }} /> Premium
                      </label>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addLink} style={{ marginTop: '8px', background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', fontSize: '14px' }}>+ Add Link</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={{ background: '#9333ea', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                🚀 Publish Post
              </button>
            </form>
          </div>
        )}

        {/* Manage Posts */}
        {section === 'manage' && (
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>Manage Posts ({stats.total})</h1>
            <div style={{ background: 'rgba(30,27,46,0.7)', border: '1px solid rgba(168,85,247,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead><tr style={{ borderBottom: '1px solid rgba(168,85,247,0.1)' }}>
                  {['Title', 'Category', 'Views', 'Links', 'Date', 'Actions'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 500, fontSize: '12px' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(168,85,247,0.07)' }}>
                      <td style={{ padding: '12px 16px', color: '#fff', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ background: 'rgba(147,51,234,0.2)', color: '#c084fc', fontSize: '11px', padding: '2px 8px', borderRadius: '999px' }}>{p.category}</span></td>
                      <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{p.views}</td>
                      <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{p.links?.length || 0}</td>
                      <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <a href={`/movie/${p.slug}`} target="_blank" style={{ color: '#9ca3af', fontSize: '14px' }}>👁</a>
                          <button onClick={() => deletePost(p._id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings */}
        {section === 'settings' && (
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>Settings</h1>
            <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[['Site Name', 'CineVault'], ['Site URL', 'https://...'], ['Telegram Bot', '@YourBot'], ['Telegram Channel', 'https://t.me/...'], ['UPI ID', 'yourname@upi']].map(([label, placeholder]) => (
                <div key={label}>
                  <label style={labelStyle}>{label}</label>
                  <input style={inputStyle} placeholder={placeholder} />
                </div>
              ))}
              <button style={{ background: '#9333ea', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 600, cursor: 'pointer' }}>💾 Save Settings</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
