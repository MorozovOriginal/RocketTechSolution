import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Rocket, X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useLanguage } from "./LanguageContext";

interface ProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectRequestModal({ isOpen, onClose }: ProjectRequestModalProps) {
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
      toast.error(t('modal.validation.name'));
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error(t('modal.validation.email'));
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const successMessage = formData.isUrgent 
        ? t('modal.success.urgent')
        : t('modal.success.normal');
      toast.success(successMessage);
      setFormData({ fullName: "", email: "", companyName: "", projectDetails: "", isUrgent: false });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#BBFF2C] rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-[#040725]" />
              </div>
              <DialogTitle className="text-xl text-[#040725]">
                {t('modal.title')}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            {t('modal.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Full Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-[#040725]">
              {t('modal.fullName')} <span className="text-[#FC2D00]">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder={t('modal.fullName.placeholder')}
              className="bg-[#D2D0F7]/30 border-[#D2D0F7] focus:border-[#BBFF2C] focus:ring-[#BBFF2C]"
              required
            />
          </div>

          {/* Email - Required */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#040725]">
              {t('modal.email')} <span className="text-[#FC2D00]">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={t('modal.email.placeholder')}
              className="bg-[#D2D0F7]/30 border-[#D2D0F7] focus:border-[#BBFF2C] focus:ring-[#BBFF2C]"
              required
            />
          </div>

          {/* Company Name - Optional */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-[#040725]">
              {t('modal.companyName')}
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder={t('modal.companyName.placeholder')}
              className="bg-[#D2D0F7]/30 border-[#D2D0F7] focus:border-[#BBFF2C] focus:ring-[#BBFF2C]"
            />
          </div>

          {/* Project Details - Optional */}
          <div className="space-y-2">
            <Label htmlFor="projectDetails" className="text-[#040725]">
              {t('modal.projectDetails')}
            </Label>
            <Textarea
              id="projectDetails"
              value={formData.projectDetails}
              onChange={(e) => handleChange("projectDetails", e.target.value)}
              placeholder={t('modal.projectDetails.placeholder')}
              className="bg-[#D2D0F7]/30 border-[#D2D0F7] focus:border-[#BBFF2C] focus:ring-[#BBFF2C] min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          {/* Urgent Project Checkbox */}
          <div className="flex items-center space-x-3 p-3 bg-[#FC2D00]/5 border border-[#FC2D00]/20 rounded-lg">
            <Checkbox
              id="isUrgent"
              checked={formData.isUrgent}
              onCheckedChange={(checked) => handleChange("isUrgent", checked === true)}
              className="border-[#FC2D00] data-[state=checked]:bg-[#FC2D00] data-[state=checked]:border-[#FC2D00]"
            />
            <div className="flex-1">
              <Label htmlFor="isUrgent" className="text-[#040725] cursor-pointer text-sm">
                {t('modal.isUrgent')}
              </Label>
              <p className="text-xs text-gray-600 mt-0.5">
                {t('modal.isUrgent.description')}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#D2D0F7] text-[#51508E] hover:bg-[#D2D0F7]"
              disabled={isSubmitting}
            >
              {t('modal.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024] border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('modal.submitting') : t('modal.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}