import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabaseClient";

export default function SignUp() {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [emailConfirmation, setEmailConfirmation] = useState(false);

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
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd)) errs.push("Password must contain at least one special character.");
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
      const { data, error } = await supabase.auth.signUp({
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

      if (error) {
        setErrors([error.message]);
        return;
      }

      if (data.user?.confirmation_sent_at) {
        setEmailConfirmation(true);
        return;
      }

      navigate("/");
    } catch (err) {
      setErrors([(err as Error).message]);
    }
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
            <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

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
                Sign Up
              </button>
            </form>

            <div className="flex items-center mb-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-400">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button
              onClick={handleGoogle}
              className="flex items-center justify-center w-full bg-neutral-200 px-4 py-2 rounded-lg shadow hover:bg-neutral-300 transition-colors"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Sign up with Google
            </button>

            <p className="mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Confirm Your Email</h1>
            <p className="mb-4 text-gray-700">
              We sent a confirmation link to <strong>{email}</strong>. Please check your email and click the link to confirm your account.
            </p>
          </>
        )}
      </div>
    </div>
  );
}