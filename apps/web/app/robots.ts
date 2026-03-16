import type { MetadataRoute } from 'next';
import { getSiteRobotsMetadata } from '@/lib/site-metadata';

export default function robots(): MetadataRoute.Robots {
  return getSiteRobotsMetadata();
}
