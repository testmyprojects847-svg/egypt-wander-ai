import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="min-h-[60vh] flex items-center justify-center py-16">
        <div className="container-custom text-center">
          <div className="max-w-md mx-auto">
            <div className="text-8xl font-bold text-primary mb-4">404</div>
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">الصفحة غير موجودة</h1>
            <p className="text-muted-foreground mb-8">
              عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/"><Home className="w-5 h-5 ml-2" />العودة للرئيسية</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/trips">تصفح الرحلات</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
