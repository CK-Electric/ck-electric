'use client';

import { useState } from 'react';
import { Facebook, LinkedIn, Star, CheckCircle, Phone, Mail, LocationOn, AccessTime } from '@mui/icons-material';
import HeroSection from '@/components/HeroSection';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SocialLinks from '@/components/SocialLinks';

interface RequestEstimateFormProps {
  pageData: any;
}

export default function RequestEstimateForm({ pageData }: RequestEstimateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage(data.message);
        setStatusType('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          project: '',
          address: ''
        });
      } else {
        setStatusMessage(data.error || 'Failed to submit estimate request. Please try again.');
        setStatusType('error');
      }
    } catch (error) {
      setStatusMessage('An unexpected error occurred. Please try again later.');
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: <Facebook className="text-xl" />, href: "#facebook", label: "Facebook" },
  ];

  return (
    <>
      <HeroSection
        title="Request a Free Estimate for electrical services"
        subtitle="We specialize in Commercial TIs, Panel Upgrades, and EV Chargers throughout Tacoma and nearby areas. If you're searching for a trusted contractor offering fair pricing and professional results, our team is ready to help."
        hideCTA={true}
        backgroundImage="https://images.unsplash.com/photo-1603796826034-2a34491c3b2e?w=1920&h=1080&fit=crop"
      />
      
      <section className="py-20 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-neutral-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Estimate Process */}
                <div className="bg-primary-50 p-8 rounded-2xl border border-primary-500/20 space-y-10">
                  <div>
                    <h3 className="text-display-5-upper text-primary-500 mb-6">How our estimate process works</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">1</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Submit your request</p>
                          <p className="text-base text-neutral-600">Fill out our estimate form with your project details and contact information</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">2</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">We review your project details</p>
                          <p className="text-base text-neutral-600">Our team analyzes your requirements and prepares for consultation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">3</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Schedule a consultation (if needed)</p>
                          <p className="text-base text-neutral-600">We may schedule a site visit to better understand your project scope</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <span className="text-xl font-bold text-primary-500">4</span>
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Receive a clear, written estimate</p>
                          <p className="text-base text-neutral-600">Get detailed pricing and timeline for your electrical project</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Icons */}
                  <SocialLinks 
                    socialLinks={socialLinks}
                    title="Connect With Us"
                    titleClassName="text-base-bold text-neutral-950"
                    linkClassName="w-12 h-12 bg-warning-500 text-white hover:bg-warning-600 rounded-full flex items-center justify-center transition-colors"
                  />
                </div>
                
                {/* Right: Estimate Form */}
                <div>
                  <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="Enter your full name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      placeholder="(555) 000-0000"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      placeholder="email@example.com"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="space-y-2">
                      <label htmlFor="project" className="text-base-bold text-neutral-950">
                        Tell us about your project
                      </label>
                      <textarea
                        id="project"
                        name="project"
                        rows={4}
                        placeholder="Describe your electrical project needs, timeline, and any specific requirements..."
                        className="w-full bg-primary-50 border-transparent focus:border-primary-500 focus:ring-0 text-neutral-950 text-sm p-4 rounded-xl resize-none"
                        required
                        value={formData.project}
                        onChange={handleChange}
                      />
                    </div>
                    <Input
                      label="Project Address"
                      name="address"
                      placeholder="Enter the project location address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <div className="mt-4">
                      <Button
                        label={isSubmitting ? "Submitting..." : "Request Free Estimate"}
                        variant="primary"
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      />
                    </div>
                  </form>
                  {statusMessage && (
                    <div className={`mt-4 p-4 rounded-lg ${statusType === 'success' ? 'bg-positive-100 text-positive-700' : 'bg-negative-100 text-negative-700'}`}>
                      {statusMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
      </section>
    </>
  );
}
