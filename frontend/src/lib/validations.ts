import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const SignupSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const ReviewSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, { message: 'Comment must be at least 5 characters long' }),
});

export const ShippingSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  postalCode: z.string().min(4, { message: 'Valid postal code is required' }),
  country: z.string().min(2, { message: 'Country is required' }),
});
