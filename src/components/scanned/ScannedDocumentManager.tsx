import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileImage, 
  FileText, 
  Trash2, 
  Eye,
  Download,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import FormSection from '@/components/forms/FormSection';

interface ScannedDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  size: number;
  uploadDate: Date;
  description?: string;
  tags: string[];
  file: File;
}

const ScannedDocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<ScannedDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

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
        tags: [],
        file: file
      };

      setDocuments(prev => [...prev, newDocument]);
      toast.success(`Document ajouté: ${file.name}`);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast.success('Document supprimé');
  };

  const handleAddDescription = (documentId: string, description: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, description }
          : doc
      )
    );
  };

  const handleAddTag = (documentId: string, tag: string) => {
    if (!tag.trim()) return;
    
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, tags: [...doc.tags, tag.trim()] }
          : doc
      )
    );
  };

  const handleRemoveTag = (documentId: string, tagToRemove: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, tags: doc.tags.filter(tag => tag !== tagToRemove) }
          : doc
      )
    );
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => doc.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = [...new Set(documents.flatMap(doc => doc.tags))];

  return (
    <div className="space-y-6">
      <FormSection
        title="Ajouter des Documents Scannés"
        icon={<Upload className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">
              Sélectionner des fichiers (PDF ou Images)
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
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choisir des fichiers
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Formats acceptés: PDF, JPG, PNG, GIF. Taille maximum: 20MB par fichier.
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Recherche et Filtres"
        icon={<Search className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              type="text"
              placeholder="Rechercher par nom ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {allTags.length > 0 && (
            <div>
              <Label>Filtrer par tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </FormSection>

      <FormSection
        title={`Documents Scannés (${filteredDocuments.length})`}
        icon={<FileImage className="h-5 w-5" />}
      >
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {documents.length === 0 
              ? "Aucun document scanné. Commencez par ajouter des fichiers."
              : "Aucun document ne correspond aux critères de recherche."
            }
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {document.type === 'pdf' ? (
                        <FileText className="h-8 w-8 text-red-500" />
                      ) : (
                        <FileImage className="h-8 w-8 text-blue-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-medium">{document.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(document.size)} • 
                          Ajouté le {document.uploadDate.toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Ajouter une description..."
                          value={document.description || ''}
                          onChange={(e) => handleAddDescription(document.id, e.target.value)}
                          className="min-h-[60px]"
                        />
                        
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Ajouter un tag..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                handleAddTag(document.id, target.value);
                                target.value = '';
                              }
                            }}
                            className="flex-1"
                          />
                        </div>
                        
                        {document.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {document.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => handleRemoveTag(document.id, tag)}
                              >
                                {tag} ×
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDocument(document)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadDocument(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDocument(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </FormSection>
    </div>
  );
};

export default ScannedDocumentManager;