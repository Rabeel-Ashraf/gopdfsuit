import React, { useState, useRef, useEffect } from 'react'
import {
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  X,
  Loader2
} from 'lucide-react'

export default function PdfPreview({ pdfUrl, onClose, title = "PDF Preview" }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [pdfUrl])

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `preview-${Date.now()}.pdf`
    link.click()
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setHasError(false)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const containerStyles = isFullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    background: 'hsl(var(--background))',
    display: 'flex',
    flexDirection: 'column'
  } : {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }

  const iframeStyles = {
    width: '100%',
    height: isFullscreen ? 'calc(100vh - 60px)' : '400px',
    border: 'none',
    borderRadius: isFullscreen ? '0' : '4px',
    background: 'transparent',
    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
    transformOrigin: 'center center',
    transition: 'transform 0.2s ease'
  }

  return (
    <div className="card" style={{ padding: isFullscreen ? '0' : '1rem', ...containerStyles }}>
      {/* Header with controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: isFullscreen ? '0' : '0.5rem',
        padding: isFullscreen ? '0.75rem 1rem' : '0',
        borderBottom: isFullscreen ? '1px solid hsl(var(--border))' : 'none',
        background: isFullscreen ? 'hsl(var(--card))' : 'transparent',
        flexShrink: 0
      }}>
        <h4 style={{
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: isFullscreen ? '1.1rem' : '1rem'
        }}>
          <Eye size={16} /> {title}
          {isLoading && <Loader2 size={14} className="animate-spin" />}
        </h4>

        {/* Control buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Zoom level indicator */}
          <span style={{
            fontSize: '0.85rem',
            color: 'hsl(var(--muted-foreground))',
            minWidth: '45px',
            textAlign: 'center'
          }}>
            {zoomLevel}%
          </span>

          {/* Control buttons */}
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
            className="btn-icon"
            title="Zoom Out"
            style={{
              padding: '0.4rem',
              background: 'hsl(var(--secondary))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '4px',
              cursor: zoomLevel <= 50 ? 'not-allowed' : 'pointer',
              opacity: zoomLevel <= 50 ? 0.5 : 1
            }}
          >
            <ZoomOut size={14} />
          </button>

          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 200}
            className="btn-icon"
            title="Zoom In"
            style={{
              padding: '0.4rem',
              background: 'hsl(var(--secondary))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '4px',
              cursor: zoomLevel >= 200 ? 'not-allowed' : 'pointer',
              opacity: zoomLevel >= 200 ? 0.5 : 1
            }}
          >
            <ZoomIn size={14} />
          </button>

          <button
            onClick={handleRotate}
            className="btn-icon"
            title="Rotate 90°"
            style={{
              padding: '0.4rem',
              background: 'hsl(var(--secondary))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <RotateCw size={14} />
          </button>

          <button
            onClick={handleRefresh}
            className="btn-icon"
            title="Refresh"
            style={{
              padding: '0.4rem',
              background: 'hsl(var(--secondary))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={handleDownload}
            className="btn-icon"
            title="Download PDF"
            style={{
              padding: '0.4rem',
              background: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              border: '1px solid hsl(var(--primary))',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Download size={14} />
          </button>

          <button
            onClick={handleFullscreen}
            className="btn-icon"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            style={{
              padding: '0.4rem',
              background: 'hsl(var(--secondary))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {(isFullscreen || onClose) && (
            <button
              onClick={isFullscreen ? handleFullscreen : onClose}
              className="btn-icon"
              title="Close"
              style={{
                padding: '0.4rem',
                background: 'hsl(var(--destructive))',
                color: 'hsl(var(--destructive-foreground))',
                border: '1px solid hsl(var(--destructive))',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* PDF viewer container */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isFullscreen ? '1rem' : '0',
        background: isFullscreen ? 'hsl(var(--muted))' : 'transparent',
        position: 'relative',
        width: '100%',
        minHeight: isFullscreen ? 'calc(100vh - 60px)' : '400px'
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'hsl(var(--muted-foreground))'
          }}>
            <Loader2 size={24} className="animate-spin" />
            <span style={{ fontSize: '0.9rem' }}>Loading PDF...</span>
          </div>
        )}

        {hasError && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'hsl(var(--destructive))',
            textAlign: 'center'
          }}>
            <X size={24} />
            <span style={{ fontSize: '0.9rem' }}>Failed to load PDF</span>
            <button
              onClick={handleRefresh}
              style={{
                padding: '0.25rem 0.5rem',
                background: 'hsl(var(--secondary))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!hasError && (
          <div style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: isFullscreen ? '8px' : '4px',
            boxShadow: isFullscreen ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            background: 'white'
          }}>
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              style={iframeStyles}
              title="PDF Preview"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              loading="lazy"
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .btn-icon {
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-icon:active:not(:disabled) {
          transform: translateY(0);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        iframe {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }

        @media (max-width: 768px) {
          .btn-icon {
            padding: 0.3rem !important;
          }

          .btn-icon svg {
            width: 12px !important;
            height: 12px !important;
          }
        }
      `}</style>
    </div>
  )
}