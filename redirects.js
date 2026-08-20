const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Preserves inbound links from the legacy site,
  // which used root-level date-based permalinks
  const dateBasedArticleRedirect = {
    source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
    destination: '/articles/:slug',
    permanent: true,
  }

  const redirects = [internetExplorerRedirect, dateBasedArticleRedirect]

  return redirects
}

export default redirects
