import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ExternalLink, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiPanelProps {
  baseUrl: string;
  availableCount: number;
}

export function ApiPanel({ baseUrl, availableCount }: ApiPanelProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const apiEndpoint = `${baseUrl}/api/ai/tours`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleResponse = {
    success: true,
    count: availableCount,
    tours: [
      {
        name: "Pyramids of Giza Tour",
        description: "Explore the ancient wonders...",
        city: "Giza",
        price: 1200,
        currency: "EGP",
        duration: "6 hours",
        image_url: "https://..."
      }
    ]
  };

  return (
    <Card className="border-0 shadow-medium bg-gradient-to-br from-accent/5 to-accent/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="w-5 h-5 text-accent" />
            Public AI API
          </CardTitle>
          <Badge variant="secondary" className="bg-success/10 text-success">
            {availableCount} tours live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Endpoint */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Base Endpoint</p>
          <div className="flex items-center gap-2 bg-card p-3 rounded-lg border border-border">
            <code className="flex-1 text-sm text-accent font-mono truncate">
              GET {apiEndpoint}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(apiEndpoint)}
              className="shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Query Params */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Query Parameters</p>
          <div className="bg-card p-3 rounded-lg border border-border space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <code className="text-accent font-mono">city</code>
              <span className="text-muted-foreground">- Filter by city name</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-accent font-mono">max_price</code>
              <span className="text-muted-foreground">- Maximum price in EGP</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-accent font-mono">duration</code>
              <span className="text-muted-foreground">- Filter by duration</span>
            </div>
          </div>
        </div>

        {/* Example */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Example Request</p>
          <div className="bg-foreground text-background p-3 rounded-lg text-sm font-mono overflow-x-auto">
            GET {apiEndpoint}?city=Aswan&max_price=4000
          </div>
        </div>

        {/* Response */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Response Format</p>
          <div className="bg-foreground text-background p-3 rounded-lg text-xs font-mono overflow-x-auto">
            <pre>{JSON.stringify(sampleResponse, null, 2)}</pre>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => window.open(apiEndpoint, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            Test API in Browser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
