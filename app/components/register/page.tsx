'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const primaryBtn =
  "w-full py-2.5 rounded-lg text-white font-semibold bg-gradient-to-r from-teal-400 to-blue-500 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200";

const secondaryBtn =
  "px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition";

const optionBtn = (active: boolean) =>
  `px-4 py-2 rounded-lg border text-sm font-medium transition ${
    active
      ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow"
      : "bg-white text-gray-600 hover:bg-gray-100"
  }`;

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const RegisterPage = () => {

  const router = useRouter();

  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    dob: '',
    gender: '',
    email: '',
    password: '',
    repassword: '',
    phoneNumber: '',
    countryCode: '+91',
  });

  const [agree, setAgree] = useState(false);
  const [verifyMode, setVerifyMode] = useState<'email' | 'phone'>('email');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // detect India
  const isIndian = form.countryCode === '+91';

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => setStep((p) => Math.min(p + 1, 2));
  const prev = () => setStep((p) => Math.max(p - 1, 0));

  const handleSubmit = async () => {
    if (!agree) {
      setError("You must accept terms & conditions");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/register', {
        ...form,
        verifyMode
      });

      if (res.data.success) {
        router.push('/components/login');
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">

    {/* LEFT ANIMATION */}
    <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden md:block">
      <h1 className="text-[120px] font-extrabold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
        LIVE
      </h1>
    </div>

    {/* RIGHT ANIMATION */}
    <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden md:block">
      <h1 className="text-[120px] font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
        VIBE
      </h1>
    </div>

    {/* FORM CARD */}
    <div className="z-10 w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">

      {/* PROGRESS */}
      <div className="flex justify-center mb-6 gap-2">
        {[0,1,2].map(i => (
          <div key={i}
            className={`h-2 w-8 rounded-full transition ${
              step >= i ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* STEP 1 */}
      {step === 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">Basic Info</h2>

          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange}/>

          {/* DOB FIX */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* GENDER */}
          <div className="mb-4">
            <p className="text-sm mb-2 text-gray-600">Gender</p>
            <div className="flex gap-3">
              {['Male','Female','Other'].map(g => (
                <button
                  key={g}
                  onClick={() => setForm({...form, gender: g})}
                  className={optionBtn(form.gender === g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <button onClick={next} className={primaryBtn}>
            Next →
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4">Account</h2>

          <Input label="Username" name="userName" value={form.userName} onChange={handleChange}/>
          <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange}/>
          <Input label="Confirm Password" type="password" name="repassword" value={form.repassword} onChange={handleChange}/>

          <div className="flex justify-between mt-4">
            <button onClick={prev} className={secondaryBtn}>
              Back
            </button>
            <button onClick={next} className={primaryBtn}>
              Next
            </button>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4">Verification</h2>

          <Input label="Email" name="email" value={form.email} onChange={handleChange}/>

          {/* PHONE */}
          <div className="flex gap-2 mb-4">
            <select
              name="countryCode"
              value={form.countryCode}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
            </select>

            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 rounded w-full"
            />
          </div>

          {/* VERIFY MODE */}
          <div className="mb-4">
            <p className="text-sm mb-2 text-gray-600">Verify using</p>

            {form.countryCode === '+91' ? (
              <div className="flex gap-3">
              <button
                onClick={() => setVerifyMode('email')}
                className={optionBtn(verifyMode === 'email')}
              >
                Email
              </button>

              <button
                onClick={() => setVerifyMode('phone')}
                className={optionBtn(verifyMode === 'phone')}
              >
                Phone
              </button>
            </div>
            ) : (
              <p className="text-gray-500 text-sm">Only Email verification available</p>
            )}
          </div>

          {/* TERMS */}
          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1 accent-blue-500"
            />
            <span className="text-gray-600">
              I agree to Terms, Privacy Policy & receive notifications.
            </span>
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-between">
            <button onClick={prev} className={secondaryBtn}>
              Back
            </button>
            <button onClick={handleSubmit} className={primaryBtn}>
              {loading ? "Registering..." : "Create Account"}
            </button>
          </div>
        </>
      )}

    </div>
  </div>
);
};

/* REUSABLE INPUT */

const Input = ({ label, name, value, onChange, type = "text" }: InputProps) => {
  const [focused, setFocused] = useState(false);

  const isActive = focused || value; // 🔥 FIX

  return (
    <div className="relative mb-5">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full border border-gray-300 px-3 pt-5 pb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent"
      />

      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none
          ${
            isActive
              ? "top-1 text-xs text-blue-500"
              : "top-3 text-gray-400"
          }`}
      >
        {label}
      </label>
    </div>
  );
};

export default RegisterPage;