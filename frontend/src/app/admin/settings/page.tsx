'use client';

import React, { useState } from 'react';
import { Save, Shield, Settings, Mail, Coins } from 'lucide-react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PageHeader from '@/components/admin/shared/PageHeader';
import Button from '@/components/ui/button';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('Behencode Boutique');
  const [supportEmail, setSupportEmail] = useState('support@behencode.co');
  const [currency, setCurrency] = useState('INR');
  const [taxRate, setTaxRate] = useState('0');
  const [newArrivalsLimit, setNewArrivalsLimit] = useState('8');
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success'; text: string } | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLimit = localStorage.getItem('behencode_settings_new_limit');
      const savedName = localStorage.getItem('behencode_settings_store_name');
      const savedEmail = localStorage.getItem('behencode_settings_support_email');
      if (savedLimit) setNewArrivalsLimit(savedLimit);
      if (savedName) setStoreName(savedName);
      if (savedEmail) setSupportEmail(savedEmail);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('behencode_settings_new_limit', newArrivalsLimit);
      localStorage.setItem('behencode_settings_store_name', storeName);
      localStorage.setItem('behencode_settings_support_email', supportEmail);
    }
    setTimeout(() => {
      setSaving(false);
      setAlert({ type: 'success', text: 'CMS configurations saved successfully!' });
      setTimeout(() => setAlert(null), 3000);
    }, 1000);
  };

  return (
    <AdminLayout title="CMS Configuration" subtitle="Fine-tune e-commerce store settings and gateway properties">
      {alert && (
        <div className="fixed bottom-6 right-6 z-50 p-4 border border-green-200 bg-green-50 text-green-700 rounded-2xl flex items-center shadow-lg font-semibold text-xs animate-fadeIn">
          {alert.text}
        </div>
      )}

      <div className="space-y-6 max-w-3xl animate-fadeIn">
        <PageHeader
          title="System Settings"
          description="Adjust billing tax calculations, currency preferences, and storefront parameters"
        />

        <div className="bg-background border border-border-custom/30 p-6 md:p-8 rounded-3xl">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* General section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5 border-b border-border-custom/25 pb-2">
                <Settings size={14} className="text-rose" /> General Storefront Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-3 border border-border-custom bg-cream focus:outline-none focus:border-rose text-foreground text-xs rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
                    Support Contact Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border-custom bg-cream focus:outline-none focus:border-rose text-foreground text-xs rounded-xl"
                      required
                    />
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-brown" />
                  </div>
                </div>

                <div className="space-y-1.5 text-left md:col-span-2">
                  <label className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
                    Homepage New Collection Display Limit (configurable)
                  </label>
                  <input
                    type="number"
                    value={newArrivalsLimit}
                    onChange={(e) => setNewArrivalsLimit(e.target.value)}
                    min="1"
                    max="24"
                    className="w-full px-4 py-3 border border-border-custom bg-cream focus:outline-none focus:border-rose text-foreground text-xs rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial settings */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5 border-b border-border-custom/25 pb-2">
                <Coins size={14} className="text-rose" /> Financial & Billing Properties
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
                    Base Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 border border-border-custom bg-cream focus:outline-none focus:border-rose text-foreground text-xs rounded-xl"
                  >
                    <option value="INR" className="bg-background text-foreground">Indian Rupee (INR)</option>
                    <option value="USD" className="bg-background text-foreground">US Dollar (USD)</option>
                    <option value="EUR" className="bg-background text-foreground">Euro (EUR)</option>
                    <option value="GBP" className="bg-background text-foreground">British Pound (GBP)</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
                    Tax Amount Rate (%)
                  </label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-border-custom bg-cream focus:outline-none focus:border-rose text-foreground text-xs rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security preferences */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5 border-b border-border-custom/25 pb-2">
                <Shield size={14} className="text-rose" /> Backoffice Controls
              </h3>
              
              <div className="p-4 bg-cream/30 border border-border-custom/25 rounded-2xl text-left select-none space-y-2">
                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                  💡 System Integration Alert
                </h4>
                <p className="text-[10px] text-light-brown font-medium leading-relaxed">
                  This console operates under Developer Preview settings. All schema overrides and role checks bypass database flags if the primary MongoDB cluster is offline. Save states propagate to cookies for persistent session fallback behaviors.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border-custom/20">
              <Button
                type="submit"
                variant="primary"
                loading={saving}
                leftIcon={<Save size={14} />}
              >
                SAVE SYSTEM CONFIG
              </Button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
