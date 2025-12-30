import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { FeaturedTrips } from '@/components/home/FeaturedTrips';
import { Features } from '@/components/home/Features';
import { Testimonials } from '@/components/home/Testimonials';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <FeaturedTrips />
      <Testimonials />
    </Layout>
  );
};

export default Index;
