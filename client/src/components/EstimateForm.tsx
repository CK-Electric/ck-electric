'use client';

import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';

export default function EstimateForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
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

    const encode = (data: Record<string, string>) =>
      Object.keys(data)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
        .join('&');

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'estimate', ...formData }),
      });

      if (response.ok) {
        setStatusMessage("Estimate request submitted! We'll contact you within 24 hours.");
        setStatusType('success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setStatusMessage('Failed to submit estimate request. Please try again.');
        setStatusType('error');
      }
    } catch (error) {
      setStatusMessage('An unexpected error occurred. Please try again later.');
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="space-y-5" name="estimate" data-netlify="true" onSubmit={handleSubmit}>
        <input type="hidden" name="form-name" value="estimate" />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Name"
            name="name"
            placeholder="Your Name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            label="Phone"
            name="phone"
            placeholder="(555) 000-0000"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <Input
          label="Email"
          name="email"
          placeholder="your.email@example.com"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        
        <Textarea
          label="Message"
          name="message"
          placeholder="How can we help?"
          rows={3}
          required
          value={formData.message}
          onChange={handleChange}
        />
        
        <Button
          label={isSubmitting ? "Submitting..." : "Request Immediate Estimate"}
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        />
      </form>
      {statusMessage && (
        <div className={`mt-4 p-4 rounded-lg ${statusType === 'success' ? 'bg-positive-100 text-positive-700' : 'bg-negative-100 text-negative-700'}`}>
          {statusMessage}
        </div>
      )}
    </>
  );
}
