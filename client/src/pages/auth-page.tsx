import { useLogin, useLoginById } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { GraduationCap, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "student">("student");
  const login = useLogin();
  const loginById = useLoginById();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Handle signup
    if (isSignup) {
      if (!name || !username || !password) {
        setError("Please fill in all fields");
        return;
      }

      // Ensure the DB is initialized by reading through localDb first
      // then read raw from localStorage
      const rawData = localStorage.getItem("student_portal_db");
      const db = rawData
        ? JSON.parse(rawData)
        : { users: [], activities: [], registrations: [], sessionUserId: null };

      const users = db.users as any[];

      // Check if username already exists (case-insensitive)
      if (users.find((u: any) => u.username.toLowerCase() === username.toLowerCase())) {
        setError("Username already exists. Please choose a different username.");
        return;
      }

      // Generate a safe unique ID using max existing ID + 1
      const maxId = users.length > 0 ? Math.max(...users.map((u: any) => u.id)) : 0;
      const newUser = {
        id: maxId + 1,
        username,
        password,
        name,
        role,
      };

      db.users.push(newUser);
      db.sessionUserId = newUser.id;
      localStorage.setItem("student_portal_db", JSON.stringify(db));

      // Auto-login after signup
      loginById.mutate(newUser.id);
      return;
    }

    // Validate inputs
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    // Use the login mutation (passes username + password to localDb.login)
    login.mutate(
      { username, password },
      {
        onError: () => setError("Invalid username or password"),
      }
    );
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="p-8">
          {/* Logo/Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-4 bg-white shadow-xl rounded-3xl mb-4">
              <GraduationCap className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-foreground">Campus</span>
              <span className="text-primary">Connect</span>
            </h1>
            <p className="text-muted-foreground">
              Your all-in-one portal for extracurricular activities, sports, and
              events.
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">
              {isSignup ? "Sign Up" : "Login"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your password"
                />
              </div>

              {isSignup && (
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium mb-2"
                  >
                    I am a
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as "admin" | "student")
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={login.isPending}
              >
                {login.isPending
                  ? isSignup
                    ? "Creating account..."
                    : "Logging in..."
                  : isSignup
                    ? "Sign Up"
                    : "Login"}{" "}
              </Button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError("");
                    setUsername("");
                    setPassword("");
                    setName("");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {isSignup ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
