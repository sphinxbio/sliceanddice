import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_USE_POSTHOG, PUBLIC_POSTHOG_API, PUBLIC_POSTHOG_URL } from '$env/static/public';

export const load = async () => {
  if (browser && PUBLIC_USE_POSTHOG === 'true') {
    posthog.init(
      PUBLIC_POSTHOG_API,
      { api_host: PUBLIC_POSTHOG_URL }
    );
  }
};