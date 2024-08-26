// app/api/merchant/auth/route.js
import { NextResponse } from 'next/server';
import { getMerchantByEmail, createMerchant } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { email, password, businessName, contactName, businessType, action } = await request.json();

  if (action === 'login') {
    const merchant = await getMerchantByEmail(email);
    if (merchant && await bcrypt.compare(password, merchant.password)) {
      // In a real app, you'd create a session or JWT here
      return NextResponse.json({ success: true, merchant: { id: merchant.id, businessName: merchant.businessName, email: merchant.email } });
    }
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } else if (action === 'register') {
    const existingMerchant = await getMerchantByEmail(email);
    if (existingMerchant) {
      return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newMerchant = await createMerchant({ businessName, email, password: hashedPassword, contactName, businessType });
    return NextResponse.json({ success: true, merchant: { id: newMerchant.id, businessName: newMerchant.businessName, email: newMerchant.email } });
  }

  return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
}