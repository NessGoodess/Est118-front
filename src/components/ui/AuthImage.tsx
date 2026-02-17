'use client';

import Image, { ImageProps } from 'next/image';

/**
 * Imagen que carga desde la API con autenticación (cookies).
 * Usa unoptimized para que el navegador haga la petición y envíe las cookies (auth:sanctum).
 * Úsalo para src que apunten a /private-image/* del backend.
 */
export function AuthImage(props: ImageProps) {
  const { alt, ...rest } = props;
  return <Image alt={alt || ""} {...rest} unoptimized />;
}
