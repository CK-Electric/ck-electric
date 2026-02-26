import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import BlogArticle from '@/components/BlogArticle';
import CtaBox from '@/components/CtaBox';
import RelatedArticles from '@/components/RelatedArticles';
import { ArrowRightAlt } from '@mui/icons-material';

// Generate metadata for the blog article page - SSR
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '5 Signs Your Home\'s Electrical Panel Needs an Immediate Upgrade | CK Electric - Puget Sound',
    description: 'Learn the warning signs that indicate your electrical panel needs an upgrade. From frequent breaker trips to burning smells, discover when to call a professional electrician.',
    keywords: 'electrical panel upgrade, circuit breaker, electrical safety, home electrical, Puget Sound electrician',
  };
}

export default function BlogArticlePage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: '5 Signs Your Home\'s Electrical Panel Needs an Immediate Upgrade' }
  ];

  const articleContent = (
    <>
      <p className="text-display-4 font-medium italic text-neutral-950/80 mb-10 border-l-4 border-primary-500 pl-6">
        Your electrical panel is the heart of your home's power system. If it's outdated or struggling to keep up, you're not just facing inconvenience—you're facing a potential fire hazard.
      </p>
      
      <p className="text-base text-neutral-700 mb-6">
        In the Puget Sound area, many older homes still rely on electrical panels designed for a different era. Today's homes, with high-efficiency HVAC systems, electric vehicle chargers, and dozens of smart devices, demand more power than ever before. Understanding when your system is at its limit is crucial for your family's safety.
      </p>
      
      <h2 className="text-display-3 font-bold text-neutral-950 mt-12 mb-6">1. Frequent Circuit Breaker Trips</h2>
      <p className="text-base text-neutral-700 mb-6">
        If you find yourself walking to the garage or basement to flip a breaker back on every time you use the microwave and coffee maker simultaneously, your panel is trying to tell you something. Frequent tripping is a safety mechanism, but it's also a sign that your current circuits are overloaded.
      </p>
      
      <h2 className="text-display-3 font-bold text-neutral-950 mt-12 mb-6">2. Flickering or Dimming Lights</h2>
      <p className="text-base text-neutral-700 mb-6">
        Do your lights flicker when the air conditioner kicks on? This happens because your major appliances are drawing so much power that they momentarily "starve" the rest of the house. Modern panels are designed to handle these surges without affecting your lighting.
      </p>
      
      {/* Pull Quote */}
      <blockquote className="my-12 py-10 px-8 bg-primary-50 border-t-2 border-b-2 border-primary-500 text-center">
        <p className="text-display-4 font-bold text-neutral-950 mb-4 italic">
          "We prioritize quality over speed. While we offer scheduled response times, our focus is on industrial-grade precision for your home."
        </p>
        <cite className="text-xs font-bold uppercase tracking-widest text-primary-500">
          — Matt Cheshier, Co-Owner
        </cite>
      </blockquote>
      
      <h2 className="text-display-3 font-bold text-neutral-950 mt-12 mb-6">3. Burning Smells or Discoloration</h2>
      <p className="text-base text-neutral-700 mb-6">
        This is an emergency. If you notice a faint acrid smell near your electrical panel, or if you see brown/black scorch marks on breakers, power down your main switch and call a professional immediately. This indicates wires are overheating and could ignite at any moment.
      </p>
      
      <h2 className="text-display-3 font-bold text-neutral-950 mt-12 mb-6">4. You Still Have a Fuse Box</h2>
      <p className="text-base text-neutral-700 mb-6">
        Fuses aren't inherently "bad," but they are obsolete. Most insurance companies today will charge higher premiums—or deny coverage entirely—for homes with fuse boxes. They were never intended to handle the 200-amp service common in modern households.
      </p>
      
      <h2 className="text-display-3 font-bold text-neutral-950 mt-12 mb-6">5. Strange Noises (Buzzing or Cracking)</h2>
      <p className="text-base text-neutral-700 mb-6">
        Electricity should be silent. If your panel is buzzing, clicking, or making a crackling sound, it often points to a loose connection or a failing breaker that is "arcing." This creates intense heat and is a common cause of electrical fires.
      </p>
    </>
  );

  const relatedArticles = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaPFv-MSHmmobQf6nePbACO0-2mi8aZY8wuNn-v38TDSkWAiLkOq2EM2GxZXMV4tcb4OIkqtHKg_rDiIO3bdYNbwjkkBbjozXjM_nFiRXIBeeXyY9kRgwLck_imRH0QtNLJsbUrIVg13qS6yWaXyh8--Vk-X0-MEcd3cy_C2zVAQq6T5DNiZAu1XpwL8fDR_WJuEy7Yd8L79E74Jpe020-Hoc5int3vbJ1IJPv7vtTy1DixOdbeWSYcw7KjJWpGT6XZBpWpyuci2Y",
      category: "Lighting Solutions",
      readTime: "5 min read",
      title: "Smart Lighting: Beyond to Convenience",
      description: "Custom LED design, landscape lighting, and smart home lighting controls for security and ambiance.",
      link: "#"
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDA0c3daGabx-bogL9ld6mfxeFI4qWj-bJNk0Ctgj8gaJOodWSi86UYxUH7HzbUf_hnaQnz7y-QVvKXLlFwT7dVtZ4jvEpH5TEKyXwapzNNGLq7ox2zxeMmqArR-BgwEnXjWrwDh0GXcKoYxrEyZpzX6qx97ak5ZUpqGX2Sy_7NvyeC62czOQJaJQbIiwNRN9hR-cu_vFJeLwC-IHoIVbJFEPT8QOu0_9YMla4orQVE9WuEiLLDLyI1YyxYDodiOIU5FXs4MLMRRI",
      category: "EV Charging",
      readTime: "4 min read",
      title: "Preparing Your Home for an Electric Vehicle",
      description: "Fast, certified installation of Tesla, JuiceBox, and ChargePoint residential chargers for your garage.",
      link: "#"
    },
    {
      id: 3,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAV3zEVZEX5mZ2EuGgc5oA0WtJhqQ-N8eiA4aoj67LeekVlyiRZ-TQHWi_uDX01vMCG_AItcJB0TygGHnU672WZ3HBB53XdM_m3eZjBJUaAdp1s9mYxIP6xFhlb6vgtJxBkjvqWZOVkUFIi0s8J3fyoU7_959eTIVmkaVWdd0rhMGaOyQRhA0diL5JeGLOKAgmBI1QlgpfPqr29Cgh8mMOIVZjCLbT4fmfNKDB_q-9E_wyDmadYO19Ryouz_kDYqNGAsTAr1mzrsxE",
      category: "Safety",
      readTime: "7 min read",
      title: "Industrial Standards for Residential Safety",
      description: "Why we bring industrial-grade quality and commercial precision to every residential circuit we touch.",
      link: "#"
    }
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <main>
        <BlogArticle
          title="5 Signs Your Home's Electrical Panel Needs an Immediate Upgrade"
          content={articleContent}
          author={{
            name: "Rob Konen",
            initials: "RK"
          }}
          publishedDate="Jan 24, 2025"
          readingTime="6 min read"
          categories={["Safety", "Home Improvement"]}
          heroImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBy5eF_MA3ugvzaD0FOYPHtoMmx-f1jyyBVb5ba42qOaIkVaWGymVEeD7iuIZ0fjCm-rPUwkujJ2HPqOTtLFYdCu4nDVOCNSx_l9RkkF6bnIGLRi9FXOo9kV1T_Az9Ook_1WHhk0GdL1-H50s9mnV8PAiHPu_DESQOj8a2CQKeW75_MrxRy26IPKx2XUDOVYabGgQ3AlRv22ZYQqrslzWZVF60-Thws_urQQmJOnDI-mSJ_xBa9_BhGm5SRngWQzS1jY3JzIgMX7Io"
        />
      </main>
      
      <CtaBox
        title="Ready to start your electrical project?"
        primaryButtonText="Get a Free Estimate"
        primaryButtonHref="/request-estimate"
        secondaryButtonText="Call Us Now"
        secondaryButtonHref="tel:5550123456"
      />
      
      <RelatedArticles articles={relatedArticles} />
    </>
  );
}
