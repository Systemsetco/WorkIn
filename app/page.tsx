"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Dynamically import Dialog components with SSR disabled
const JobSearchDialog = dynamic(
  () => import('@/components/JobSearchDialog').then((mod) => mod.JobSearchDialog),
  { ssr: false }
);

const SuccessDialog = dynamic(
  () => import('@/components/SuccessDialog').then((mod) => mod.SuccessDialog),
  { ssr: false }
);

import {
  buildLinkedInJobURL,
  validateFilters,
  getFilterSummary,
  JOB_TYPES,
  WORK_MODES,
  EXPERIENCE_LEVELS,
  SORT_OPTIONS,
  TIME_PRESETS,
  type JobFilters,
} from "@/lib/linkedin-url-builder";
import {
  Copy,
  ExternalLink,
  X,
  Check,
  Github,
  Shield,
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  // Use the imported JobFilters type from linkedin-url-builder
  const [filters, setFilters] = useState<JobFilters>({
    keywords: "",
    location: "",
    f_TPR: 86400,
    f_WT: undefined,
    f_WRA: undefined,
    f_E: undefined,
    sortBy: "DD",
  });

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false when component mounts
    setIsLoading(false);
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (showModal && generatedUrl) {
        e.preventDefault();
        e.returnValue = "Are you sure? Changes may not be saved.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [showModal, generatedUrl]);

  const handleGenerate = () => {
    setError("");
    setGeneratedUrl("");

    const validation = validateFilters(filters);

    if (!validation.isValid) {
      setError(validation.error || "Invalid filters");
      return;
    }

    try {
      const url = buildLinkedInJobURL(filters);
      setGeneratedUrl(url);
      setShowModal(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    }
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;

    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The job search URL has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setFilters({
      keywords: "",
      location: "",
      f_TPR: 86400,
      f_WT: undefined,
      f_WRA: undefined,
      f_E: undefined,
      sortBy: "DD",
    });
    setGeneratedUrl("");
    setError("");
  };

  const updateFilter = (key: keyof JobFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="backdrop-blur-lg bg-background/80 border border-border rounded-full shadow-lg px-6 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition-opacity"
            >
              <img src="/workin.png" alt="WorkIn Logo" className="h-6 w-6" />
              <span>WorkIn</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="#home"
                className="text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="#about"
                className="text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                About
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 px-3 py-1 text-sm text-green-700 dark:text-green-300">
              <Shield className="h-3 w-3" />
              <span>Open Source & Safe</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">WorkIn</h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Work in smarter, not later
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Generate custom LinkedIn job search URLs with advanced filters. Fast, secure, and
              completely client-side. No data collection, ever.
            </p>

            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <div className="flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-950 px-3 py-1 text-sm text-green-700 dark:text-green-300">
                <Zap className="h-3 w-3 text-green-600 dark:text-green-400" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-950 px-3 py-1 text-sm text-green-700 dark:text-green-300">
                <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
                <span>100% Safe</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-950 px-3 py-1 text-sm text-green-700 dark:text-green-300">
                <Github className="h-3 w-3 text-green-600 dark:text-green-400" />
                <span>Open Source</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Build your search</CardTitle>
                <CardDescription>
                  Select your preferences to generate a LinkedIn job search link
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="keywords">
                    Job Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="keywords"
                    placeholder="e.g. Software Engineer"
                    value={filters.keywords}
                    onChange={(e) => updateFilter("keywords", e.target.value)}
                    className={error ? "border-destructive" : ""}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. San Francisco, California"
                    value={filters.location}
                    onChange={(e) => updateFilter("location", e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="job-type">Job Type</Label>
                    <Select
                      value={filters.f_WT?.toString() || "any"}
                      onValueChange={(value) =>
                        updateFilter("f_WT", value === "any" ? undefined : parseInt(value))
                      }
                    >
                      <SelectTrigger id="job-type">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {Object.values(JOB_TYPES).map((type) => (
                          <SelectItem key={type.value} value={type.value.toString()}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="work-mode">Work Mode</Label>
                    <Select
                      value={filters.f_WRA?.toString() || "any"}
                      onValueChange={(value) =>
                        updateFilter("f_WRA", value === "any" ? undefined : parseInt(value))
                      }
                    >
                      <SelectTrigger id="work-mode">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {Object.values(WORK_MODES).map((mode) => (
                          <SelectItem key={mode.value} value={mode.value.toString()}>
                            {mode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select
                      value={filters.f_E?.toString() || "any"}
                      onValueChange={(value) =>
                        updateFilter("f_E", value === "any" ? undefined : parseInt(value))
                      }
                    >
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {Object.values(EXPERIENCE_LEVELS).map((level) => (
                          <SelectItem key={level.value} value={level.value.toString()}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="sort-by">Sort By</Label>
                    <Select
                      value={filters.sortBy || "DD"}
                      onValueChange={(value) => updateFilter("sortBy", value)}
                    >
                      <SelectTrigger id="sort-by">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SORT_OPTIONS).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Date Posted</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!filters.f_TPR ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter("f_TPR", undefined)}
                    >
                      Any time
                    </Button>
                    {TIME_PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        variant={filters.f_TPR === preset.seconds ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter("f_TPR", preset.seconds)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>


                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1"
                    onClick={handleGenerate}
                    disabled={!filters.keywords.trim()}
                  >
                    Generate Link
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section id="about" className="py-16 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">About WorkIn</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              WorkIn is an open-source tool designed to help job seekers create customized
              LinkedIn job search URLs. All processing happens on your device—no servers, no
              tracking, no data collection.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link
                href="https://github.com"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 WorkIn. Open source and free forever.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Client-side only
              </span>
              <span>•</span>
              <span>Not affiliated with LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <SuccessDialog
          open={showModal}
          onOpenChange={setShowModal}
          generatedUrl={generatedUrl}
          filters={{
            ...filters,
            location: filters.location || ''
          }}
          getFilterSummary={getFilterSummary}
        />
      </Suspense>
    </div>
  );
}
