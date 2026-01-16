import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tourist, TouristFormData } from "@/hooks/useTourists";
import { User, Mail, Phone, Globe, Languages, MapPin, Heart, FileText } from "lucide-react";

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(5, "Phone must be at least 5 characters").max(20),
  nationality: z.string().min(2, "Nationality is required").max(100),
  preferred_language: z.string().optional(),
  country_of_residence: z.string().optional(),
  preferred_city: z.string().optional(),
  travel_interests: z.string().optional(),
  special_requests: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TouristFormProps {
  tourist?: Tourist;
  onSubmit: (data: TouristFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const LANGUAGES = ["English", "Arabic", "German", "French", "Spanish", "Italian", "Russian", "Chinese"];
const CITIES = ["Cairo", "Luxor", "Aswan", "Hurghada", "Sharm El Sheikh", "Alexandria", "Dahab", "Marsa Alam"];
const INTERESTS = ["Historical Sites", "Desert Safari", "Snorkeling", "Diving", "Beach", "Nile Cruise", "Shopping", "Food Tours"];

export const TouristForm = ({ tourist, onSubmit, onCancel, isSubmitting }: TouristFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: tourist?.full_name || "",
      email: tourist?.email || "",
      phone: tourist?.phone || "",
      nationality: tourist?.nationality || "",
      preferred_language: tourist?.preferred_language || "",
      country_of_residence: tourist?.country_of_residence || "",
      preferred_city: tourist?.preferred_city || "",
      travel_interests: tourist?.travel_interests?.join(", ") || "",
      special_requests: tourist?.special_requests || "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const interestsArray = values.travel_interests
      ? values.travel_interests.split(",").map((i) => i.trim()).filter(Boolean)
      : [];

    await onSubmit({
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      nationality: values.nationality,
      preferred_language: values.preferred_language || undefined,
      country_of_residence: values.country_of_residence || undefined,
      preferred_city: values.preferred_city || undefined,
      travel_interests: interestsArray,
      special_requests: values.special_requests || undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2 font-playfair">
            <User className="h-5 w-5" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary/80">Full Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter full name" 
                      {...field} 
                      className="bg-primary/5 border-primary/20 text-primary placeholder:text-primary/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-primary/80">
                    <Mail className="h-4 w-4" /> Email *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="email@example.com" 
                      {...field} 
                      className="bg-primary/5 border-primary/20 text-primary placeholder:text-primary/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-primary/80">
                    <Phone className="h-4 w-4" /> Phone *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+20 123 456 7890" 
                      {...field} 
                      className="bg-primary/5 border-primary/20 text-primary placeholder:text-primary/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-primary/80">
                    <Globe className="h-4 w-4" /> Nationality *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., German, British" 
                      {...field} 
                      className="bg-primary/5 border-primary/20 text-primary placeholder:text-primary/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2 font-playfair">
            <Heart className="h-5 w-5" />
            Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="preferred_language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-primary/80">
                    <Languages className="h-4 w-4" /> Preferred Language
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-primary/5 border-primary/20 text-primary">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-primary/20">
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang} className="text-primary">
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country_of_residence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary/80">Country of Residence</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Germany, UK" 
                      {...field} 
                      className="bg-primary/5 border-primary/20 text-primary placeholder:text-primary/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-primary/80">
                    <MapPin className="h-4 w-4" /> Preferred City
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-primary/5 border-primary/20 text-primary">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-primary/20">
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city} className="text-primary">
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Interests & Requests */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2 font-playfair">
            <FileText className="h-5 w-5" />
            Additional Details
          </h3>

          <FormField
            control={form.control}
            name="travel_interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary/80">Travel Interests (comma separated)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Snorkeling, Desert Safari, Historical Sites" 
                    {...field} 
                    className="bg-primary/5 border-primary/20 text-primary placeholder:text-primary/40"
                  />
                </FormControl>
                <p className="text-xs text-primary/50 mt-1">
                  Suggestions: {INTERESTS.join(", ")}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="special_requests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary/80">Special Requests</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., Vegetarian meals, Wheelchair accessibility" 
                    rows={3}
                    {...field} 
                    className="bg-primary/5 border-primary/20 text-primary placeholder:text-primary/40"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-primary/20">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-primary text-black hover:bg-primary/90"
          >
            {isSubmitting ? "Saving..." : tourist ? "Update Tourist" : "Register Tourist"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
