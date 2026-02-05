import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Recommendation } from "@/services/calculations";
import { mockApi } from "@/services/mockApi";
import { toast } from "@/hooks/use-toast";
import { Brain, Check, X, Loader2 } from "lucide-react";

interface FeedbackPopupProps {
  open: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
}

export function FeedbackPopup({ open, onClose, recommendation }: FeedbackPopupProps) {
  const { addFeedback } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdapting, setShowAdapting] = useState(false);

  const handleFeedback = async (applied: boolean) => {
    if (!recommendation) return;

    setIsSubmitting(true);

    const feedbackData = {
      recommendationId: recommendation.id,
      applied,
      timestamp: new Date().toISOString(),
    };

    try {
      await mockApi.submitFeedback(feedbackData);
      addFeedback(feedbackData);

      setShowAdapting(true);

      setTimeout(() => {
        setShowAdapting(false);
        onClose();
        toast({
          title: applied ? "Great choice!" : "Noted",
          description: applied
            ? "We'll track the impact of this recommendation."
            : "We'll adapt future recommendations based on your feedback.",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!recommendation) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {showAdapting ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center animate-pulse">
                <Brain className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-full gradient-primary blur-xl opacity-50 animate-pulse" />
            </div>
            <p className="mt-4 text-lg font-medium">System adapting...</p>
            <p className="text-sm text-muted-foreground">
              Learning from your feedback
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Recommendation Feedback
              </DialogTitle>
              <DialogDescription>
                Did you apply this recommendation?
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="font-medium mb-1">{recommendation.title}</h4>
              <p className="text-sm text-muted-foreground">
                {recommendation.description}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => handleFeedback(true)}
                disabled={isSubmitting}
                className="flex-1 gradient-primary border-0"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Yes, I applied it
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleFeedback(false)}
                disabled={isSubmitting}
                variant="outline"
                className="flex-1"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Not yet
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
