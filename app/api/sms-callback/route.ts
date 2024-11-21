import { NextResponse } from "next/server";

export async function POST(req: Request) {
    if(req.method === "POST") {
        const callbackData = req.json();
        try {
            const processCallbackData = async(callbackData: any) => {
                // Simulating an async operation (e.g., saving data to a database)
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve({ success: true, data: callbackData });
                  }, 1000); // Simulate a 1-second async operation
                });
              }
            
              const processCallbackDataResult = await processCallbackData(callbackData);
            console.log("SMS callback received:", processCallbackDataResult);

            // Respond with 200 OK to confirm receipt
            return NextResponse.json(
                { message: "Callback received successfully" },
                { status: 200 }
            );
        } catch (error: any) {
            console.error("Error in SMS callback handler:", error.message || error);
            return NextResponse.json(
                { error: "Failed to process callback" },
                { status: 500 }
            );
        }
    } else {
        return NextResponse.json(
            { error: "Route Not Found" },
            { status: 404 }
        );
    }
}
