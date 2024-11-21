import sendSMS from "@/app/lib/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNo, message } = body;

    if (!phoneNo || !message) {
      return NextResponse.json({ error: "Phone number or message is missing." },
        { status: 400 }
      );
    }

    const response = await sendSMS(phoneNo, message);

    return NextResponse.json(
        { success: true, response }, 
        { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in send-sms API:", error.message || error);
    return NextResponse.json(
        { error: "Failed to send SMS" },
        { status: 500 }
    );
  }
}
