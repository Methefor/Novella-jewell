import About from '@/components/About';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import SteelCollection from '@/components/SteelCollection';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <section id="home">
        <Hero />
      </section>

      <section id="collections">
        <SteelCollection />
      </section>

      <section id="featured">
        <FeaturedProducts />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="newsletter">
        <Newsletter />
      </section>

      <Footer />
    </>
  );
}
