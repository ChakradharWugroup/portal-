import React, { useEffect, useState } from 'react';
import { Bot, Youtube, Upload, Clock, FileText, CheckCircle, Video, Activity, Download, Users } from 'lucide-react';

type Meeting = {
  id: string;
  title: string;
  status: 'live' | 'completed' | 'scheduled';
  participants?: number;
  duration: string;
  summary?: string;
  sentiment?: string;
  tokens_used?: string | number;
  processing_time?: string;
  step_timings?: string;
};

export default function MeetingAIView({ lang }: { lang?: string }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [botUrl, setBotUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchMeetings = async () => {
    try {
      const res = await fetch(`https://${window.location.hostname}:8440/api/meetings`);
      if (res.ok) {
        const data = await res.json();
        setMeetings(data);
      }
    } catch (e) {
      console.error('Failed to fetch meetings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
    const interval = setInterval(fetchMeetings, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botUrl) return;
    setDispatchStatus('Dispatching...');
    try {
      const res = await fetch(`https://${window.location.hostname}:8440/api/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: botUrl }),
      });
      if (res.ok) {
        setDispatchStatus('Bot dispatched successfully!');
        setBotUrl('');
        fetchMeetings();
      } else {
        setDispatchStatus('Failed to dispatch bot');
      }
    } catch (err) {
      console.error(err);
      setDispatchStatus('Error connecting to AI service');
    }
    setTimeout(() => setDispatchStatus(''), 5000);
  };

  const handleYoutube = async (e: React.FormEvent) => {
    e.preventDefault();
    setDispatchStatus('Dispatching YouTube Bot...');
    try {
      const res = await fetch(`https://${window.location.hostname}:8440/api/youtube`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ url: youtubeUrl }) 
      });
      if (res.ok) {
        setDispatchStatus('YouTube processing started!');
        setYoutubeUrl('');
        fetchMeetings();
      } else {
        setDispatchStatus('Failed to start YouTube processing');
      }
    } catch (err) {
      console.error(err);
      setDispatchStatus('Error connecting to AI service');
    }
    setTimeout(() => setDispatchStatus(''), 5000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadStatus(`Uploading ${file.name}...`);
    
    try {
      const chunkSize = 1024 * 1024 * 2; // 2MB
      const totalChunks = Math.ceil(file.size / chunkSize);
      let sessionId = Date.now().toString();

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('session_id', sessionId);
        formData.append('chunk_index', String(i));
        formData.append('total_chunks', String(totalChunks));
        formData.append('filename', file.name);
        
        const res = await fetch(`https://${window.location.hostname}:8440/api/upload-chunk`, { 
          method: 'POST', 
          body: formData 
        });
        
        if (!res.ok) {
          const errText = await res.text();
          setUploadStatus(`Upload failed on chunk ${i + 1}`);
          setIsUploading(false);
          return;
        }
        setUploadStatus(`Uploading: ${Math.round(((i + 1) / totalChunks) * 100)}%`);
      }
      setUploadStatus('Upload complete. Processing audio...');
      fetchMeetings();
      setTimeout(() => setUploadStatus(''), 5000);
    } catch (error) {
      console.error(error);
      setUploadStatus('Upload failed');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'badge-approved';
      case 'negative': return 'badge-rejected';
      case 'neutral': return 'badge-pending';
      default: return 'badge-pending';
    }
  };

  const liveMeetings = meetings.filter(m => m.status === 'live' || m.status === 'scheduled');
  const completedMeetings = meetings.filter(m => m.status === 'completed');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Teams/Zoom Input */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video size={18} className="text-primary" /> Send the AI Notetaker
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Paste your Microsoft Teams meeting link below, and the AI bot will automatically join as a guest.
            </p>
          </div>
          <form onSubmit={handleDispatch} style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1 }}
              placeholder="https://teams.microsoft.com/l/meetup-join/..."
              value={botUrl}
              onChange={(e) => setBotUrl(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!botUrl || dispatchStatus.includes('Dispatch')}
            >
              <Bot size={16} /> Dispatch Bot
            </button>
          </form>
          {dispatchStatus && !dispatchStatus.includes('YouTube') && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{dispatchStatus}</p>}
        </div>

        {/* YouTube Input */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Youtube size={18} className="text-primary" /> Transcribe YouTube Video
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Paste a YouTube URL. The bot will download and transcribe it automatically.
            </p>
          </div>
          <form onSubmit={handleYoutube} style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1 }}
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!youtubeUrl || dispatchStatus.includes('YouTube')}
            >
              Transcribe
            </button>
          </form>
          {dispatchStatus && dispatchStatus.includes('YouTube') && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{dispatchStatus}</p>}
        </div>
      </div>

      {/* Local Upload */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} className="text-primary" /> Upload Local Recording
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Have a video or audio file? Upload it directly for AI transcription.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {uploadStatus && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{uploadStatus}</span>}
          <label className="btn" style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.7 : 1 }}>
            <Upload size={16} /> {isUploading ? 'Uploading...' : 'Select File'}
            <input type="file" accept="video/*,audio/*" style={{ display: 'none' }} onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      {/* Grid Layout for Meetings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Active/Scheduled */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} className="text-primary" /> Active & Scheduled
          </h2>
          {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading meetings...</p> : 
           liveMeetings.length === 0 ? <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No active meetings.</div> :
           liveMeetings.map(m => (
             <div key={m.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{m.title}</h4>
                 <span className="category-badge" style={{ backgroundColor: 'var(--primary-glass)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                   {m.status.toUpperCase()}
                 </span>
               </div>
               <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.summary}</p>
               <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {m.participants ?? 0} participants</span>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {m.duration}</span>
               </div>
             </div>
           ))
          }
        </div>

        {/* Completed Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} className="text-primary" /> Recent Intelligence
          </h2>
          {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading intelligence...</p> : 
           completedMeetings.length === 0 ? <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No completed meetings yet.</div> :
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
             {completedMeetings.map(m => (
               <div key={m.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{m.title}</h4>
                   {m.sentiment && <span className={`badge ${getSentimentColor(m.sentiment)}`}>{m.sentiment}</span>}
                 </div>
                 <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.summary}</p>
                 
                 <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {m.participants ?? 0}</span>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {m.duration}</span>
                   </span>
                   <a 
                     href={`https://${window.location.hostname}:8440/api/meetings/${m.id}/pdf`} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="category-badge"
                     style={{ textDecoration: 'none', backgroundColor: 'var(--primary-glass)', color: 'var(--primary)', padding: '0.4rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                   >
                     <Download size={14} /> Download PDF
                   </a>
                 </div>

                 {(m.tokens_used || m.processing_time) && (
                   <div style={{ fontSize: '0.8rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     {m.tokens_used && <span style={{ color: 'var(--primary)' }}>? {typeof m.tokens_used === 'number' ? m.tokens_used.toLocaleString() : m.tokens_used} tokens</span>}
                     {m.processing_time && <span style={{ color: 'var(--success)' }}>? {m.processing_time}</span>}
                   </div>
                 )}
               </div>
             ))}
           </div>
          }
        </div>
      </div>
    </div>
  );
}
