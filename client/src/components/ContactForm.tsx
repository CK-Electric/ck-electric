'use client';

import { useState } from 'react';
import { Facebook, LinkedIn, Star, CheckCircle, Phone, Mail, LocationOn, AccessTime } from '@mui/icons-material';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SocialLinks from '@/components/SocialLinks';

interface ContactFormProps {
  pageData: {
    title?: string;
    content?: string;
    seo?: {
      metaDesc?: string;
      metaKeywords?: string;
    };
    contactInformation?: {
      businessHours?: string;
      facebookLink?: string;
      extraInfo?: {
        subtitle?: string;
        title?: string;
      };
      forwardedTo?: {
        mattEmail?: string;
        robEmail?: string;
      };
      googleMapsRating?: {
        locationLink?: string;
        rating?: string;
      };
      mattPhoneNumber?: string;
      principalEmail?: string;
      robPhoneNumber?: string;
      location?: string;
    };
  } | null;
}

export default function ContactForm({ pageData }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/contact', {
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
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: ''
        });
      } else {
        setStatusMessage(data.error || 'Failed to send message. Please try again.');
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
    ...(pageData?.contactInformation?.facebookLink
      ? [{ icon: <Facebook className="text-xl" />, href: pageData.contactInformation.facebookLink, label: "Facebook" }]
      : []),
  ];

  return (
    <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          
          <div className="max-w-5xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-neutral-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Contact Information */}
                <div className="bg-primary-50 p-8 rounded-2xl border border-primary-500/20 space-y-10">
                  <div>
                    <h2 className="text-display-5-upper text-primary-800 mb-6">Contact Information</h2>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <Phone className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Phone Support</p>
                          <p className="text-base text-neutral-600">Rob: {pageData?.contactInformation?.robPhoneNumber || "(555) 012-3456"}</p>
                          <p className="text-base text-neutral-600">Matt: {pageData?.contactInformation?.mattPhoneNumber || "(555) 012-3456"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <Mail className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Email Us</p>
                          <p className="text-base text-neutral-600">{pageData?.contactInformation?.principalEmail || "hello@ckelectricps.com"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <LocationOn className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Location</p>
                          <p className="text-base text-neutral-600">{pageData?.contactInformation?.location || "Serving Tacoma to Skagit Valley, WA"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg text-primary-500">
                          <AccessTime className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-base-bold text-neutral-950">Business Hours</p>
                          <p className="text-base text-neutral-600">{pageData?.contactInformation?.businessHours || "Mon-Fri: 8:00am - 6:00pm"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trust Indicators */}
                  <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-neutral-200">
                    <CheckCircle className="text-4xl text-primary-500 flex-shrink-0" />
                    <div>
                      <p className="text-base-bold text-neutral-950 font-black leading-tight">{pageData?.contactInformation?.extraInfo?.title || "Fully Licensed & Insured"}</p>
                      <p className="text-small-upper text-neutral-600">{pageData?.contactInformation?.extraInfo?.subtitle || "Certified Professional"}</p>
                    </div>
                  </div>
                  
                  {/* Social Icons */}
                  <SocialLinks
                    socialLinks={socialLinks}
                    titleAs="h3"
                    titleClassName="text-base-bold text-neutral-950"
                    linkClassName="w-12 h-12 bg-warning-500 text-white hover:bg-warning-600 rounded-full flex items-center justify-center transition-colors"
                  />
                </div>
                
                {/* Right: Contact Form */}
                <div>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="Enter your name"
                      type="text"
                      required
                      value={formData.name}
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
                    <Input
                      label="Phone Number"
                      name="phone"
                      placeholder="(555) 000-0000"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-base-bold text-neutral-950">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="w-full bg-primary-50 border-transparent focus:border-primary-500 focus:ring-0 text-neutral-950 text-sm p-4 rounded-xl"
                        value={formData.subject}
                        onChange={handleChange}
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Employment">Employment</option>
                        <option value="Service Request">Service Request</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label htmlFor="message" className="text-base-bold text-neutral-950">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="How can we help you?"
                        className="w-full bg-primary-50 border-transparent focus:border-primary-500 focus:ring-0 text-neutral-950 text-sm p-4 rounded-xl resize-none"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="md:col-span-2 mt-4">
                      <Button
                        label={isSubmitting ? "Sending..." : "Send Message"}
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
        </div>
    </section>
  );
}
