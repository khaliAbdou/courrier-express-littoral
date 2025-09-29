import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileImage, 
  FileText, 
  Eye,
  Download,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { ScannedDocument } from '@/types/mail';

interface ScannedDocumentViewerProps {
  documents: ScannedDocument[];
  className?: string;
}

const ScannedDocumentViewer: React.FC<ScannedDocumentViewerProps> = ({
  documents,
  className = ""
}) => {
  const [selectedDocument, setSelectedDocument] = useState<ScannedDocument | null>(null);
  const [zoom, setZoom] = useState(100);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleViewDocument = (document: ScannedDocument) => {
    setSelectedDocument(document);
    setZoom(100);
  };

  const handleDownloadDocument = (document: ScannedDocument) => {
    const url = URL.createObjectURL(document.file);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = document.name;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">Documents scannés</h4>
          <Badge variant="secondary" className="text-xs">
            {documents.length}
          </Badge>
        </div>
        
        <div className="grid gap-2">
          {documents.map((document) => (
            <Card key={document.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {document.type === 'pdf' ? (
                      <FileText className="h-5 w-5 text-red-500" />
                    ) : (
                      <FileImage className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm truncate">{document.name}</h5>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(document.size)}</span>
                      {document.description && (
                        <>
                          <span>•</span>
                          <span className="truncate">{document.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDocument(document)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          <span>{document.name}</span>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={handleZoomOut}>
                              <ZoomOut className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-normal">{zoom}%</span>
                            <Button size="sm" variant="outline" onClick={handleZoomIn}>
                              <ZoomIn className="h-3 w-3" />
                            </Button>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="overflow-auto max-h-[70vh]">
                        {document.type === 'pdf' ? (
                          <iframe
                            src={URL.createObjectURL(document.file)}
                            className="w-full h-[70vh] border rounded"
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                          />
                        ) : (
                          <div className="flex justify-center">
                            <img
                              src={URL.createObjectURL(document.file)}
                              alt={document.name}
                              className="max-w-full h-auto border rounded"
                              style={{ transform: `scale(${zoom / 100})` }}
                            />
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadDocument(document)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ScannedDocumentViewer;