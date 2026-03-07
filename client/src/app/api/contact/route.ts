import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateContactForm, ValidationError } from '@/lib/form-validation';
import { GET_PHONE_NUMBER } from '@/lib/wordpress-queries';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    
    // Check if environment variables are configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO;
    
    // Fetch phone number from WordPress GraphQL
    let phoneNumber = null;
    try {
      const graphqlResponse = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: GET_PHONE_NUMBER,
        }),
      });
      
      const graphqlData = await graphqlResponse.json();
      phoneNumber = graphqlData.data?.page?.landingPage?.headerInfo?.contactPhoneNumber;
    } catch (error) {
      console.warn('Failed to fetch phone number from GraphQL:', error);
    }
    
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate form data
    const validationErrors = validateContactForm({ name, email, phone, subject, message });
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationErrors.map(err => `${err.field}: ${err.message}`).join(', ')
        },
        { status: 400 }
      );
    }

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin: 0 0 15px 0;">Contact Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        </div>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
          <h3 style="color: #374151; margin: 0 0 15px 0;">Message</h3>
          <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>This message was sent from the CK Electric contact form.</p>
          <p>Submitted on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'CK Electric Website <hello@alecaceres.com>',
      to: [emailTo || 'hello@ckelectricps.com'],
      subject: `New Contact Form: ${subject || 'General Inquiry'} - ${name}`,
      html: emailContent,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    // Send confirmation email to the user
    const confirmationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
          Thank You for Contacting CK Electric
        </h2>
        
        <p style="color: #374151; line-height: 1.6;">
          We've received your message and will get back to you within 24 hours. 
          Our team is reviewing your inquiry and will respond as soon as possible.
        </p>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin: 0 0 10px 0;">Your Message Summary:</h3>
          <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          <p style="margin: 5px 0;"><strong>Message:</strong> ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
        </div>
        
        <div style="margin: 30px 0;">
          <p style="color: #374151; font-weight: bold;">Need immediate assistance?</p>
          <p style="color: #374151;">
            ${phoneNumber ? `Call us: <a href="tel:${phoneNumber}" style="color: #f59e0b; text-decoration: none;">${phoneNumber}</a><br>` : ''}
            ${emailTo ? `Email us: <a href="mailto:${emailTo}" style="color: #f59e0b; text-decoration: none;">${emailTo}</a>` : ''}
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>CK Electric - Serving Tacoma to Skagit Valley, WA</p>
          <p>Licensed & Insured Electrical Contractors</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'CK Electric <hello@alecaceres.com>',
      to: [email],
      subject: 'Thank You for Contacting CK Electric',
      html: confirmationContent,
    });

    return NextResponse.json(
      { message: 'Contact form submitted successfully. You will receive a confirmation email shortly.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
