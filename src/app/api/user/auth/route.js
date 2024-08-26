// app/api/user/auth/route.js
import { NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { email, password, name, action } = await request.json();

  if (action === 'login') {
    const user = await getUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      // In a real app, you'd create a session or JWT here
      return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    }
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } else if (action === 'register') {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ name, email, password: hashedPassword });
    return NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  }

  return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
}