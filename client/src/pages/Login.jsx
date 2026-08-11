import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

import vector1 from "../assets/Vector1.png";
import vector2 from "../assets/Vector2.png";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    setErrorMessage("");
    setLoading(true);

    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#020617]">
      {/* =====================================================
          ANIMATED BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blue glow */}
        <div
          className="
            absolute -left-32 -top-32
            h-96 w-96 rounded-full
            bg-blue-500/20 blur-3xl
            dark:bg-blue-500/10
            animate-[pulse_7s_ease-in-out_infinite]
          "
        />

        {/* Indigo glow */}
        <div
          className="
            absolute -right-32 top-1/4
            h-[28rem] w-[28rem] rounded-full
            bg-indigo-500/20 blur-3xl
            dark:bg-indigo-500/10
            animate-[pulse_9s_ease-in-out_infinite]
          "
        />

        {/* Cyan glow */}
        <div
          className="
            absolute bottom-[-12rem] left-1/3
            h-96 w-96 rounded-full
            bg-cyan-400/10 blur-3xl
            animate-[pulse_8s_ease-in-out_infinite]
          "
        />

        {/* Background grid */}
        <div
          className="
            absolute inset-0
            opacity-[0.035]
            dark:opacity-[0.025]
            [background-image:linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        {/* Floating particles */}
        <span className="absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-blue-500/40 animate-bounce" />

        <span className="absolute right-[18%] top-[30%] h-1.5 w-1.5 rounded-full bg-indigo-500/50 animate-ping" />

        <span className="absolute left-[25%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-cyan-500/40 animate-pulse" />

        <span className="absolute right-[30%] bottom-[15%] h-2 w-2 rounded-full bg-blue-400/30 animate-bounce" />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
    relative z-10
    flex min-h-screen
    items-center justify-center
    px-3 py-6
    sm:px-5 sm:py-8
    lg:px-8
  "
      >
        <div className="w-full max-w-md">
          {/* =================================================
              LOGIN CARD
          ================================================== */}

          <div
            className="
  relative overflow-hidden
  rounded-2xl
  p-5
  sm:rounded-[2rem]
  sm:p-7
  md:p-8

  border border-white/70
  bg-white/80

  shadow-[0_25px_80px_-20px_rgba(15,23,42,0.25)]
  backdrop-blur-2xl

  dark:border-white/10
  dark:bg-slate-900/70
  dark:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.7)]

  animate-[fadeInUp_.8s_ease-out]
"
          >
            {/* Card glow */}
            <div
              className="
                pointer-events-none
                absolute -right-20 -top-20
                h-40 w-40
                rounded-full
                bg-blue-500/10
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute -bottom-20 -left-20
                h-40 w-40
                rounded-full
                bg-indigo-500/10
                blur-3xl
              "
            />

            {/* =================================================
                HEADER
            ================================================== */}

            <div className="relative mb-8 text-center">
              {/* REAL ANIMATED LOGO */}

              <div
                className="
                  group relative mx-auto mb-5
                  flex flex-col items-center
                  animate-[logoEntrance_.9s_cubic-bezier(.2,.8,.2,1)]
                "
              >
                {/* Logo glow */}
                <div
                  className="
                    absolute left-1/2 top-1/2
                    h-20 w-20
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-blue-500/20
                    blur-2xl
                    transition-all duration-700
                    group-hover:scale-125
                    group-hover:bg-blue-500/35
                  "
                />

                {/* Logo images */}
                <div
                  className="
    relative
    h-14 w-[4.5rem]
    sm:h-16 sm:w-20
  "
                >
                  <img
                    src={vector1}
                    alt="Logoipsum"
                    className="
                      absolute left-0 top-0 z-20
                      h-14 w-14
                      object-contain
                      drop-shadow-xl
                      animate-[logoLeft_4s_ease-in-out_infinite]
                    "
                  />

                  <img
                    src={vector2}
                    alt=""
                    aria-hidden="true"
                    className="
                      absolute bottom-0 right-0 z-10
                      h-14 w-14
                      object-contain
                      drop-shadow-xl
                      animate-[logoRight_4s_ease-in-out_infinite]
                    "
                  />
                </div>

                {/* Logo name */}
                <span
                  className="
                    relative mt-1
                    text-xl font-black
                    tracking-tight
                    text-slate-900
                    dark:text-white
                  "
                >
                  Logoipsum
                </span>
              </div>

              <h1
                className="
    text-xl
    font-black
    tracking-tight
    sm:text-2xl
    text-slate-900
    dark:text-white
  "
              >
                Welcome back
              </h1>

              <p
                className="
    mx-auto mt-2
    max-w-xs
    text-xs
    leading-relaxed
    text-slate-500
    sm:text-sm
    dark:text-slate-400
  "
              >
                Sign in to continue to your workspace
              </p>
            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {errorMessage && (
              <div
                className="
                  mb-5 rounded-xl
                  border border-red-200
                  bg-red-50
                  px-4 py-3
                  text-xs font-medium
                  text-red-600
                  animate-[shake_.4s_ease-in-out]

                  dark:border-red-900/40
                  dark:bg-red-950/30
                  dark:text-red-400
                "
              >
                {errorMessage}
              </div>
            )}

            {/* =================================================
                FORM
            ================================================== */}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* EMAIL */}

              <div className="group">
                <label
                  className="
                    mb-2 block
                    text-xs font-bold
                    text-slate-600
                    dark:text-slate-300
                  "
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition-colors
                      group-focus-within:text-blue-500
                    "
                  />

                  <input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    type="email"
                    placeholder="you@example.com"
                    className="
                      h-12 w-full
                      rounded-xl
                      border border-slate-200
                      bg-slate-50
                      pl-11 pr-4
                      text-sm text-slate-900
                      outline-none
                      transition-all duration-300

                      placeholder:text-slate-400

                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-500/10
                      focus:shadow-lg
                      focus:shadow-blue-500/5

                      dark:border-slate-700
                      dark:bg-slate-800/60
                      dark:text-white
                      dark:focus:border-blue-500
                      dark:focus:bg-slate-800
                    "
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-[11px] font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              <div className="group">
                <label
                  className="
                    mb-2 block
                    text-xs font-bold
                    text-slate-600
                    dark:text-slate-300
                  "
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={17}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition-colors
                      group-focus-within:text-blue-500
                    "
                  />

                  <input
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="
                      h-12 w-full
                      rounded-xl
                      border border-slate-200
                      bg-slate-50
                      pl-11 pr-12
                      text-sm text-slate-900
                      outline-none
                      transition-all duration-300

                      placeholder:text-slate-400

                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-500/10
                      focus:shadow-lg
                      focus:shadow-blue-500/5

                      dark:border-slate-700
                      dark:bg-slate-800/60
                      dark:text-white
                      dark:focus:border-blue-500
                      dark:focus:bg-slate-800
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute right-2 top-1/2
                      flex h-8 w-8
                      -translate-y-1/2
                      items-center justify-center
                      rounded-lg
                      text-slate-400
                      transition-all
                      hover:bg-slate-200
                      hover:text-slate-700

                      dark:hover:bg-slate-700
                      dark:hover:text-white
                    "
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-[11px] font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* FORGOT PASSWORD */}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="
                    text-xs font-semibold
                    text-blue-600
                    transition-colors
                    hover:text-blue-700
                    dark:text-blue-400
                    dark:hover:text-blue-300
                  "
                >
                  Forgot password?
                </button>
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group relative
                  flex h-12 w-full
                  items-center justify-center
                  gap-2
                  overflow-hidden
                  rounded-xl
                  bg-[#7B3F00]
                  text-sm font-bold
                  text-white
                  shadow-lg
                  shadow-blue-600/25
                  transition-all duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#7B3F00]
                  hover:shadow-xl
                  hover:shadow-blue-600/30

                  active:translate-y-0

                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {/* Shine */}
                <span
                  className="
                    absolute inset-0
                    -translate-x-full
                    bg-gradient-to-r
                    from-transparent
                    via-white/20
                    to-transparent
                    transition-transform
                    duration-700
                    group-hover:translate-x-full
                  "
                />

                {loading ? (
                  <>
                    <span
                      className="
                        h-4 w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={17}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </button>
            </form>

            {/* SECURITY */}

            <div
              className="
                mt-6 flex items-center
                justify-center gap-2
                text-[10px] font-medium
                text-slate-400
              "
            >
              <ShieldCheck size={14} />

              <span>Your connection is secure and encrypted</span>
            </div>

            {/* SIGN UP */}

            <div
              className="
                mt-7 border-t
                border-slate-100
                pt-6
                text-center
                dark:border-slate-800
              "
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="
                    font-bold text-blue-600
                    transition-colors
                    hover:text-blue-700
                    dark:text-blue-400
                  "
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* FOOTER */}

          <p
            className="
              mt-6
              text-center
              text-[10px]
              font-medium
              text-slate-400
              animate-[fadeIn_.9s_ease-out]
            "
          >
            © {new Date().getFullYear()} Logoipsum. All rights reserved.
          </p>
        </div>
      </div>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes logoEntrance {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.75);
          }

          60% {
            opacity: 1;
            transform: translateY(4px) scale(1.05);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes logoLeft {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }

          50% {
            transform: translate(-3px, -3px) rotate(-3deg);
          }
        }

        @keyframes logoRight {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }

          50% {
            transform: translate(3px, 3px) rotate(3deg);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }

          20% {
            transform: translateX(-6px);
          }

          40% {
            transform: translateX(6px);
          }

          60% {
            transform: translateX(-4px);
          }

          80% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </main>
  );
}
