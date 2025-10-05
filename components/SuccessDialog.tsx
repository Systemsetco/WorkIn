"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./JobSearchDialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedUrl: string;
  filters: {
    keywords: string;
    location: string;
    [key: string]: any;
  };
  getFilterSummary: (filters: any) => string;
}

export function SuccessDialog({
  open,
  onOpenChange,
  generatedUrl,
  filters,
  getFilterSummary,
}: SuccessDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl">Link generated successfully!</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {filters.keywords && filters.location
              ? `${filters.keywords} in ${filters.location}`
              : filters.keywords
              ? filters.keywords
              : "Your job search"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Your LinkedIn Job Search URL</Label>
            <div className="flex gap-2">
              <Input value={generatedUrl} readOnly className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 p-3">
            <p className="text-xs text-green-700 dark:text-green-300">
              {getFilterSummary(filters)}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
              onClick={() => {
                window.open(generatedUrl, "_blank", "noopener,noreferrer");
                onOpenChange(false);
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in LinkedIn
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
