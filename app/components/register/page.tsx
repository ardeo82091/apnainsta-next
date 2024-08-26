'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const RegisterPage = () => {

  const user = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setrePassword] = useState('');
  const [userName, setUserName] = useState('');
  const [dob, setDob] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const field = !fullName ? "Full Name" : !gender ? "Gender" : !userName ? "User Name" : !dob ? "Date Of Birth" : "All";
      if ((!fullName && !userName && !gender && !dob && !password && !repassword && !email && !phoneNumber)) {
        setError(`Please enter ${field} to register`);
        return;
      }
      const response = await axios.post('/api/register', { fullName, userName, gender, dob, password, repassword, email, phoneNumber });

      if (response.data.success) {
        setSuccess('Registration successful');
        setError('');
        router.push('/components/login');
      } else {
        setError(response.data.message || 'Registration failed');
        setSuccess('');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An unexpected error occurred');
      setSuccess('');
    }
  };

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="relative w-full max-w-md">
        <div className="absolute top-1/2 left-[-350px] transform -translate-y-1/2">
          <h1 className="text-9xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">LIVE</h1>
        </div>
        <div className="absolute top-1/2 right-[-350px] transform -translate-y-1/2">
          <h1 className="text-9xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">VIBE</h1>
        </div>
          {/* Slide 1: First Name and Last Name */}
          {currentSlide === 0 && (
            <div className="bg-white rounded p-8 shadow-md w-full flex flex-col items-center">
              <h2 className="text-xl mb-6 font-bold text-center bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                Step 1
              </h2>
              <div className="mb-4 w-full">
                <label htmlFor="fullName" className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-sm font-extrabold mb-2">
                  Full Name
                </label>
                <input
                  className="shadow appearance border rounded w-full py-2 px-3 text-black focus:outline-none"
                  id="fullName"
                  type="text"
                  placeholder="Enter..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="mb-4 w-full">
                <label htmlFor="dob" className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-sm font-extrabold mb-2">
                  Date of Birth
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black focus:outline-none"
                  id="dob"
                  type="date"
                  placeholder="Enter..."
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="mb-4 w-full">
                <label className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-sm font-extrabold mb-2">
                  Gender
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`py-2 px-4 border rounded ${gender === 'male' ? 'bg-teal-400 text-white' : 'bg-white text-black'}`}
                    onClick={() => setGender('male')}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 border rounded ${gender === 'female' ? 'bg-teal-400 text-white' : 'bg-white text-black'}`}
                    onClick={() => setGender('female')}
                  >
                    Female
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 border rounded ${gender === 'other' ? 'bg-teal-400 text-white' : 'bg-white text-black'}`}
                    onClick={() => setGender('other')}
                  >
                    Other
                  </button>
                </div>
              </div>
              <div className="flex justify-between w-full mt-6">
                <button>
                </button>
                <button
                  className="shadow bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold px-0.5 rounded focus:outline-none "
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Slide 2: Email and Password */}
          {currentSlide === 1 && (
            <div className="bg-white rounded p-8 shadow-md w-full flex flex-col items-center">
              <h2 className="text-xl mb-6 font-bold text-center bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                Step 2
              </h2>
              <div className="mb-4 w-full">
                <label htmlFor="userName" className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-sm font-extrabold mb-2">
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black focus:outline-none"
                  id="userName"
                  type="text"
                  placeholder="Enter..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="mb-4 w-full">
                <label htmlFor="password" className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-sm font-extrabold mb-2">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black focus:outline-none"
                  id="password"
                  type="password"
                  placeholder="Enter..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4 w-full">
                <label htmlFor="password" className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-sm font-extrabold mb-2">
                  Re-Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black focus:outline-none"
                  id="repassword"
                  type="password"
                  placeholder="Enter Password Again!!"
                  value={repassword}
                  onChange={(e) => setrePassword(e.target.value)}
                />
              </div>
              <div className="flex justify-between w-full mt-6">
                <button
                  className="shadow bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold px-0.5 rounded focus:outline-none "
                  onClick={handlePrev}
                >
                  Prev
                </button>
                <button
                  className="shadow bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold px-0.5 rounded focus:outline-none "
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Slide 3: Username and Date of Birth */}
          {currentSlide === 2 && (
            <div className="bg-white rounded p-8 shadow-md w-full flex flex-col items-center">
              <h2 className="text-xl mb-6 font-bold text-center bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                Step 3
              </h2>
              <div className="mb-4 w-full">
                <label htmlFor="email" className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-sm font-extrabold mb-2">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black focus:outline-none"
                  id="email"
                  type="email"
                  placeholder="Enter..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4 w-full">
                <label htmlFor="phoneNumber" className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-sm font-extrabold mb-2">
                  Phone Number
                </label>
                <div className="flex items-center">
                  <select
                    value={countryCode}
                    onChange={(event) => setCountryCode(event.target.value)} 
                    className="border-none bg-transparent shadow appearance-none border rounded focus:outline-none text-gray-500 font-semibold mr-2 py-2 px-2"
                    aria-label="Country Code"
                  >
                    <option value="+1"> US +1</option>
                    <option value="+44"> UK +44</option>
                    <option value="+91"> IN +91</option>
                    <option value="+61"> AU +61</option>
                    <option value="+81"> JP +81</option>
                    <option value="+49"> DE +49</option>
                    <option value="+33"> FR +33</option>
                    <option value="+86"> CN +86</option>
                    <option value="+7"> RU +7</option>
                    <option value="+39"> IT +39</option>
                  </select>
                  <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black focus:outline-none"
                    id="phoneNumber"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="text-gray-400">
                <label htmlFor="termAndConditionChecked" className="flex items-center mt-4 relative">
                  <input
                    type="checkbox"
                    className="appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-teal-400 checked:border-teal-400 focus:outline-none"
                    checked={isChecked}
                    id="termAndConditionChecked"
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                      isChecked ? 'block' : 'hidden'
                    }`}
                    style={{ fontSize: '1.2rem', color: 'white', paddingRight: '9.9rem' }}
                  >
                    ✓
                  </div>
                  <span className="ml-2">Term and Condition</span>
                </label>
              </div>
              <div className="flex justify-between items-center mt-6 w-full">
                <div className="w-1/3">
                  <button
                    className="shadow bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold px-0.5 rounded focus:outline-none"
                    onClick={handlePrev}
                  >
                    Prev
                  </button>
                </div>

                <div className="w-1/3 flex justify-center">
                  <button
                    type="submit"
                    className="shadow bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none"
                    onClick={handleSubmit}
                  >
                    Register
                  </button>
                </div>
                
                <div className="w-1/3"></div>
              </div>

              <div className='text-red-400 text-4'>{error}</div>

            </div>
          )}
      </div>
    </div>
  );
};

export default RegisterPage;
