// this page serves on localhost:3000/demo
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Demo page showing two API interactions: a blocking POST and a background-job POST, each with independent loading states.
 *
 * Renders two large Buttons that trigger POST requests to /api/demo/blocking and /api/demo/background-jobs; each button disables and shows "Loading..." while its request is in flight.
 *
 * @returns The React element for the demo page.
 */
export default function DemoPage() {
  // this useState is just for demo purpose to show loading state of API calls, you can remove it in your actual implementation
  const [ loading, setLoading ] = useState(false);
  const [ loading2, setLoading2 ] = useState(false);

  // demo working of blocking API route (It blocks user to do anything until it gets response from API)
  const handleBlocking = async () => {
    setLoading(true);
    await fetch('/api/demo/blocking', {
      method: 'POST',
    });
    setLoading(false);
  };

  // demo working of background jobs with inngest
  const handleBackground = async () => {
    setLoading2(true);
    await fetch('/api/demo/background-jobs', {
      method: 'POST',
    });
    setLoading2(false);
  };

  return (
    <div className="p-8 space-x-4">
      <Button onClick={handleBlocking} size="lg" disabled={loading}>
        {loading ? 'Loading...' : 'Run blocking API'}
      </Button>
      <Button onClick={handleBackground} size="lg" disabled={loading2}>
        {loading2 ? 'Loading...' : 'Run background job API'}
      </Button>
    </div>
  );
};