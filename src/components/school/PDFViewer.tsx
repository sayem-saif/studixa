import { useState } from "react";
import { X, Download, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

const PDFViewer = ({ pdfUrl, title, onClose }: PDFViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);

  // Use Google Drive viewer for NCERT PDFs as they work better with it
  const isNcertPdf = pdfUrl.includes('ncert.nic.in');
  const viewerUrl = useGoogleViewer || isNcertPdf
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
    : pdfUrl;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50 bg-background" : "relative"
      }`}
    >
      <Card className={`flex flex-col ${isFullscreen ? "h-screen rounded-none" : "h-[80vh]"}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h3 className="font-semibold text-lg truncate flex-1">{title}</h3>
          <div className="flex items-center gap-2 ml-4">
            {!isNcertPdf && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-2" />
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-muted/30">
          <iframe
            src={viewerUrl}
            className="w-full h-full border-0"
            style={
              useGoogleViewer || isNcertPdf
                ? { width: '100%', height: '100%' }
                : {
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top left",
                    width: `${10000 / zoom}%`,
                    height: `${10000 / zoom}%`,
                  }
            }
            title={title}
            allow="fullscreen"
          />
        </div>

        {/* Footer Info */}
        <div className="p-2 border-t bg-card text-center text-xs text-muted-foreground">
          {isNcertPdf ? (
            <>NCERT PDFs are displayed using Google Docs Viewer for better compatibility</>
          ) : (
            <>Use browser's built-in PDF controls for additional features</>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PDFViewer;
