import { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Image, 
  Globe, 
  Palette,
  Save,
  Eye,
  Bell,
  User,
  Moon,
  Sun,
  Upload,
  Trash2,
  GripVertical,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Hero settings
  const [heroSettings, setHeroSettings] = useState({
    leftImageUrl: '',
    rightImageUrl: '',
    title: 'Curated Experiences',
    subtitle: 'Discover the wonders of ancient Egypt',
    backgroundColor: '#000000',
  });

  // Site settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Eternal Egypt Journeys',
    contactEmail: 'info@egypttours.com',
    contactPhone: '+20 123 456 789',
    footerText: '© 2024 Eternal Egypt Journeys. All rights reserved.',
  });

  // Destinations for "Explore Modern Egypt"
  const [destinations, setDestinations] = useState([
    { id: '1', name: 'Cairo', description: 'Home of the Great Pyramids', imageUrl: '', visible: true },
    { id: '2', name: 'Luxor', description: 'Valley of the Kings', imageUrl: '', visible: true },
    { id: '3', name: 'Aswan', description: 'Gateway to Nubia', imageUrl: '', visible: true },
  ]);

  const handleSaveHero = () => {
    toast({ title: 'Hero settings saved!', description: 'Your changes will be visible on the homepage.' });
  };

  const handleSaveSite = () => {
    toast({ title: 'Site settings saved!', description: 'Your changes have been applied.' });
  };

  const handleAddDestination = () => {
    const newId = Date.now().toString();
    setDestinations([...destinations, { id: newId, name: '', description: '', imageUrl: '', visible: true }]);
  };

  const handleRemoveDestination = (id: string) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const handleUpdateDestination = (id: string, field: string, value: any) => {
    setDestinations(destinations.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Settings</h1>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/" target="_blank">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View Site
                </Button>
              </Link>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="hero" className="space-y-6">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="hero" className="gap-2">
                <Image className="w-4 h-4" />
                Hero Section
              </TabsTrigger>
              <TabsTrigger value="destinations" className="gap-2">
                <Globe className="w-4 h-4" />
                Destinations
              </TabsTrigger>
              <TabsTrigger value="general" className="gap-2">
                <Palette className="w-4 h-4" />
                General
              </TabsTrigger>
            </TabsList>

            {/* Hero Section Tab */}
            <TabsContent value="hero">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section Settings</CardTitle>
                  <CardDescription>Customize the pharaoh images and text in the hero section</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>Left Pharaoh Image URL</Label>
                      <Input
                        placeholder="https://example.com/pharaoh-left.png"
                        value={heroSettings.leftImageUrl}
                        onChange={(e) => setHeroSettings({ ...heroSettings, leftImageUrl: e.target.value })}
                        className="bg-secondary/50"
                      />
                      <p className="text-xs text-muted-foreground">Recommended: Golden Tutankhamun mask</p>
                    </div>
                    <div className="space-y-4">
                      <Label>Right Pharaoh Image URL</Label>
                      <Input
                        placeholder="https://example.com/pharaoh-right.png"
                        value={heroSettings.rightImageUrl}
                        onChange={(e) => setHeroSettings({ ...heroSettings, rightImageUrl: e.target.value })}
                        className="bg-secondary/50"
                      />
                      <p className="text-xs text-muted-foreground">Recommended: Blue Nefertiti statue</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Hero Title</Label>
                    <Input
                      value={heroSettings.title}
                      onChange={(e) => setHeroSettings({ ...heroSettings, title: e.target.value })}
                      className="bg-secondary/50"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Hero Subtitle</Label>
                    <Textarea
                      value={heroSettings.subtitle}
                      onChange={(e) => setHeroSettings({ ...heroSettings, subtitle: e.target.value })}
                      className="bg-secondary/50"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Background Color</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="color"
                        value={heroSettings.backgroundColor}
                        onChange={(e) => setHeroSettings({ ...heroSettings, backgroundColor: e.target.value })}
                        className="w-20 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={heroSettings.backgroundColor}
                        onChange={(e) => setHeroSettings({ ...heroSettings, backgroundColor: e.target.value })}
                        className="bg-secondary/50 flex-1"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveHero} className="btn-gold gap-2">
                    <Save className="w-4 h-4" />
                    Save Hero Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Destinations Tab */}
            <TabsContent value="destinations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Explore Modern Egypt</CardTitle>
                    <CardDescription>Manage destination cards shown to users</CardDescription>
                  </div>
                  <Button onClick={handleAddDestination} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Destination
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {destinations.map((dest, index) => (
                    <div key={dest.id} className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg border border-border/50">
                      <button className="mt-2 cursor-grab">
                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={dest.name}
                            onChange={(e) => handleUpdateDestination(dest.id, 'name', e.target.value)}
                            placeholder="City name"
                            className="bg-secondary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={dest.description}
                            onChange={(e) => handleUpdateDestination(dest.id, 'description', e.target.value)}
                            placeholder="Short description"
                            className="bg-secondary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            value={dest.imageUrl}
                            onChange={(e) => handleUpdateDestination(dest.id, 'imageUrl', e.target.value)}
                            placeholder="https://..."
                            className="bg-secondary/50"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={dest.visible}
                            onCheckedChange={(checked) => handleUpdateDestination(dest.id, 'visible', checked)}
                          />
                          <span className="text-sm text-muted-foreground">Visible</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveDestination(dest.id)}
                          className="p-2 hover:bg-destructive/20 rounded-lg text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <Button onClick={() => toast({ title: 'Destinations saved!' })} className="btn-gold gap-2">
                    <Save className="w-4 h-4" />
                    Save Destinations
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* General Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Site Settings</CardTitle>
                  <CardDescription>Configure general site information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>Site Name</Label>
                      <Input
                        value={siteSettings.siteName}
                        onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Contact Email</Label>
                      <Input
                        type="email"
                        value={siteSettings.contactEmail}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Contact Phone</Label>
                      <Input
                        value={siteSettings.contactPhone}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Footer Text</Label>
                      <Input
                        value={siteSettings.footerText}
                        onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })}
                        className="bg-secondary/50"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveSite} className="btn-gold gap-2">
                    <Save className="w-4 h-4" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}