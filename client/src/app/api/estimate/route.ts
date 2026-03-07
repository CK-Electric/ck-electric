import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateEstimateForm, ValidationError } from '@/lib/form-validation';
import { GET_PHONE_NUMBER } from '@/lib/wordpress-queries';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    
    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO;
    const senderEmail = process.env.SENDER_EMAIL;
    
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
    const { name, phone, email, project, address } = body;

    // Validate form data
    const validationErrors = validateEstimateForm({ name, phone, email, project });
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
          New Estimate Request
        </h2>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 10px 0;">🔌 Priority: Estimate Request</h3>
          <p style="margin: 0; color: #92400e;">This is a potential new project requiring a detailed estimate.</p>
        </div>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin: 0 0 15px 0;">Client Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin: 5px 0;"><strong>Project Address:</strong> ${address || 'Not provided'}</p>
        </div>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
          <h3 style="color: #374151; margin: 0 0 15px 0;">Project Details</h3>
          <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${project}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0;">📋 Next Steps</h3>
          <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
            <li>Review project scope and requirements</li>
            <li>Contact client for clarification (if needed)</li>
            <li>Schedule site visit (if required)</li>
            <li>Prepare detailed estimate</li>
            <li>Send estimate to client</li>
          </ol>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>This estimate request was submitted via the CK Electric website.</p>
          <p>Submitted on: ${new Date().toLocaleString()}</p>
          <p>Priority: High - Potential new project</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `CK Electric Website <${senderEmail}>`,
      to: [emailTo || 'hello@ckelectricps.com'],
      subject: `🔌 New Estimate Request: ${name}${address ? ' - ' + address : ''}`,
      html: emailContent,
      replyTo: email,
    });


    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send estimate request. Please try again later.', details: error.message },
        { status: 500 }
      );
    }

    // Send confirmation email to the user
    const confirmationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
          Your Estimate Request Has Been Received
        </h2>
        
        <p style="color: #374151; line-height: 1.6;">
          Thank you for requesting an estimate from CK Electric! We've received your request and our team will review it carefully.
        </p>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 10px 0;">⏱️ What to Expect Next</h3>
          <ol style="margin: 0; padding-left: 20px; color: #92400e;">
            <li>We'll review your project details within 24 hours</li>
            <li>We may contact you for additional information</li>
            <li>A site visit may be scheduled if needed</li>
            <li>You'll receive a detailed written estimate</li>
          </ol>
        </div>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin: 0 0 10px 0;">Your Request Summary:</h3>
          <p style="margin: 5px 0;"><strong>Project Details:</strong> ${project.substring(0, 200)}${project.length > 200 ? '...' : ''}</p>
        </div>
        
        <div style="margin: 30px 0;">
          <p style="color: #374151; font-weight: bold;">Questions or need to update your request?</p>
          <p style="color: #374151;">
            ${phoneNumber ? `Call us: <a href="tel:${phoneNumber}" style="color: #f59e0b; text-decoration: none;">${phoneNumber}</a><br>` : ''}
            ${emailTo ? `Email us: <a href="mailto:${emailTo}" style="color: #f59e0b; text-decoration: none;">${emailTo}</a>` : ''}
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>CK Electric - Serving Tacoma to Skagit Valley, WA</p>
          <p>Licensed & Insured Electrical Contractors</p>
          <p>Professional service within 24 hours</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: `CK Electric <${senderEmail}>`,
      to: [email],
      subject: 'Your CK Electric Estimate Request Has Been Received',
      html: confirmationContent,
    });

    return NextResponse.json(
      { message: 'Estimate request submitted successfully. You will receive a confirmation email and we\'ll contact you within 24 hours.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Estimate request error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
