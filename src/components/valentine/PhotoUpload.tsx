import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Heart, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PhotoUploadProps {
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
}

export function PhotoUpload({ photo, onPhotoChange }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onPhotoChange(e.target?.result as string);
      toast.success('Photo added! 📸');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        id="photo-upload"
      />

      <AnimatePresence mode="wait">
        {photo ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/30 shadow-lg">
              <img
                src={photo}
                alt="Couple photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Heart decoration */}
            <motion.div
              className="absolute -top-2 -right-2 left-1/2 ml-8"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-6 h-6 text-primary fill-primary" />
            </motion.div>

            {/* Remove button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRemovePhoto}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-primary/30 bg-background hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            htmlFor="photo-upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`block cursor-pointer`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <motion.div
              className={`w-32 h-32 mx-auto rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                isDragging
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-primary/30 hover:border-primary/50 hover:bg-rose-light/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Camera className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-primary/50'}`} />
              <span className="text-xs text-muted-foreground text-center px-2">
                Add photo
              </span>
            </motion.div>
          </motion.label>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground/60 text-center mt-2">
        Optional • Max 5MB
      </p>
    </div>
  );
}
