// Type definitions for Next.js routes

/**
 * Internal types used by the Next.js router and Link component.
 * These types are not meant to be used directly.
 * @internal
 */
declare namespace __next_route_internal_types__ {
  type SearchOrHash = `?${string}` | `#${string}`
  type WithProtocol = `${string}:${string}`

  type Suffix = '' | SearchOrHash

  type SafeSlug<S extends string> = S extends `${string}/${string}`
    ? never
    : S extends `${string}${SearchOrHash}`
    ? never
    : S extends ''
    ? never
    : S

  type CatchAllSlug<S extends string> = S extends `${string}${SearchOrHash}`
    ? never
    : S extends ''
    ? never
    : S

  type OptionalCatchAllSlug<S extends string> =
    S extends `${string}${SearchOrHash}` ? never : S

  type StaticRoutes = 
    | `/`
    | `/pt-pt`
    | `/pt-pt/brl-para-eur`
    | `/pt-pt/eur-para-brl`
    | `/api/contact`
    | `/termos`
    | `/api/rate`
    | `/api/history`
    | `/cookies`
    | `/contactos`
    | `/privacidade`
    | `/responsabilidade`
    | `/pt-br`
    | `/pt-br/brl-para-eur`
    | `/pt-br/eur-para-brl`
    | `/pt-pt/eur-para-brl`
    | `/pt-pt/brl-para-eur`
    | `/pt-br/eur-para-brl`
    | `/pt-br/brl-para-eur`
    | `/pt-pt/privacidade`
    | `/pt-pt/cookies`
    | `/pt-pt/termos`
    | `/pt-br/privacidade`
    | `/pt-br/cookies`
    | `/pt-br/termos`
  type DynamicRoutes<T extends string = string> = 
    | `/pt-pt/brl-para-eur/${SafeSlug<T>}`
    | `/pt-pt/eur-para-brl/${SafeSlug<T>}`
    | `/pt-pt/euros-em-reais/${SafeSlug<T>}`
    | `/pt-pt/reais-em-euros/${SafeSlug<T>}`
    | `/pt-br/brl-para-eur/${SafeSlug<T>}`
    | `/pt-br/euros-em-reais/${SafeSlug<T>}`
    | `/pt-br/eur-para-brl/${SafeSlug<T>}`
    | `/pt-br/reais-em-euros/${SafeSlug<T>}`
    | `/pt-pt/pt-pt/${OptionalCatchAllSlug<T>}`
    | `/pt-br/pt-br/${OptionalCatchAllSlug<T>}`
    | `/pt-pt/eur-para-brl/${SafeSlug<T>}`
    | `/pt-pt/brl-para-eur/${SafeSlug<T>}`
    | `/pt-br/eur-para-brl/${SafeSlug<T>}`
    | `/pt-br/brl-para-eur/${SafeSlug<T>}`
    | `/eur-para-brl/${SafeSlug<T>}`
    | `/brl-para-eur/${SafeSlug<T>}`

  type RouteImpl<T> = 
    | StaticRoutes
    | SearchOrHash
    | WithProtocol
    | `${StaticRoutes}${SearchOrHash}`
    | (T extends `${DynamicRoutes<infer _>}${Suffix}` ? T : never)
    
}

declare module 'next' {
  export { default } from 'next/types/index.js'
  export * from 'next/types/index.js'

  export type Route<T extends string = string> =
    __next_route_internal_types__.RouteImpl<T>
}

declare module 'next/link' {
  import type { LinkProps as OriginalLinkProps } from 'next/dist/client/link.js'
  import type { AnchorHTMLAttributes, DetailedHTMLProps } from 'react'
  import type { UrlObject } from 'url'

  type LinkRestProps = Omit<
    Omit<
      DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >,
      keyof OriginalLinkProps
    > &
      OriginalLinkProps,
    'href'
  >

  export type LinkProps<RouteInferType> = LinkRestProps & {
    /**
     * The path or URL to navigate to. This is the only required prop. It can also be an object.
     * @see https://nextjs.org/docs/api-reference/next/link
     */
    href: __next_route_internal_types__.RouteImpl<RouteInferType> | UrlObject
  }

  export default function Link<RouteType>(props: LinkProps<RouteType>): JSX.Element
}

declare module 'next/navigation' {
  export * from 'next/dist/client/components/navigation.js'

  import type { NavigateOptions, AppRouterInstance as OriginalAppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime.js'
  interface AppRouterInstance extends OriginalAppRouterInstance {
    /**
     * Navigate to the provided href.
     * Pushes a new history entry.
     */
    push<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>, options?: NavigateOptions): void
    /**
     * Navigate to the provided href.
     * Replaces the current history entry.
     */
    replace<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>, options?: NavigateOptions): void
    /**
     * Prefetch the provided href.
     */
    prefetch<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>): void
  }

  export declare function useRouter(): AppRouterInstance;
}
