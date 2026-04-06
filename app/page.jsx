'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [page, category]);

  async function fetchPosts() {
    const params = new URLSearchParams({ page, category, q: search });
    const res = await fetch(`/api/posts?${params}`);
    const data = await res.json();
    setPosts(data.posts);
    setTotalPages(data.pages);
  }

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  return (
    <div style={{ background: '#0a0918', minHeight: '100vh', color: '#e5e7eb', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ background: 'rgba(30,27,46,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(168,85,247,0.15)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <span style={{ fontSize: '1.4rem', fontWeight: 700, background: 'linear-gradient(to right, #c084fc, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🎬 CineVault
        </span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/premium" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>👑 Premium</Link>
          <Link href="/admin" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>Admin</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '4rem 1rem 2rem', background: 'linear-gradient(to bottom, rgba(147,51,234,0.15), transparent)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(to right, #d8b4fe, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>CineVault</h1>
        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Movies, Web Series & more — Free direct download links</p>
        <div style={{ maxWidth: '500px', margin: '0 auto 1.5rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchPosts()}
            style={{ width: '100%', padding: '12px 48px 12px 16px', background: 'rgba(15,13,31,0.9)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
          />
          <button onClick={fetchPosts} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>🔍</button>
        </div>
        {/* Categories */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
          {['all', ...categories.map(c => c.slug)].map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
              style={{ padding: '4px 16px', borderRadius: '999px', fontSize: '13px', border: 'none', cursor: 'pointer', background: category === cat ? '#9333ea' : 'rgba(30,27,46,0.7)', color: category === cat ? '#fff' : '#9ca3af', transition: 'all .2s' }}>
              {cat === 'all' ? 'All' : categories.find(c => c.slug === cat)?.name || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem 4rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>Latest Movies</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {posts.map(post => (
            <Link key={post._id} href={`/movie/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(30,27,46,0.7)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '12px', overflow: 'hidden', transition: 'transform .3s, box-shadow .3s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(168,85,247,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt={post.title} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                ) : (
                  <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, rgba(88,28,135,0.6), rgba(22,19,43,1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🎬</div>
                )}
                <div style={{ padding: '1rem' }}>
                  <span style={{ background: 'rgba(147,51,234,0.2)', color: '#c084fc', fontSize: '11px', padding: '2px 10px', borderRadius: '999px' }}>{post.category}</span>
                  <h3 style={{ color: '#fff', fontWeight: 600, margin: '8px 0 4px', fontSize: '15px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 8px' }}>{post.year} · {post.language}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                    <span>👁 {post.views}</span>
                    {post.rating && <span>⭐ {post.rating}</span>}
                    <span>🔗 {post.links?.length || 0} links</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ width: '40px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: page === p ? '#9333ea' : 'rgba(30,27,46,0.7)', color: page === p ? '#fff' : '#9ca3af', fontSize: '14px', fontWeight: 500 }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
