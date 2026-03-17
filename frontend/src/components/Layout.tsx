import type { PropsWithChildren } from "react";
import { useAuthStore } from "../store/authStore";

export function Layout({ children }: PropsWithChildren) {
    const user = useAuthStore((state) => state.user);
    const tenant = useAuthStore((state) => state.tenant);
    const logout = useAuthStore((state) => state.logout);

    return (
        <div className="app-shell">
            <header className="topbar">
                <div>
                    <div className="eyebrow">OrbitIQ Analytics</div>
                    <h1>{tenant?.name} Engagement Dashboard</h1>
                    <p className="muted">
                        Signed in as {user?.fullName} · {user?.email}
                    </p>
                </div>

                <button className="secondary-button" onClick={logout}>
                    Sign out
                </button>
            </header>

            <main>{children}</main>
        </div>
    );
}