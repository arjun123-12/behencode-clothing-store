'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShippingSchema } from '@/lib/validations';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

interface CheckoutFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ShippingSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'India',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left select-none">
      <h3 className="font-playfair text-base font-bold text-foreground mb-1">
        Shipping Address
      </h3>
      <p className="text-[10px] text-light-brown font-medium uppercase tracking-wider mb-4">
        Where should we send your package?
      </p>

      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Aditi Sharma"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Street Address"
          placeholder="e.g. Flat 302, Phase 2, Royal Heights"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            placeholder="e.g. New Delhi"
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="Postal Code"
            placeholder="e.g. 110001"
            error={errors.postalCode?.message}
            {...register('postalCode')}
          />
        </div>

        <Input
          label="Country"
          placeholder="e.g. India"
          error={errors.country?.message}
          {...register('country')}
        />
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          className="w-full shadow-md"
          loading={loading}
        >
          CONFIRM ADDRESS & CONTINUE
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
