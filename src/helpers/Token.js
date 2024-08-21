
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
export default  getTokenFromCookies = () => {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  };
  