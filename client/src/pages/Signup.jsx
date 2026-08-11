import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

import vector1 from "../assets/vector1.png";
import vector2 from "../assets/vector2.png";

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { signup } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setErrorMessage("");
    setLoading(true);

    try {
      await signup(data);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    {
      label: "8+ characters",
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(password),
    },
  ];

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
            h-[28rem] w-[28rem]
            rounded-full
            bg-indigo-500/20 blur-3xl
            dark:bg-indigo-500/10
            animate-[pulse_9s_ease-in-out_infinite]
          "
        />

        {/* Cyan glow */}
        <div
          className="
            absolute bottom-[-12rem] left-1/3
            h-96 w-96
            rounded-full
            bg-cyan-400/10 blur-3xl
            animate-[pulse_8s_ease-in-out_infinite]
          "
        />

        {/* Grid */}
        <div
          className="
            absolute inset-0
            opacity-[0.035]
            dark:opacity-[0.025]
            [background-image:linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        {/* Particles */}
        <span className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-blue-500/40 animate-bounce" />

        <span className="absolute right-[15%] top-[25%] h-1.5 w-1.5 rounded-full bg-indigo-500/50 animate-ping" />

        <span className="absolute left-[20%] bottom-[18%] h-1.5 w-1.5 rounded-full bg-cyan-500/40 animate-pulse" />

        <span className="absolute right-[25%] bottom-[12%] h-2 w-2 rounded-full bg-blue-400/30 animate-bounce" />
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* =================================================
              CARD
          ================================================== */}

          <div
            className="
              relative overflow-hidden
              rounded-[2rem]
              border border-white/70
              bg-white/80
              p-7
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

            <div className="relative mb-7 text-center">
              {/* REAL ANIMATED LOGO */}

              <div
                className="
                  group relative mx-auto mb-5
                  flex flex-col items-center
                  animate-[logoEntrance_.9s_cubic-bezier(.2,.8,.2,1)]
                "
              >
                {/* Glow */}

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

                {/* Logo */}

                <div
                  className="
                    relative h-16 w-20
                    transition-transform duration-500
                    group-hover:scale-110
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

                {/* Name */}

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
                  text-2xl font-black
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                Create your account
              </h1>

              <p
                className="
                  mt-2 text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Join Logoipsum and start managing your workspace
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* FULL NAME */}

              <div className="group">
                <label
                  className="
                    mb-2 block
                    text-xs font-bold
                    text-slate-600
                    dark:text-slate-300
                  "
                >
                  Full name
                </label>

                <div className="relative">
                  <User
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
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                    type="text"
                    placeholder="Enter your full name"
                    className="
                      h-11 w-full
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

                      dark:border-slate-700
                      dark:bg-slate-800/60
                      dark:text-white
                      dark:focus:bg-slate-800
                    "
                  />
                </div>

                {errors.fullName && (
                  <p className="mt-1 text-[11px] font-medium text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

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
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    type="email"
                    placeholder="you@example.com"
                    className="
                      h-11 w-full
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

                      dark:border-slate-700
                      dark:bg-slate-800/60
                      dark:text-white
                      dark:focus:bg-slate-800
                    "
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-[11px] font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORDS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      size={16}
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
                        minLength: {
                          value: 8,
                          message: "Minimum 8 characters",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="
                        h-11 w-full
                        rounded-xl
                        border border-slate-200
                        bg-slate-50
                        pl-11 pr-11
                        text-sm text-slate-900
                        outline-none
                        transition-all duration-300

                        placeholder:text-slate-400

                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10

                        dark:border-slate-700
                        dark:bg-slate-800/60
                        dark:text-white
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
                        hover:bg-slate-200
                        hover:text-slate-700

                        dark:hover:bg-slate-700
                        dark:hover:text-white
                      "
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-[11px] font-medium text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}

                <div className="group">
                  <label
                    className="
                      mb-2 block
                      text-xs font-bold
                      text-slate-600
                      dark:text-slate-300
                    "
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <Lock
                      size={16}
                      className="
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition-colors
                        group-focus-within:text-blue-500
                      "
                    />

                    <input
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm"
                      className="
                        h-11 w-full
                        rounded-xl
                        border border-slate-200
                        bg-slate-50
                        pl-11 pr-11
                        text-sm text-slate-900
                        outline-none
                        transition-all duration-300

                        placeholder:text-slate-400

                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10

                        dark:border-slate-700
                        dark:bg-slate-800/60
                        dark:text-white
                        dark:focus:bg-slate-800
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="
                        absolute right-2 top-1/2
                        flex h-8 w-8
                        -translate-y-1/2
                        items-center justify-center
                        rounded-lg
                        text-slate-400
                        hover:bg-slate-200
                        hover:text-slate-700

                        dark:hover:bg-slate-700
                        dark:hover:text-white
                      "
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-1 text-[11px] font-medium text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* PASSWORD REQUIREMENTS */}

              <div
                className="
                  rounded-xl
                  border border-slate-100
                  bg-slate-50/70
                  p-3

                  dark:border-slate-800
                  dark:bg-slate-800/40
                "
              >
                <p
                  className="
                    mb-2 text-[10px]
                    font-bold uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Password requirements
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {passwordRequirements.map((item) => (
                    <div
                      key={item.label}
                      className={`
                        flex items-center gap-1.5
                        text-[10px] font-medium
                        transition-colors
                        ${item.valid ? "text-emerald-500" : "text-slate-400"}
                      `}
                    >
                      {item.valid ? <Check size={12} /> : <X size={12} />}

                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* DIVISION + YEAR */}

              <div className="grid grid-cols-2 gap-4">
                {/* DIVISION */}

                <div className="group">
                  <label
                    className="
                      mb-2 block
                      text-xs font-bold
                      text-slate-600
                      dark:text-slate-300
                    "
                  >
                    Division
                  </label>

                  <div className="relative">
                    <GraduationCap
                      size={16}
                      className="
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition-colors
                        group-focus-within:text-blue-500
                      "
                    />

                    <input
                      {...register("division", {
                        required: "Division is required",
                      })}
                      type="text"
                      placeholder="CSE"
                      className="
                        h-11 w-full
                        rounded-xl
                        border border-slate-200
                        bg-slate-50
                        pl-11 pr-3
                        text-sm text-slate-900
                        outline-none
                        transition-all duration-300

                        placeholder:text-slate-400

                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10

                        dark:border-slate-700
                        dark:bg-slate-800/60
                        dark:text-white
                        dark:focus:bg-slate-800
                      "
                    />
                  </div>

                  {errors.division && (
                    <p className="mt-1 text-[11px] font-medium text-red-500">
                      {errors.division.message}
                    </p>
                  )}
                </div>

                {/* YEAR */}

                <div className="group">
                  <label
                    className="
                      mb-2 block
                      text-xs font-bold
                      text-slate-600
                      dark:text-slate-300
                    "
                  >
                    Year
                  </label>

                  <div className="relative">
                    <GraduationCap
                      size={16}
                      className="
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition-colors
                        group-focus-within:text-blue-500
                      "
                    />

                    <input
                      {...register("year", {
                        required: "Year is required",
                      })}
                      type="text"
                      placeholder="3rd"
                      className="
                        h-11 w-full
                        rounded-xl
                        border border-slate-200
                        bg-slate-50
                        pl-11 pr-3
                        text-sm text-slate-900
                        outline-none
                        transition-all duration-300

                        placeholder:text-slate-400

                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10

                        dark:border-slate-700
                        dark:bg-slate-800/60
                        dark:text-white
                        dark:focus:bg-slate-800
                      "
                    />
                  </div>

                  {errors.year && (
                    <p className="mt-1 text-[11px] font-medium text-red-500">
                      {errors.year.message}
                    </p>
                  )}
                </div>
              </div>

              {/* REGISTER */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group relative
                  mt-2
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

                  hover:-translate-y-0.8
                  hover:bg-[#7B3F01]
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
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
                mt-5 flex items-center
                justify-center gap-2
                text-[10px] font-medium
                text-slate-400
              "
            >
              <ShieldCheck size={14} />

              <span>Your information is securely protected</span>
            </div>

            {/* LOGIN */}

            <div
              className="
                mt-6 border-t
                border-slate-100
                pt-5
                text-center
                dark:border-slate-800
              "
            >
              <p
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="
                    font-bold
                    text-blue-600
                    transition-colors
                    hover:text-blue-700
                    dark:text-blue-400
                    dark:hover:text-blue-300
                  "
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* FOOTER */}

          <p
            className="
              mt-5
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
