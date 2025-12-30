import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { trips } from '@/data/trips';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, Star, Users, Check, X, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const typeLabels: Record<string, string> = {
  historical: 'تاريخية',
  beach: 'شاطئية',
  desert: 'صحراوية',
  cultural: 'ثقافية',
  adventure: 'مغامرات',
};

const TripDetailsPage = () => {
  const { id } = useParams();
  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">الرحلة غير موجودة</h1>
          <Button asChild>
            <Link to="/trips">العودة للرحلات</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-4">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <Link to="/trips" className="hover:text-foreground transition-colors">الرحلات</Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="text-foreground font-medium">{trip.title}</span>
          </nav>
        </div>
      </div>

      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="md:col-span-2">
                  <img
                    src={trip.images[0]}
                    alt={trip.title}
                    className="w-full h-64 md:h-96 object-cover rounded-2xl"
                  />
                </div>
                {trip.images.slice(1, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${trip.title} ${i + 2}`}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                ))}
              </motion.div>

              {/* Title & Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-accent text-accent-foreground">
                    {typeLabels[trip.type]}
                  </Badge>
                  {trip.originalPrice && (
                    <Badge variant="destructive">
                      خصم {Math.round((1 - trip.price / trip.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {trip.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span>{trip.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-5 h-5" />
                    <span>{trip.duration} {trip.duration === 1 ? 'يوم' : 'أيام'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span>{trip.rating} ({trip.reviewsCount} تقييم)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-5 h-5" />
                    <span>{trip.availableSeats} مقعد متاح</span>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">عن الرحلة</h2>
                <p className="text-muted-foreground leading-relaxed">{trip.description}</p>
              </motion.div>

              {/* Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">أبرز المعالم</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {trip.highlights.map((highlight, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-secondary rounded-xl"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Tabs defaultValue="itinerary" className="w-full">
                  <TabsList className="w-full justify-start bg-secondary p-1 rounded-xl">
                    <TabsTrigger value="itinerary" className="rounded-lg">برنامج الرحلة</TabsTrigger>
                    <TabsTrigger value="includes" className="rounded-lg">يشمل</TabsTrigger>
                    <TabsTrigger value="excludes" className="rounded-lg">لا يشمل</TabsTrigger>
                  </TabsList>

                  <TabsContent value="itinerary" className="mt-6">
                    <div className="space-y-4">
                      {trip.itinerary.map((day) => (
                        <Card key={day.day} className="border-0 shadow-soft">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground mb-1">
                                  اليوم {day.day}: {day.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">{day.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="includes" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {trip.includes.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-xl">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="excludes" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {trip.excludes.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-xl">
                          <X className="w-5 h-5 text-red-600" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24"
              >
                <Card className="border-0 shadow-large">
                  <CardContent className="p-6">
                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-primary">
                          {trip.price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">جنيه / للفرد</span>
                      </div>
                      {trip.originalPrice && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground line-through">
                            {trip.originalPrice.toLocaleString()} جنيه
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            وفر {(trip.originalPrice - trip.price).toLocaleString()} جنيه
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Quick Info */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">المدة</span>
                        <span className="font-medium text-foreground">
                          {trip.duration} {trip.duration === 1 ? 'يوم' : 'أيام'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">المقاعد المتاحة</span>
                        <span className="font-medium text-foreground">{trip.availableSeats}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">التقييم</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-medium text-foreground">{trip.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button asChild size="lg" className="w-full shadow-gold">
                      <Link to={`/booking/${trip.id}`}>احجز الآن</Link>
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      الحجز آمن ومضمون 100%
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TripDetailsPage;
