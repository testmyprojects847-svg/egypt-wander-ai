import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    id: '1',
    question: 'What is the best time to visit Egypt?',
    answer: 'The best time to visit Egypt is from October to April when temperatures are cooler and more comfortable for sightseeing. Peak tourist season is December through February.',
  },
  {
    id: '2',
    question: 'Do I need a visa to visit Egypt?',
    answer: 'Most nationalities require a visa to enter Egypt. Many countries are eligible for visa on arrival or e-visa. We recommend checking with your local Egyptian embassy for specific requirements.',
  },
  {
    id: '3',
    question: 'What should I wear during my tour?',
    answer: 'We recommend comfortable, modest clothing. Light, breathable fabrics are ideal. For temple visits, shoulders and knees should be covered. Comfortable walking shoes are essential.',
  },
  {
    id: '4',
    question: 'Are your tours suitable for all ages?',
    answer: 'Yes, our tours cater to all age groups. We offer customized itineraries for families with children, seniors, and those with specific mobility needs. Please inform us in advance of any special requirements.',
  },
  {
    id: '5',
    question: 'What is included in the tour price?',
    answer: 'Our tour packages typically include accommodation, transportation, entrance fees to monuments, professional guides, and meals as specified. Detailed inclusions are listed on each tour page.',
  },
  {
    id: '6',
    question: 'How can I book a tour?',
    answer: 'You can book directly through our website by selecting your desired tour and filling out the booking form. Our team will confirm your reservation within 24 hours.',
  },
];

export function FAQSection() {
  return (
    <section className="bg-black py-16 md:py-24 px-6 md:px-16">
      {/* Top separator */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-primary text-2xl md:text-3xl tracking-[0.15em] uppercase mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-primary/60 text-sm tracking-wide">
            Everything you need to know about your Egyptian adventure
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-primary/30 bg-black rounded-lg px-6 data-[state=open]:border-primary/60 transition-colors"
              >
                <AccordionTrigger className="text-primary font-playfair text-left tracking-wide hover:text-primary/80 hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-primary/70 pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>

      {/* Bottom separator */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>
    </section>
  );
}
