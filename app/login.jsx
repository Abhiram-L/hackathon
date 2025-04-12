import React, { useState } from 'react';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().nonempty({ message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().nonempty({ message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [submitted, setSubmitted] = useState(false);
    // login bacckend request 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            // Validate form data with Zod
            loginSchema.parse(formData);
            setSubmitted(true);
            // Proceed with login logic (e.g., API call)
            console.log("Login successful with:", formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors({
                    email: fieldErrors.email ? fieldErrors.email[0] : '',
                    password: fieldErrors.password ? fieldErrors.password[0] : ''
                });
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
            <h2>Login</h2>
            {submitted && <p style={{ color: 'green' }}>Form submitted successfully!</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                    />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                    />
                    {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
                </div>
                <button type="submit" style={{ padding: '0.5rem 1rem' }}>Login</button>
            </form>
        </div>
    );
}