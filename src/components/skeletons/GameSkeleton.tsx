import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import logoImage from "@/assets/love-triangle-logo.png";

export function GameLoadingSkeleton() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mb-6"
      >
        <img src={logoImage} alt="Love Triangle" className="w-24 h-24 animate-pulse" />
      </motion.div>
      <div className="love-card p-8 max-w-md w-full space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </motion.div>
  );
}

export function QuestionSkeleton() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="love-card p-6 md:p-8 max-w-lg w-full">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-2 w-full rounded-full mb-8" />

        {/* Question */}
        <div className="text-center mb-8">
          <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>

        {/* Button */}
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </motion.div>
  );
}

export function ResultsSkeleton() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="love-card p-8 md:p-10 max-w-lg w-full">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Skeleton className="w-20 h-20 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Score circle */}
        <div className="flex justify-center mb-8">
          <Skeleton className="w-40 h-40 rounded-full" />
        </div>

        {/* Message */}
        <div className="space-y-2 mb-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-full" />
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 flex-1 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CreatorPortalSkeleton() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
