import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Test API endpoint hit');
    
    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    console.log('Resend API Key exists:', !!resendApiKey);
    console.log('Resend API Key length:', resendApiKey?.length || 0);
    
    const body = await request.json();
    console.log('Request body:', body);
    
    return NextResponse.json({
      message: 'Test API working',
      apiKeyConfigured: !!resendApiKey,
      requestBody: body
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Test API failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
