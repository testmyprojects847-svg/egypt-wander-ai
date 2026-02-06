import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Code, Database, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = 'https://zghhlpojdzwmujwxtkpv.supabase.co/functions/v1/api';

interface Endpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  example: string;
}

const tables = ['tourists', 'tours', 'complaints', 'bookings', 'reviews'] as const;

function getExampleBody(table: string): object {
  switch (table) {
    case 'tourists':
      return {
        full_name: 'Ahmed Mohamed',
        email: 'ahmed@example.com',
        phone: '+201234567890',
        nationality: 'Egyptian',
        tour_name: 'Pyramids Tour',
        number_of_people: 2,
        total_price: 150,
        booking_date: '2025-03-15',
      };
    case 'tours':
      return {
        name: 'Luxor Day Trip',
        description: 'Full day tour to Luxor temples',
        city: 'Luxor',
        duration: '12 hours',
        price: 120,
        price_egp: 6000,
        price_usd: 120,
        discount_percentage: 10,
        availability: true,
      };
    case 'complaints':
      return {
        name: 'Customer Name',
        email: 'customer@example.com',
        phone: '+201234567890',
        message: 'Complaint details here',
      };
    case 'bookings':
      return {
        email: 'guest@example.com',
        phone: '+201234567890',
        tour_name: 'Pyramids Tour',
        status: 'pending',
      };
    case 'reviews':
      return {
        customer_name: 'John Doe',
        email: 'john@example.com',
        rating: 5,
        comment: 'Amazing experience!',
        country_code: 'US',
      };
    default:
      return {};
  }
}

function getPostExample(table: string): string {
  const body = JSON.stringify(getExampleBody(table), null, 2);
  return `curl -X POST "${BASE_URL}/${table}" \\
  -H "Content-Type: application/json" \\
  -d '${body}'`;
}

function getPatchExample(table: string): string {
  let updateBody = {};
  switch (table) {
    case 'tourists':
      updateBody = { total_bookings: 5, last_booking_date: '2025-02-06' };
      break;
    case 'tours':
      updateBody = { price: 100, availability: false };
      break;
    case 'complaints':
      updateBody = { status: 'resolved', solution_message: 'Issue fixed' };
      break;
    case 'bookings':
      updateBody = { status: 'confirmed' };
      break;
    case 'reviews':
      updateBody = { verified: true };
      break;
  }
  return `curl -X PATCH "${BASE_URL}/${table}/YOUR_ID_HERE" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(updateBody, null, 2)}'`;
}

const getEndpoints = (table: string): Endpoint[] => [
  {
    method: 'GET',
    path: `/${table}`,
    description: `Get all ${table}`,
    example: `curl -X GET "${BASE_URL}/${table}" \\
  -H "Content-Type: application/json"`,
  },
  {
    method: 'GET',
    path: `/${table}/{id}`,
    description: `Get single ${table.slice(0, -1)} by ID`,
    example: `curl -X GET "${BASE_URL}/${table}/YOUR_ID_HERE" \\
  -H "Content-Type: application/json"`,
  },
  {
    method: 'POST',
    path: `/${table}`,
    description: `Create new ${table.slice(0, -1)}`,
    example: getPostExample(table),
  },
  {
    method: 'PATCH',
    path: `/${table}/{id}`,
    description: `Update ${table.slice(0, -1)}`,
    example: getPatchExample(table),
  },
  {
    method: 'DELETE',
    path: `/${table}/{id}`,
    description: `Delete ${table.slice(0, -1)}`,
    example: `curl -X DELETE "${BASE_URL}/${table}/YOUR_ID_HERE" \\
  -H "Content-Type: application/json"`,
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-green-500/20 text-green-400 border-green-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PATCH: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function ApiPanel() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState<string>('tourists');

  const copyToClipboard = async (text: string, index: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-primary/30 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Code className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary font-playfair">REST API Documentation</h2>
          <p className="text-primary/60 text-sm">All endpoints ready for n8n integration</p>
        </div>
      </div>

      {/* Base URL */}
      <div className="bg-black/50 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-primary/60 text-xs uppercase tracking-wide">Base URL</span>
            <p className="text-primary font-mono text-sm mt-1">{BASE_URL}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(BASE_URL, 'base')}
            className="border-primary/30 text-primary hover:bg-primary hover:text-black"
          >
            {copiedIndex === 'base' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Table Tabs */}
      <Tabs value={activeTable} onValueChange={setActiveTable} className="w-full">
        <TabsList className="w-full bg-black/50 border border-primary/20 p-1 mb-4 grid grid-cols-5 gap-1">
          {tables.map((table) => (
            <TabsTrigger
              key={table}
              value={table}
              className="text-xs capitalize data-[state=active]:bg-primary data-[state=active]:text-black text-primary/70"
            >
              <Database className="w-3 h-3 mr-1" />
              {table}
            </TabsTrigger>
          ))}
        </TabsList>

        {tables.map((table) => (
          <TabsContent key={table} value={table} className="mt-0">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {getEndpoints(table).map((endpoint, idx) => {
                  const key = `${table}-${endpoint.method}-${idx}`;
                  return (
                    <div
                      key={key}
                      className="bg-black/30 border border-primary/20 rounded-lg overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
                        <div className="flex items-center gap-3">
                          <Badge className={`${methodColors[endpoint.method]} text-xs font-bold px-2`}>
                            {endpoint.method}
                          </Badge>
                          <span className="text-primary font-mono text-sm">{endpoint.path}</span>
                        </div>
                        <span className="text-primary/50 text-xs">{endpoint.description}</span>
                      </div>

                      {/* Code Block */}
                      <div className="relative">
                        <pre className="bg-[#0d0d0d] p-4 text-xs text-primary/80 font-mono overflow-x-auto">
                          <code>{endpoint.example}</code>
                        </pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(endpoint.example, key)}
                          className="absolute top-2 right-2 text-primary/60 hover:text-primary hover:bg-primary/10"
                        >
                          {copiedIndex === key ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {/* Query Parameters */}
                <div className="bg-black/30 border border-primary/20 rounded-lg p-4">
                  <h4 className="text-primary font-semibold text-sm mb-3 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Optional Query Parameters (GET)
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-black/50 p-2 rounded">
                      <code className="text-primary">?limit=10</code>
                      <p className="text-primary/50 mt-1">Limit results</p>
                    </div>
                    <div className="bg-black/50 p-2 rounded">
                      <code className="text-primary">?order_by=created_at</code>
                      <p className="text-primary/50 mt-1">Sort by field</p>
                    </div>
                    <div className="bg-black/50 p-2 rounded">
                      <code className="text-primary">?order_dir=asc</code>
                      <p className="text-primary/50 mt-1">Sort direction</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      {/* Webhook Endpoints */}
      <div className="mt-6 pt-6 border-t border-primary/20">
        <h3 className="text-primary font-semibold text-sm mb-4">Webhook Endpoints</h3>
        <div className="space-y-3">
          <div className="bg-black/30 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">POST</Badge>
              <span className="text-primary/60 text-xs">Contact Form Webhook</span>
            </div>
            <code className="text-primary text-xs font-mono block mb-2">
              https://n8n.algaml.com/webhook/a1219875-8532-4d89-891c-929b93e8d79a
            </code>
            <pre className="bg-[#0d0d0d] p-2 rounded text-[10px] text-primary/70 overflow-x-auto">
{`{
  "name": "Customer Name",
  "email": "email@example.com",
  "phone": "+201234567890",
  "message": "Message content"
}`}
            </pre>
          </div>

          <div className="bg-black/30 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">POST</Badge>
              <span className="text-primary/60 text-xs">Solution Response Webhook</span>
            </div>
            <code className="text-primary text-xs font-mono block mb-2">
              https://n8n.algaml.com/webhook/1fcbb0c9-f789-4612-8bc7-f5548ff7921a
            </code>
            <pre className="bg-[#0d0d0d] p-2 rounded text-[10px] text-primary/70 overflow-x-auto">
{`{
  "name": "Customer Name",
  "email": "email@example.com",
  "phone": "+201234567890",
  "solution_message": "Solution details"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
