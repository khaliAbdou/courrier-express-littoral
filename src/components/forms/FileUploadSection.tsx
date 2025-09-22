import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Upload, 
  FileImage, 
  FileText, 
  Trash2, 
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { ScannedDocument } from '@/types/mail';

interface FileUploadSectionProps {
  documents: ScannedDocument[];
  onDocumentsChange: (documents: ScannedDocument[]) => void;
  disabled?: boolean;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  documents,
  onDocumentsChange,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: ScannedDocument[] = [];

    Array.from(files).forEach((file) => {
      // Vérifier le type de fichier
      const isValidType = file.type === 'application/pdf' || 
                         file.type.startsWith('image/');
      
      if (!isValidType) {
        toast.error(`Format non supporté: ${file.name}. Seuls PDF et images sont acceptés.`);
        return;
      }

      // Vérifier la taille (max 20MB)
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (file.size > maxSize) {
        toast.error(`Fichier trop volumineux: ${file.name}. Taille maximum: 20MB`);
        return;
      }

      const newDocument: ScannedDocument = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type === 'application/pdf' ? 'pdf' : 'image',
        size: file.size,
        uploadDate: new Date(),
        file: file
      };

      newDocuments.push(newDocument);
      toast.success(`Document ajouté: ${file.name}`);
    });

    onDocumentsChange([...documents, ...newDocuments]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    onDocumentsChange(updatedDocuments);
    toast.success('Document supprimé');
  };

  const handleUpdateDescription = (documentId: string, description: string) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, description }
        : doc
    );
    onDocumentsChange(updatedDocuments);
  };

  const handleViewDocument = (document: ScannedDocument) => {
    const url = URL.createObjectURL(document.file);
    window.open(url, '_blank');
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload">
          Documents scannés (optionnel)
        </Label>
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            id="file-upload"
            multiple
            accept=".pdf,image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={disabled}
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            Ajouter des documents scannés
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Formats acceptés: PDF, JPG, PNG, GIF. Taille maximum: 20MB par fichier.
        </p>
      </div>

      {documents.length > 0 && (
        <div className="space-y-3">
          <Label>Documents ajoutés ({documents.length})</Label>
          {documents.map((document) => (
            <Card key={document.id} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {document.type === 'pdf' ? (
                      <FileText className="h-6 w-6 text-red-500" />
                    ) : (
                      <FileImage className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="font-medium text-sm">{document.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(document.size)}
                      </p>
                    </div>
                    
                    <Textarea
                      placeholder="Description du document..."
                      value={document.description || ''}
                      onChange={(e) => handleUpdateDescription(document.id, e.target.value)}
                      className="min-h-[50px] text-sm"
                      disabled={disabled}
                    />
                  </div>
                </div>
                
                <div className="flex gap-1 ml-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDocument(document)}
                    disabled={disabled}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadDocument(document)}
                    disabled={disabled}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteDocument(document.id)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;