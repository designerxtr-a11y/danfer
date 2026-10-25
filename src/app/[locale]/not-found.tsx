import {
  NotFoundContent,
  notFoundMetadata,
} from "@/components/layout/not-found-content";

export const metadata = notFoundMetadata;

export default function NotFound() {
  return <NotFoundContent />;
}
