'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function MoviePage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/posts/${slug}`).then(r => r.json()).then(setPost);
  }, [slug]);

  if (!post) return <div style={{ background: '#0a0918', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Loading...</div>;

  return (
    <div style={{ background: '#0a0918', minHeight: '100vh', color: '#e5e7eb', fontFamily: 'Segoe UI, sans-serif' }}>
      <nav style={{ background: 'rgba(30,27,46,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(168,85,247,0.15)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 700, background: 'linear-gradient(to right, #c084fc, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🎬 CineVault</span>
        <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ background: 'rgba(30,27,46,0.7)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
          {post.thumbnail && <img src={post.thumbnail} alt={post.title} style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} />}
          <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>{post.title}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#6b7280', marginBottom: '1.5rem' }}>
              <span style={{ background: 'rgba(147,51,234,0.2)', color: '#c084fc', padding: '2px 12px', borderRadius: '999px' }}>{post.category}</span>
              {post.rating && <span>⭐ {post.rating}/10</span>}
              <span>👁 {post.views} views</span>
              {post.year && <span>📅 {post.year}</span>}
              {post.language && <span>🌐 {post.language}</span>}
            </div>

            {post.description && (
              <p style={{ color: '#d1d5db', lineHeight: 1.8, marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>{post.description}</p>
            )}

            {/* Download Links */}
            <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem' }}>🔗 Download Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
              {post.links?.map((link, i) => (
                <a key={i} href={link.isPremium ? '/premium' : link.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15,13,31,0.8)', border: `1px solid ${link.isPremium ? 'rgba(234,179,8,0.3)' : 'rgba(168,85,247,0.15)'}`, borderRadius: '12px', padding: '14px 16px', textDecoration: 'none', transition: 'border-color .2s' }}>
                  <div style={{ width: '36px', height: '36px', background: link.isPremium ? 'rgba(234,179,8,0.15)' : 'rgba(147,51,234,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {link.isPremium ? '👑' : '⬇️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontWeight: 500, margin: 0, fontSize: '14px' }}>{link.label} {link.isPremium && <span style={{ color: '#facc15', fontSize: '11px' }}>PREMIUM</span>}</p>
                    <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{link.isPremium ? 'Premium only' : 'Free download'}</p>
                  </div>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>👆 {link.clicks}</span>
                </a>
              ))}
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{ background: 'rgba(147,51,234,0.15)', color: '#c084fc', padding: '2px 12px', borderRadius: '999px', fontSize: '12px' }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
