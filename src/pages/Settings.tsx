import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, User, Shield, HardDrive } from 'lucide-react';
import AppConfiguration from '@/components/config/AppConfiguration';
import LicenseManagerComponent from '@/components/license/LicenseManager';
import FileSystemManager from '@/components/storage/FileSystemManager';
import SystemDiagnostic from '@/components/diagnostic/SystemDiagnostic';

const Settings: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Paramètres</h1>
        </div>
        <p className="text-muted-foreground">
          Configurez votre application selon vos préférences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="license" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Licence
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Stockage
          </TabsTrigger>
          <TabsTrigger value="diagnostic" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Diagnostic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Configuration Générale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AppConfiguration />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="license" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gestion des Licences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LicenseManagerComponent />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Configuration du Stockage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileSystemManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Diagnostic Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SystemDiagnostic />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;