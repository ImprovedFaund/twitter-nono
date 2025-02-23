import { Outlet, Link, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import "../main.css";

function Layout() {
    const { isSignedIn, isLoaded } = useUser();

    // Wait for auth to load before redirecting
    if (!isLoaded) {
        return null;
    }

    // Redirect to sign-in if not authenticated
    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    return (
        <div>
            <div className="layout">
                {/* Sidebar */}
                <div className="sidebar">
                    <div>
                        <h1 className="logo">Type.</h1>
                        <nav className="nav-menu">
                            <Link to="/" className="nav-link">
                                <HomeIcon width="36px" />
                            </Link>
                            <Link to="/profile" className="nav-link">
                                <UserIcon width="36px" />
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main content */}
                <div>
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Layout;
