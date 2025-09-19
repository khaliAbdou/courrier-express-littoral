
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, User } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { saveGenericData, getGenericData } from '@/utils/dataHelpers';

interface Comment {
  id: string;
  mailId: string;
  author: string;
  content: string;
  createdAt: Date;
  type: 'comment' | 'annotation';
}

interface MailCommentsProps {
  mailId: string;
  mailType: 'incoming' | 'outgoing';
}

const MailComments: React.FC<MailCommentsProps> = ({ mailId, mailType }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadComments();
  }, [mailId]);

  const loadComments = async () => {
    const key = `mail_comments_${mailId}`;
    const savedComments = getGenericData<Comment[]>(key);
    if (savedComments) {
      const parsed = savedComments.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt)
      }));
      setComments(parsed);
    }
  };

  const saveComment = async () => {
    if (!newComment.trim()) {
      toast.error('Veuillez saisir un commentaire');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      mailId,
      author: 'Utilisateur', // À remplacer par le système d'authentification
      content: newComment.trim(),
      createdAt: new Date(),
      type: 'comment'
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);

    const key = `mail_comments_${mailId}`;
    await saveGenericData(key, updatedComments);

    setNewComment('');
    setIsAdding(false);
    toast.success('Commentaire ajouté avec succès');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageSquare className="h-4 w-4" />
          Commentaires ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded border">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-sm">{comment.author}</span>
              <Badge variant="outline" className="text-xs">
                {format(comment.createdAt, 'dd/MM/yyyy HH:mm')}
              </Badge>
            </div>
            <p className="text-sm text-gray-700">{comment.content}</p>
          </div>
        ))}

        {isAdding ? (
          <div className="space-y-3 p-3 bg-blue-50 rounded border">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajoutez votre commentaire..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveComment}>
                Enregistrer
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewComment('');
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un commentaire
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MailComments;
