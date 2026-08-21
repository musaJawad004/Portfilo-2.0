import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "../../ServiceDetail";
import { getService, services } from "../../serviceData";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return {};

  const favicon = `${service.favicon}?v=3`;
  const pageTitle = `Muhammad Musa - ${service.title}`;

  return {
    title: { absolute: pageTitle },
    description: service.description,
    icons: {
      icon: [{ url: favicon, type: "image/svg+xml", sizes: "any" }],
      shortcut: [{ url: favicon, type: "image/svg+xml" }],
      apple: [{ url: favicon, type: "image/svg+xml" }],
    },
    openGraph: {
      title: pageTitle,
      description: service.description,
      images: [],
    },
    twitter: {
      title: pageTitle,
      description: service.description,
      images: [],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  return <ServiceDetail service={service} />;
}
