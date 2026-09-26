function requireApiUrl(name: string, value: string | undefined): string {
  const url = value?.trim();

  if (!url) {
    throw new Error(
      `${name} is not set. Define it in your environment before making API requests.`,
    );
  }

  return url.replace(/\/+$/, "");
}

export function getServerApiUrl(): string {
  return requireApiUrl("API_URL", process.env.API_URL);
}
