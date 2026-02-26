import { Metadata } from 'next';
import BlogPageContent from '@/components/BlogPageContent';

// Generate metadata for the blog page - SSR
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog | CK Electric - Puget Sound',
    description: 'Electrical tips, industry insights, and project highlights from CK Electric professionals serving Puget Sound.',
    keywords: 'electrical blog, electrical tips, electrical safety, electrical projects, Puget Sound electrical contractor',
  };
}

export default function BlogPage() {
  // Sample data - in real app this would come from API/WordPress
  const blogPosts = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-JqCzjS64Hb8vSriTKSo6C94jdsiShTmUZ78OULETlx6CJS7HVqdcS3_UXv7TcdHNG2bNBDjt2egbSeSeZWTFTIsunLj-Atp7lSELPrTxYm8vTWAEjRKXjqH4dLH-dtHMtlXjvSoELi__jH8mmH0MDrr7gNMUspglMpEjFpa92pPvNdJ7qA8twuIrlHdx2QXdVZmqeQU6R7Qm-Yt0x-5VjB6qztLcGJmC9gR1ja9PY8cTrJy2ZWiTy-zql_bxDFTQVSi106gz270",
      category: "Lighting",
      date: "Oct 24, 2023",
      readTime: "5 Min Read",
      title: "Lighting Solutions for Modern Homes",
      description: "Discover how custom LED design and landscape lighting can transform your home's ambiance and security with smart controls.",
      link: "/blog/lighting-solutions-modern-homes"
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-JqCzjS64Hb8vSriTKSo6C94jdsiShTmUZ78OULETlx6CJS7HVqdcS3_UXv7TcdHNG2bNBDjt2egbSeSeZWTFTIsunLj-Atp7lSELPrTxYm8vTWAEjRKXjqH4dLH-dtHMtlXjvSoELi__jH8mmH0MDrr7gNMUspglMpEjFpa92pPvNdJ7qA8twuIrlHdx2QXdVZmqeQU6R7Qm-Yt0x-5VjB6qztLcGJmC9gR1ja9PY8cTrJy2ZWiTy-zql_bxDFTQVSi106gz270",
      category: "Safety",
      date: "Oct 20, 2023",
      readTime: "3 Min Read",
      title: "Electrical Safety Tips for Homeowners",
      description: "Essential safety guidelines every homeowner should know to prevent electrical hazards and protect their family.",
      link: "/blog/electrical-safety-tips-homeowners"
    },
    {
      id: 3,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-JqCzjS64Hb8vSriTKSo6C94jdsiShTmUZ78OULETlx6CJS7HVqdcS3_UXv7TcdHNG2bNBDjt2egbSeSeZWTFTIsunLj-Atp7lSELPrTxYm8vTWAEjRKXjqH4dLH-dtHMtlXjvSoELi__jH8mmH0MDrr7gNMUspglMpEjFpa92pPvNdJ7qA8twuIrlHdx2QXdVZmqeQU6R7Qm-Yt0x-5VjB6qztLcGJmC9gR1ja9PY8cTrJy2ZWiTy-zql_bxDFTQVSi106gz270",
      category: "Commercial",
      date: "Oct 15, 2023",
      readTime: "7 Min Read",
      title: "Commercial Electrical Upgrades",
      description: "Modernizing your business electrical systems for improved efficiency, safety, and compliance with current codes.",
      link: "/blog/commercial-electrical-upgrades"
    },
    {
      id: 4,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-JqCzjS64Hb8vSriTKSo6C94jdsiShTmUZ78OULETlx6CJS7HVqdcS3_UXv7TcdHNG2bNBDjt2egbSeSeZWTFTIsunLj-Atp7lSELPrTxYm8vTWAEjRKXjqH4dLH-dtHMtlXjvSoELi__jH8mmH0MDrr7gNMUspglMpEjFpa92pPvNdJ7qA8twuIrlHdx2QXdVZmqeQU6R7Qm-Yt0x-5VjB6qztLcGJmC9gR1ja9PY8cTrJy2ZWiTy-zql_bxDFTQVSi106gz270",
      category: "Residential",
      date: "Oct 10, 2023",
      readTime: "4 Min Read",
      title: "Home EV Charger Installation",
      description: "Complete guide to installing electric vehicle charging stations at home, including permits and electrical requirements.",
      link: "/blog/home-ev-charger-installation"
    },
    {
      id: 5,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-JqCzjS64Hb8vSriTKSo6C94jdsiShTmUZ78OULETlx6CJS7HVqdcS3_UXv7TcdHNG2bNBDjt2egbSeSeZWTFTIsunLj-Atp7lSELPrTxYm8vTWAEjRKXjqH4dLH-dtHMtlXjvSoELi__jH8mmH0MDrr7gNMUspglMpEjFpa92pPvNdJ7qA8twuIrlHdx2QXdVZmqeQU6R7Qm-Yt0x-5VjB6qztLcGJmC9gR1ja9PY8cTrJy2ZWiTy-zql_bxDFTQVSi106gz270",
      category: "Lighting",
      date: "Oct 5, 2023",
      readTime: "6 Min Read",
      title: "Smart Home Automation",
      description: "How modern electrical systems can integrate with smart home technology for convenience and energy savings.",
      link: "/blog/smart-home-automation"
    },
    {
      id: 6,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-JqCzjS64Hb8vSriTKSo6C94jdsiShTmUZ78OULETlx6CJS7HVqdcS3_UXv7TcdHNG2bNBDjt2egbSeSeZWTFTIsunLj-Atp7lSELPrTxYm8vTWAEjRKXjqH4dLH-dtHMtlXjvSoELi__jH8mmH0MDrr7gNMUspglMpEjFpa92pPvNdJ7qA8twuIrlHdx2QXdVZmqeQU6R7Qm-Yt0x-5VjB6qztLcGJmC9gR1ja9PY8cTrJy2ZWiTy-zql_bxDFTQVSi106gz270",
      category: "Safety",
      date: "Sep 28, 2023",
      readTime: "5 Min Read",
      title: "Panel Upgrade Guidelines",
      description: "When and why you should upgrade your electrical panel for safety and capacity improvements.",
      link: "/blog/panel-upgrade-guidelines"
    }
  ];

  return <BlogPageContent blogPosts={blogPosts} />;
}
