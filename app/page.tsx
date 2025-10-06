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
  RefreshCw,
  Mail,
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
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg rounded-full shadow-lg border border-gray-200/50 dark:border-neutral-800/50 w-[calc(100%-2rem)] max-w-4xl mx-auto transition-all duration-200 hover:shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-5">
          <div className="flex items-center justify-between h-16 sm:h-14">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
                aria-label="WorkIn Home"
              >
                <div className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-1">
                  <img 
                    src="/workin.png" 
                    alt="WorkIn Logo" 
                    className="h-full w-full object-contain transition-transform group-hover:scale-105" 
                  />
                </div>
                <span className="text-lg sm:text-xl font-semibold text-foreground">
                  WorkIn
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Link
                href="#home"
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50"
              >
                Home
              </Link>
              <Link
                href="#about"
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50"
              >
                About
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-foreground/80 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-full"
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

      <section id="home" className="pt-28 pb-16 sm:pt-36">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-5 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200/80 bg-green-50/80 dark:border-green-900/50 dark:bg-green-950/80 px-3 py-1.5 text-xs sm:text-sm text-green-700 dark:text-green-300 backdrop-blur-sm">
              <Shield className="h-3 w-3" />
              <span>Open Source & Safe</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
              WorkIn
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium">
              Work in smarter, not later
            </p>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2 leading-relaxed">
              Generate custom LinkedIn job search URLs with advanced filters. Fast, secure, and
              completely client-side. No data collection, ever.
            </p>

            <div className="flex flex-wrap justify-center gap-2 pt-2 sm:pt-4">
              <div className="flex items-center gap-1.5 rounded-full bg-green-100/80 dark:bg-green-950/80 px-2.5 py-1 text-xs text-green-700 dark:text-green-300 backdrop-blur-sm">
                <Zap className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-green-100/80 dark:bg-green-950/80 px-2.5 py-1 text-xs text-green-700 dark:text-green-300 backdrop-blur-sm">
                <Shield className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                <span>100% Safe</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-green-100/80 dark:bg-green-950/80 px-2.5 py-1 text-xs text-green-700 dark:text-green-300 backdrop-blur-sm">
                <Github className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
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
            <Card className="border-border/50 shadow-lg w-full max-w-4xl mx-auto bg-background/50 rounded-2xl backdrop-blur-sm">
              <CardHeader className="space-y-2 px-5 sm:px-8 pt-8 pb-3">
                <CardTitle className="text-xl sm:text-2xl font-semibold">Build Your Search</CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground">
                  Select your preferences to generate a LinkedIn job search link
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-5 sm:px-8 pb-8">
                <div className="grid gap-2.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="keywords" className="text-sm sm:text-base font-medium">
                      Job Title <span className="text-destructive">*</span>
                    </Label>
                  </div>
                  <Input
                    id="keywords"
                    placeholder="e.g. Software Engineer"
                    value={filters.keywords}
                    onChange={(e) => updateFilter("keywords", e.target.value)}
                    className={`text-sm sm:text-base h-11 ${error ? "border-destructive" : ""}`}
                  />
                  {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
                </div>

                <div className="grid gap-2.5">
                  <Label htmlFor="location" className="text-sm sm:text-base font-medium">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. San Francisco, California"
                    value={filters.location}
                    onChange={(e) => updateFilter("location", e.target.value)}
                    className="text-sm sm:text-base h-11"
                  />
                </div>

                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <div className="grid gap-2.5">
                    <Label htmlFor="job-type" className="text-xs sm:text-sm">Job Type</Label>
                    <Select
                      value={filters.f_WT?.toString() || "any"}
                      onValueChange={(value) =>
                        updateFilter("f_WT", value === "any" ? undefined : parseInt(value))
                      }
                    >
                      <SelectTrigger id="job-type" className="text-xs sm:text-sm h-9 sm:h-10">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="text-xs sm:text-sm">
                        <SelectItem value="any" className="text-xs sm:text-sm">Any</SelectItem>
                        {Object.values(JOB_TYPES).map((type) => (
                          <SelectItem 
                            key={type.value} 
                            value={type.value.toString()}
                            className="text-xs sm:text-sm"
                          >
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2.5">
                    <Label htmlFor="work-mode" className="text-xs sm:text-sm">Work Mode</Label>
                    <Select
                      value={filters.f_WRA?.toString() || "any"}
                      onValueChange={(value) =>
                        updateFilter("f_WRA", value === "any" ? undefined : parseInt(value))
                      }
                    >
                      <SelectTrigger id="work-mode" className="text-xs sm:text-sm h-9 sm:h-10">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="text-xs sm:text-sm">
                        <SelectItem value="any" className="text-xs sm:text-sm">Any</SelectItem>
                        {Object.values(WORK_MODES).map((mode) => (
                          <SelectItem 
                            key={mode.value} 
                            value={mode.value.toString()}
                            className="text-xs sm:text-sm"
                          >
                            {mode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2.5">
                    <Label htmlFor="experience" className="text-xs sm:text-sm">Experience Level</Label>
                    <Select
                      value={filters.f_E?.toString() || "any"}
                      onValueChange={(value) =>
                        updateFilter("f_E", value === "any" ? undefined : parseInt(value))
                      }
                    >
                      <SelectTrigger id="experience" className="text-xs sm:text-sm h-9 sm:h-10">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="text-xs sm:text-sm">
                        <SelectItem value="any" className="text-xs sm:text-sm">Any</SelectItem>
                        {Object.values(EXPERIENCE_LEVELS).map((level) => (
                          <SelectItem 
                            key={level.value} 
                            value={level.value.toString()}
                            className="text-xs sm:text-sm"
                          >
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2.5">
                    <Label htmlFor="sort-by" className="text-xs sm:text-sm">Sort By</Label>
                    <Select
                      value={filters.sortBy || "DD"}
                      onValueChange={(value) => updateFilter("sortBy", value)}
                    >
                      <SelectTrigger id="sort-by" className="text-xs sm:text-sm h-9 sm:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="text-xs sm:text-sm">
                        {Object.values(SORT_OPTIONS).map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="text-xs sm:text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label className="text-xs sm:text-sm">Date Posted</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!filters.f_TPR ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-8 px-2 sm:px-3"
                      onClick={() => updateFilter("f_TPR", undefined)}
                    >
                      Any time
                    </Button>
                    {TIME_PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        variant={filters.f_TPR === preset.seconds ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-8 px-2 sm:px-3"
                        onClick={() => updateFilter("f_TPR", preset.seconds)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>


                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 h-12 text-base font-medium rounded-lg"
                    onClick={handleGenerate}
                    disabled={!filters.keywords.trim()}
                  >
                    Generate Link
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-12 w-12 rounded-lg border-border/50 hover:bg-green/50 group"
                    onClick={handleClear}
                    aria-label="Clear form"
                    title="Reset form"
                  >
                    <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section id="about" className="py-16 bg-gray-50 dark:bg-neutral-900/30">
        <div className="max-w-4xl mx-auto space-y-8 px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">About WorkIn</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              A powerful tool to create custom LinkedIn job search URLs with advanced filters. 
              Completely client-side, private, and open source.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline" className="gap-2">
                <Link
                  href="mailto:systemset.co@gmail.com?subject=WorkIn%20Feedback%20or%20Bug%20Report&body=Hi%20Systemset%20Team,%0D%0A%0D%0AI%20wanted%20to%20share%20some%20feedback%20or%20report%20an%20issue%20with%20WorkIn.%0D%0A%0D%0A(Please%20describe%20your%20issue%20or%20suggestion%20below)%3A%0D%0A"
                  className="no-underline"
                >
                  <Mail className="h-5 w-5 text-gray-600" />
                  <span>Send Feedback</span>
                </Link>
              </Button>
              <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
                <Link 
                  href="https://github.com/Systemsetco/WorkIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <Github className="h-4 w-4" />
                  <span>View on GitHub</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 sm:py-10 px-4 bg-background/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <div className="text-sm text-muted-foreground">
              © 2025 WorkIn. Open source and free forever.
            </div>
            <div className="flex flex-wrap justify-center items-center gap-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/50 rounded-full">
                <Shield className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs">Client-side only</span>
              </div>
              <div className="hidden sm:block text-muted-foreground/50">•</div>
              <div className="text-xs text-muted-foreground/80">
                Not affiliated with LinkedIn
              </div>
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
