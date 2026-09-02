import React, { useState, useEffect } from 'react';
import { Database, Folder, QrCode, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function QRManagementView({ lang }: { lang: string }) {
  const [activeTab, setActiveTab] = useState<'collections' | 'qrcodes'>('collections');
  const [collections, setCollections] = useState<any[]>([]);
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);

  // Fetch Collections
  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://${window.location.hostname}:8445/api/qr/collections`);
      const data = await res.json();
      if (data.status === 'success') {
        setCollections(data.data);
      } else {
        setError(data.message || 'Failed to fetch collections');
      }
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  // Fetch QR Codes
  const fetchQRCodes = async (collectionId?: number) => {
    setLoading(true);
    setError(null);
    try {
      const url = collectionId 
        ? `https://${window.location.hostname}:8445/api/qr/garment-codes?collection_id=${collectionId}`
        : `https://${window.location.hostname}:8445/api/qr/garment-codes`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'success') {
        setQrCodes(data.data);
      } else {
        setError(data.message || 'Failed to fetch QR codes');
      }
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'collections') {
      fetchCollections();
    } else if (activeTab === 'qrcodes') {
      fetchQRCodes(selectedCollection || undefined);
    }
  }, [activeTab, selectedCollection]);

  const tableCellStyle: React.CSSProperties = {
    padding: '0.75rem 0.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-color)'
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* Header Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => { setActiveTab('collections'); setSelectedCollection(null); }}
          style={{
            background: activeTab === 'collections' ? 'var(--primary-glass)' : 'transparent',
            color: activeTab === 'collections' ? 'var(--primary)' : 'var(--text-muted)',
            border: activeTab === 'collections' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
            padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
          }}
        >
          <Folder size={18} /> {lang === 'zh-CN' || lang === 'zh-TW' ? '集合 (Collections)' : 'Collections'}
        </button>
        <button 
          onClick={() => setActiveTab('qrcodes')}
          style={{
            background: activeTab === 'qrcodes' ? 'var(--primary-glass)' : 'transparent',
            color: activeTab === 'qrcodes' ? 'var(--primary)' : 'var(--text-muted)',
            border: activeTab === 'qrcodes' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
            padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
          }}
        >
          <QrCode size={18} /> {lang === 'zh-CN' || lang === 'zh-TW' ? '服装 QR 码' : 'Garment QR Codes'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          <div>
            <strong>TiDB Connection Error:</strong> {error}
            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Make sure you have added your actual password in <code>django_backend/core_api/qr_views.py</code></div>
          </div>
        </div>
      )}

      {loading && !error ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--primary)' }}>
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <>
          {activeTab === 'collections' && (
            <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Collection Name</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Created At</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((col: any) => (
                    <tr key={col.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ ...tableCellStyle, fontWeight: 600, color: 'var(--primary)' }}>{col.id}</td>
                      <td style={tableCellStyle}>{col.name}</td>
                      <td style={tableCellStyle}>{new Date(col.created_at).toLocaleString()}</td>
                      <td style={tableCellStyle}>
                        <button 
                          className="btn"
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => {
                            setSelectedCollection(col.id);
                            setActiveTab('qrcodes');
                          }}
                        >
                          View QR Codes
                        </button>
                      </td>
                    </tr>
                  ))}
                  {collections.length === 0 && !error && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No collections found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'qrcodes' && (
            <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
              {selectedCollection && (
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => setActiveTab('collections')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ArrowLeft size={16} /> Back to Collections
                  </button>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>| Showing QR Codes for Collection #{selectedCollection}</span>
                </div>
              )}
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>ID</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Col ID</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Company</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Style</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Bed/Bundle</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Color/Size</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Qty</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>QR Data</th>
                  </tr>
                </thead>
                <tbody>
                  {qrCodes.map((qr: any) => (
                    <tr key={qr.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ ...tableCellStyle, fontWeight: 600, color: 'var(--primary)' }}>{qr.id}</td>
                      <td style={tableCellStyle}>{qr.collection_id}</td>
                      <td style={tableCellStyle}>{qr.company_name}</td>
                      <td style={{ ...tableCellStyle, fontWeight: 600 }}>{qr.style_no}</td>
                      <td style={tableCellStyle}>{qr.bed_no} / {qr.bundle_no}</td>
                      <td style={tableCellStyle}>{qr.color} - {qr.size}</td>
                      <td style={tableCellStyle}>{qr.quantity}</td>
                      <td style={{ ...tableCellStyle, fontSize: '0.75rem', fontFamily: 'monospace' }}>{qr.qr_data?.substring(0, 20)}...</td>
                    </tr>
                  ))}
                  {qrCodes.length === 0 && !error && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No QR codes found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
