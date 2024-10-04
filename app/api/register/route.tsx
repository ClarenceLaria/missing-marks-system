import { NextResponse } from "next/server"

export async function POST (req: Request) {
    try {
        const {fname, sname, email, password, regNo} = await req.json();

        console.log("Name: ", fname + " " + sname);
        console.log("Email: ", email);
        console.log("regNo: ", regNo);
        // const res = await fetch('/api/register', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         firstName: fname,
        //         secondName: sname,
        //         email: email,
        //         regNo: regNo,
        //         password: password,
        //     }),
        // });

        return NextResponse.json({message: "user registered successfully"}, {status:201});
    } catch (error) {
        return NextResponse.json({message: "Error registering user"}, {status:500});
    }
}