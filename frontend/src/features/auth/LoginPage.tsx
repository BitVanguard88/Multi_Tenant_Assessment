import { type FormEvent, useState } from "react";
import { useLogin } from "./useLogin";

export function LoginPage() {
    const loginMutation = useLogin();
    const [email, setEmail] = useState("allen@brightmarket.com");
    const [password, setPassword] = useState("Password123!");

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <div className="eyebrow">OrbitIQ Analytics</div>
                <h1>Sign in to your workspace</h1>
                <p className="muted">
                    Your email identifies your organization automatically. No tenant selection needed.
                </p>

                <form onSubmit={onSubmit} className="form-stack">
                    <label>
                        <span>Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="name@company.com"
                        />
                    </label>

                    <label>
                        <span>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter password"
                        />
                    </label>

                    <button type="submit" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? "Signing in..." : "Sign in"}
                    </button>

                    {loginMutation.isError ? (
                        <div className="error-message">{(loginMutation.error as Error).message}</div>
                    ) : null}
                </form>

                <div className="demo-users">
                    <strong>Demo users</strong>
                    <ul>
                        <li>allen@brightmarket.com / Password123!</li>
                        <li>mike@cloudsync.io / Password123!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}