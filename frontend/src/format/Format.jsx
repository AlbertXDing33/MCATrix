import "react"
import {UserButton, SignedIn, SignedOut} from "@clerk/clerk-react"
import {Outlet, Link, Navigate} from "react-router-dom"

export function Format() {
    return <div className = "app-layout">
        {/*Top nav bar of app */}
        <header className = "app-header">
            <div className = "header-content">
                <h1>MCATrix</h1>
                <nav>
                    <SignedIn>
                        <Link to = "/">Generate Question</Link>
                        <Link to = "/history">History</Link>
                        {/*User button is a feature of Clerk which lets users see their profile, signout, etc.*/}
                        <UserButton/> 
                    </SignedIn>
                </nav>
            </div>
        </header>

        <main className = "app-main">
            <SignedOut>
                {/*If the user is signed out, automatically send them to sign in page */}
                <Navigate to = "/sign-in" replace/>
            </SignedOut>
            <SignedIn>
                {/* Puts elements of App.jsx in the outlet(route with Format)*/}
                <Outlet/>
            </SignedIn>
        </main>
    </div>
}