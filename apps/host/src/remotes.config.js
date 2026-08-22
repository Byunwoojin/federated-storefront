const remotes = [
  {
    name: "catalog_remote",
    devUrl: "http://localhost:3003/remoteEntry.js",
    prodUrl: "https://catalog-remote.vercel.app/remoteEntry.js",
  },
  {
    name: "cart_remote",
    devUrl: "http://localhost:3004/remoteEntry.js",
    prodUrl: "https://cart-remote-murex.vercel.app/remoteEntry.js",
  },
  {
    name: "order_remote_remote",
    devUrl: "http://localhost:3005/remoteEntry.js",
    prodUrl: "https://federated-storefront-rsev.vercel.app/remoteEntry.js", // TODO: Vercel 배포 후 실제 URL로 교체
  },
];

module.exports = { remotes };
