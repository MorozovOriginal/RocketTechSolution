import { ArrowRight, Mail, Rocket } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { useLanguage } from "./LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    projectDetails: "",
    isUrgent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      toast.error(t('contact.validation.name'));
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error(t('contact.validation.email'));
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const successMessage = formData.isUrgent 
        ? t('contact.success.urgent')
        : t('contact.success.normal');
      toast.success(successMessage);
      setFormData({ fullName: "", email: "", companyName: "", projectDetails: "", isUrgent: false });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white to-[#D2D0F7]/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(4, 7, 37, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(4, 7, 37, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#BBFF2C]/10 border border-[#BBFF2C]/20 mb-4">
            <Rocket className="w-4 h-4 text-[#BBFF2C] mr-2" />
            <span className="text-sm text-[#51508E]">{t('contact.badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#040725] mb-6">
            {t('contact.title-1')}
            <span className="block text-[#51508E]">{t('contact.title-2')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#040725] mb-2">{t('contact.form.title')}</h3>
                  <p className="text-gray-600">{t('contact.form.subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name - Required */}
                  <div>
                    <Label htmlFor="fullName" className="text-[#040725]">
                      {t('contact.form.fullName')} <span className="text-[#FC2D00]">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      placeholder={t('contact.form.fullName.placeholder')}
                      className="bg-[#D2D0F7]/30 border-[#D2D0F7] focus:border-[#BBFF2C] focus:ring-[#BBFF2C] mt-2"
                      required
                    />
                  </div>

                  {/* Email - Required */}
                  <div>
                    <Label htmlFor="email" className="text-[#040725]">
                      {t('contact.form.email')} <span className="text-[#FC2D00]">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder={t('contact.form.email.placeholder')}
                      className="bg-[#D2D0F7]/30 border-[#D2D0F7] focus:border-[#BBFF2C] focus:ring-[#BBFF2C] mt-2"
                      required
                    />
                  </div>

                  {/* Company Name - Optional */}
                  <div>
                    <Label htmlFor="companyName" className="text-[#040725]">
                      {t('contact.form.companyName')}
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      placeholder={t('contact.form.companyName.placeholder')}
                      className="bg-[#D2D0F7]/30 border-[#D2D0F7] focus:border-[#BBFF2C] focus:ring-[#BBFF2C] mt-2"
                    />
                  </div>

                  {/* Project Details - Optional */}
                  <div>
                    <Label htmlFor="projectDetails" className="text-[#040725]">
                      {t('contact.form.projectDetails')}
                    </Label>
                    <Textarea
                      id="projectDetails"
                      value={formData.projectDetails}
                      onChange={(e) => handleChange("projectDetails", e.target.value)}
                      placeholder={t('contact.form.projectDetails.placeholder')}
                      className="bg-[#D2D0F7]/30 border-[#D2D0F7] focus:border-[#BBFF2C] focus:ring-[#BBFF2C] min-h-[100px] resize-none mt-2"
                      rows={4}
                    />
                  </div>

                  {/* Urgent Project Checkbox */}
                  <div className="flex items-center space-x-3 p-4 bg-[#FC2D00]/5 border border-[#FC2D00]/20 rounded-lg">
                    <Checkbox
                      id="isUrgent"
                      checked={formData.isUrgent}
                      onCheckedChange={(checked) => handleChange("isUrgent", checked === true)}
                      className="border-[#FC2D00] data-[state=checked]:bg-[#FC2D00] data-[state=checked]:border-[#FC2D00]"
                    />
                    <div className="flex-1">
                      <Label htmlFor="isUrgent" className="text-[#040725] cursor-pointer">
                        {t('contact.form.urgent')}
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        {t('contact.form.urgent.description')}
                      </p>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024] border-0 group" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                {/* Trust Indicators */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{t('contact.form.security')}</span>
                    <span>{t('contact.form.response')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info & CTA */}
          <div className="space-y-8">
            {/* Special Offer */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-[#040725] via-[#051040] to-[#040725] border border-[#BBFF2C]/15">
              <CardContent className="p-8 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-8">
                  <div className="h-full w-full" style={{
                    backgroundImage: `
                      linear-gradient(rgba(187, 255, 44, 0.08) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(187, 255, 44, 0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
                
                <div className="relative space-y-4">
                  {/* Main Content */}
                  <div className="space-y-3">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold text-[#BBFF2C]/90">15%</span>
                      <span className="text-white/70">OFF</span>
                    </div>
                    <h3 className="text-lg font-bold text-white/90">{t('contact.offer.title')}</h3>
                    <p className="text-gray-300/80 leading-relaxed text-sm">
                      {t('contact.offer.description')} 
                      <span className="text-[#BBFF2C]/80 font-semibold"> {t('contact.offer.noFees')}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training & Consulting */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 hover:border-[#7B93FF]/20 transition-colors">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#7B93FF]/70 rounded-full"></div>
                    <span className="text-sm text-[#7B93FF]/80 font-semibold">{t('contact.training.badge')}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#040725]/90">{t('contact.training.title')}</h3>
                    <p className="text-gray-600/90 leading-relaxed text-sm">
                      {t('contact.training.description')}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="w-1 h-1 bg-[#7B93FF]/60 rounded-full"></div>
                        <span>{t('contact.training.roadmaps')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="w-1 h-1 bg-[#7B93FF]/60 rounded-full"></div>
                        <span>{t('contact.training.ai')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="w-1 h-1 bg-[#7B93FF]/60 rounded-full"></div>
                        <span>{t('contact.training.upskilling')}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#7B93FF]/70 font-medium pt-2">
                      {t('contact.training.cta')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Urgent Project Info */}
            <Card className="bg-gradient-to-br from-[#040725] to-[#051040] border border-[#FC2D00]/10 text-white">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-[#FC2D00]/80 rounded-full animate-pulse"></div>
                    <span className="text-sm text-[#FC2D00]/90">{t('contact.urgent.badge')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white/90">{t('contact.urgent.title')}</h3>
                  <p className="text-gray-300/80 text-sm">
                    {t('contact.urgent.description')}
                  </p>
                  <p className="text-sm text-gray-400/70 italic">
                    {t('contact.urgent.note')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}