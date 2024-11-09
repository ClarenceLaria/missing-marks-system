import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages:{
        signIn:'/',
    }
});



export const config ={
    matcher:[
        '/Admin/:path*',
        '/Student/:path*',
        '/SuperAdmin/:path*',
        '/cod/:path*',
        '/Lecturer/:path*',
    ]
}