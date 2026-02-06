import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { Recommendation } from "@/services/calculations";
import { backend } from "@/services/backend";
import { toast } from "@/hooks/use-toast";
import { Brain, Check, X, Loader2, Sparkles, IndianRupee, Zap } from "lucide-react";

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
      // Save to backend with logging
      await backend.saveFeedback(feedbackData);
      addFeedback(feedbackData);

      setShowAdapting(true);

      setTimeout(() => {
        setShowAdapting(false);
        onClose();
        toast({
          title: applied ? "Great choice!" : "Noted",
          description: applied
            ? `We'll track the impact of "${recommendation.title}".`
            : "We'll adjust future recommendations based on your feedback.",
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
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-primary animate-bounce" />
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

            <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium">{recommendation.title}</h4>
                <Badge variant="outline" className="text-xs capitalize">
                  {recommendation.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {recommendation.description}
              </p>
              <div className="flex items-center gap-4 pt-2 border-t">
                <span className="flex items-center gap-1 text-sm text-primary font-medium">
                  <IndianRupee className="h-3 w-3" />
                  {recommendation.estimatedSavings.toFixed(0)}/month
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  {recommendation.estimatedKwhSaved.toFixed(0)} kWh saved
                </span>
              </div>
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

            <p className="text-xs text-center text-muted-foreground">
              Your feedback helps our AI learn and improve recommendations
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
