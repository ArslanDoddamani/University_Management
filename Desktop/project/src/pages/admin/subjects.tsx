import React, { useState } from 'react';
import { admin } from '../../services/api'

export default function Subjects() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: '',
    semester: '',
    department: '',
    fees: {
      registration: '',
      reRegistrationF: '',
      reRegistrationW: '',
      challengeValuation: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('fees.')) {
      const feeKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        fees: {
          ...prev.fees,
          [feeKey]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await admin.addSubject({
        ...formData,
        credits: Number(formData.credits),
        semester: Number(formData.semester),
        fees: {
          registration: Number(formData.fees.registration),
          reRegistrationF: Number(formData.fees.reRegistrationF),
          reRegistrationW: Number(formData.fees.reRegistrationW),
          challengeValuation: Number(formData.fees.challengeValuation)
        }
      });

      alert('Subject added successfully!');
    } catch (error) {
      console.error('Error adding subject:', error);
      alert('Failed to add subject. Please try again.');
    }
  };

  return (
    <div>
      <h1 className='m-2 text-black font-bold text-center'>Add New Subject</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div>
          <label>Subject Code:</label>
          <input type="text" name="code" value={formData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Subject Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Credits:</label>
          <input type="number" name="credits" value={formData.credits} onChange={handleChange} required />
        </div>
        <div>
          <label>Semester:</label>
          <input type="number" name="semester" value={formData.semester} onChange={handleChange} required />
        </div>
        <div>
          <label>Department:</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required />
        </div>
        <div>
          <label>Registration Fee:</label>
          <input type="number" name="fees.registration" value={formData.fees.registration} onChange={handleChange} required />
        </div>
        <div>
          <label>Re-Registration Fee (Full):</label>
          <input type="number" name="fees.reRegistrationF" value={formData.fees.reRegistrationF} onChange={handleChange} required />
        </div>
        <div>
          <label>Re-Registration Fee (Withheld):</label>
          <input type="number" name="fees.reRegistrationW" value={formData.fees.reRegistrationW} onChange={handleChange} required />
        </div>
        <div>
          <label>Challenge Valuation Fee:</label>
          <input type="number" name="fees.challengeValuation" value={formData.fees.challengeValuation} onChange={handleChange} required />
        </div>
        <button type="submit" className='bg-black p-2 cursor-pointer m-5 text-white'>Add Subject</button>
      </form>
    </div>
  );
}
