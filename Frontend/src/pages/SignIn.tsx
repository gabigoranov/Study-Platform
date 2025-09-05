import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabaseClient";

export default function SignIn() {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [emailConfirmation, setEmailConfirmation] = useState(false); // NEW

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (user) {
    navigate("/");
    return null;
  }

  const validatePassword = (pwd: string) => {
    const errs: string[] = [];
    if (pwd.length < 8) errs.push("Password must be at least 8 characters.");
    if (!/[a-z]/.test(pwd)) errs.push("Password must contain at least one lowercase letter.");
    if (!/[A-Z]/.test(pwd)) errs.push("Password must contain at least one uppercase letter.");
    if (!/[0-9]/.test(pwd)) errs.push("Password must contain at least one digit.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errs.push("Password must contain at least one special character.");
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setEmailConfirmation(false);

    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) {
      setErrors(pwdErrors);
      return;
    }

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If no account exists, sign up
        if (signInError.message.includes("Invalid login credentials")) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
                display_name: `${firstName} ${lastName}`,
              },
            },
          });

          if (signUpError) {
            setErrors([signUpError.message]);
            return;
          }

          // Show email confirmation box instead of signing in automatically
          if (signUpData.user?.confirmation_sent_at) {
            setEmailConfirmation(true);
            return;
          }
        } else {
          setErrors([signInError.message]);
        }
      } else {
        // Successful sign in
        navigate("/");
      }
    } catch (err) {
      setErrors([(err as Error).message]);
    }
  };

  const handleRetrySignIn = () => {
    setEmailConfirmation(false);
    setPassword("");
    setErrors([]);
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setErrors([(err as Error).message]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 sm:w-96 text-center">
        {!emailConfirmation ? (
          <>
            <h1 className="text-2xl font-bold mb-6">Sign In / Sign Up</h1>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
              {errors.length > 0 && (
                <div className="text-left text-red-500 text-sm">
                  {errors.map((err, idx) => (
                    <p key={idx}>{err}</p>
                  ))}
                </div>
              )}
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
              >
                Sign In / Sign Up
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-400">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogle}
              className="flex items-center justify-center w-full bg-neutral-200 px-4 py-2 rounded-lg shadow hover:bg-neutral-300 transition-colors"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Confirm Your Email</h1>
            <p className="mb-4 text-gray-700">
              We sent a confirmation link to <strong>{email}</strong>. Please check your email and click the link to confirm your account.
            </p>
            <button
              onClick={handleRetrySignIn}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
            >
              Try Signing In Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}