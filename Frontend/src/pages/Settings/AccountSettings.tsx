import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { keys } from '../../types/keys';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import Loading from '@/components/Common/Loading';
import { useAuth } from '@/hooks/Supabase/useAuth';

export default function AccountSettings() {
  const { t } = useTranslation();

  const { 
    user, 
    loading, 
    error, 
    updateProfile, 
    deleteAccount, 
    signOut 
  } = useAuth();
  
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    await updateProfile({
      fullName,
      email
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm === t(keys.deleteAccountConfirmText)) {
      await deleteAccount();
    }
  };

  return (
    loading ? <Loading isLoading={loading} /> :
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t(keys.accountSettings)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback>
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="avatar">{t(keys.profilePicture)}</Label>
                <Input 
                  id="avatar"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">{t(keys.fullName)}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t(keys.email)}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? t(keys.updating) : t(keys.updateProfile)}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">{t(keys.dangerZone)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              onClick={signOut}
              disabled={loading}
            >
              {t(keys.signOut)}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deleteConfirm">
                {t(keys.deleteAccountWarning)}
              </Label>
              <Input
                id="deleteConfirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={t(keys.deleteAccountPlaceholder)}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                {t(keys.deleteAccountHint)}
              </p>
            </div>

            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== t(keys.deleteAccountConfirmText) || loading}
            >
              {isDeleting ? t(keys.deleting) : t(keys.deleteAccount)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
