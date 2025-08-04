//react-router-dom alllows for slash routes(/home, /login, etc.)
import { BrowserRouter } from "react-router-dom" //allows for client side routing(navigation without full page reloads)
import { ClerkProvider } from "@clerk/clerk-react" //initializes Clerk authentication and gives the app access to sign in, user sessions, etc.

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key")
}

// Wraps the app with ClerkProvider for auth and BrowserRouter for routing
export default function ClerkRoutes({ children }) {
  return (
    //Clerk Provider needs the publishable key to connect to Clerk Project(in MD@)
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>{children}</BrowserRouter>
    </ClerkProvider>
  )
}
