import dns from 'dns';
import axios from 'axios';
import { URL } from 'url';

// Validate URL structure and resolve it
export async function validateUrl(inputUrl: string): Promise<void> {
    try {
        // Check if URL is well-formed
        const parsedUrl = new URL(inputUrl);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new Error("Unsupported protocol. Only HTTP and HTTPS are allowed.");
        }

        // Optional: DNS resolution to verify domain exists
        await new Promise((resolve, reject) => {
            dns.lookup(parsedUrl.hostname, (err) => {
                if (err) {
                    reject(new Error("Domain does not exist or is unreachable."));
                } else {
                    resolve(true);
                }
            });
        });

        // Optional: Make a HEAD request to check URL accessibility
        await axios.head(inputUrl, { timeout: 3000 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        throw new Error(`Invalid URL: ${errorMessage}`);
    }
}