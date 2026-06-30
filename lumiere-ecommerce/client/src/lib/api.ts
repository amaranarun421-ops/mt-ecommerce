// Smart API client — routes calls to the mock API layer (no backend needed).
// All data persists to localStorage so orders, reviews, addresses, and admin
// changes survive page refreshes. To reset, run `resetMockDB()` from the console.

import { mockApi } from "./mockApi";

const TOKEN_KEY = "lumiere_token";

function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function requireToken(): string {
  const t = getToken();
  if (!t) throw new Error("Authentication required. Please sign in.");
  return t;
}

// Parse a URL path like "/api/products/some-slug?foo=bar" into route + params
function parseUrl(url: string): { path: string; query: URLSearchParams } {
  const [path, queryString] = url.split("?");
  // Strip leading slashes and the /api/ prefix (if present)
  let cleanPath = path.replace(/^\/+/, "");
  if (cleanPath.startsWith("api/")) cleanPath = cleanPath.slice(4);
  return { path: cleanPath, query: new URLSearchParams(queryString || "") };
}

// Main request function — mimics axios's interface (get/post/patch/delete)
// Returns { data: ... } to match the axios response shape used across the app.
async function request(method: string, url: string, config?: any, data?: any): Promise<{ data: any }> {
  // axios signature: get(url, config), post(url, data, config), patch(url, data, config), delete(url, config)
  // Normalize: for POST/PATCH, the 2nd arg is `data`; for GET/DELETE, it's `config`.
  let body: any;
  let params: Record<string, any> = {};
  if (method === "get" || method === "delete") {
    if (config?.params) params = { ...config.params };
  } else {
    body = config; // 2nd arg is the request body
    if (data?.params) params = { ...data.params };
  }

  // Build full URL with query string for parsing
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  const { path } = parseUrl(fullUrl);
  const segments = path.split("/").filter(Boolean);

  try {
    let result: any;
    // ---- AUTH ----
    if (path === "auth/login" && method === "post") result = await mockApi.post_auth_login(body);
    else if (path === "auth/register" && method === "post") result = await mockApi.post_auth_register(body);
    else if (path === "auth/logout" && method === "post") result = await mockApi.post_auth_logout();
    else if (path === "auth/me" && method === "get") result = await mockApi.get_auth_me(requireToken());
    else if (path === "auth/profile" && method === "patch") result = await mockApi.patch_auth_profile(requireToken(), body);
    else if (path === "auth/password" && method === "patch") result = await mockApi.patch_auth_password(requireToken(), body);
    else if (path === "auth/addresses" && method === "post") result = await mockApi.post_auth_addresses(requireToken(), body);
    else if (segments[0] === "auth" && segments[1] === "addresses" && segments[2] && method === "patch") result = await mockApi.patch_auth_addresses(requireToken(), segments[2], body);
    else if (segments[0] === "auth" && segments[1] === "addresses" && segments[2] && method === "delete") result = await mockApi.delete_auth_addresses(requireToken(), segments[2]);
    // ---- PRODUCTS ----
    else if (path === "products" && method === "get") result = await mockApi.get_products(params);
    else if (path === "products/meta/facets" && method === "get") result = await mockApi.get_products_meta_facets();
    else if (segments[0] === "products" && segments[1] && method === "get") result = await mockApi.get_products_slug(segments[1]);
    // ---- CATEGORIES ----
    else if (path === "categories" && method === "get") result = await mockApi.get_categories();
    else if (path === "categories/featured" && method === "get") result = await mockApi.get_categories_featured();
    else if (segments[0] === "categories" && segments[1] && method === "get") result = await mockApi.get_categories_slug(segments[1]);
    // ---- CART ----
    else if (path === "cart/validate" && method === "post") result = await mockApi.post_cart_validate(requireToken(), body);
    // ---- WISHLIST ----
    else if (path === "wishlist" && method === "get") result = await mockApi.get_wishlist(requireToken());
    else if (segments[0] === "wishlist" && segments[1] && method === "post") result = await mockApi.post_wishlist_productId(requireToken(), segments[1]);
    else if (segments[0] === "wishlist" && segments[1] && method === "delete") result = await mockApi.delete_wishlist_productId(requireToken(), segments[1]);
    // ---- CHECKOUT ----
    else if (path === "checkout" && method === "post") result = await mockApi.post_checkout(requireToken(), body);
    else if (path === "checkout/orders" && method === "get") result = await mockApi.get_checkout_orders(requireToken());
    else if (segments[0] === "checkout" && segments[1] === "orders" && segments[2] && segments[3] === "cancel" && method === "post") result = await mockApi.post_checkout_orders_orderNumber_cancel(requireToken(), segments[2]);
    else if (segments[0] === "checkout" && segments[1] === "orders" && segments[2] && method === "get") result = await mockApi.get_checkout_orders_orderNumber(requireToken(), segments[2]);
    // ---- COUPONS ----
    else if (path === "coupons/validate" && method === "post") result = await mockApi.post_coupons_validate(body);
    else if (path === "coupons" && method === "get") result = await mockApi.get_coupons();
    // ---- REVIEWS ----
    else if (segments[0] === "reviews" && segments[1] === "product" && segments[2] && method === "get") result = await mockApi.get_reviews_product_productId(segments[2]);
    else if (path === "reviews" && method === "post") result = await mockApi.post_reviews(requireToken(), body);
    else if (segments[0] === "reviews" && segments[1] && method === "delete") result = await mockApi.delete_reviews_id(requireToken(), segments[1]);
    // ---- NEWSLETTER ----
    else if (path === "newsletter" && method === "post") result = await mockApi.post_newsletter(body);
    else if (path === "newsletter/unsubscribe" && method === "post") result = await mockApi.post_newsletter_unsubscribe(body);
    // ---- CONTACT ----
    else if (path === "contact" && method === "post") result = await mockApi.post_contact(body);
    // ---- SETTINGS (public) ----
    else if (path === "settings" && method === "get") result = await mockApi.get_settings();
    // ---- ADMIN: DASHBOARD ----
    else if (path === "admin/dashboard/stats" && method === "get") result = await mockApi.get_admin_dashboard_stats(requireToken());
    // ---- ADMIN: PRODUCTS ----
    else if (path === "admin/products" && method === "get") result = await mockApi.get_admin_products(requireToken(), params);
    else if (path === "admin/products" && method === "post") result = await mockApi.post_admin_products(requireToken(), body);
    else if (segments[0] === "admin" && segments[1] === "products" && segments[2] && method === "patch") result = await mockApi.patch_admin_products_id(requireToken(), segments[2], body);
    else if (segments[0] === "admin" && segments[1] === "products" && segments[2] && method === "delete") result = await mockApi.delete_admin_products_id(requireToken(), segments[2]);
    // ---- ADMIN: CATEGORIES ----
    else if (path === "admin/categories" && method === "get") result = await mockApi.get_admin_categories(requireToken());
    else if (path === "admin/categories" && method === "post") result = await mockApi.post_admin_categories(requireToken(), body);
    else if (segments[0] === "admin" && segments[1] === "categories" && segments[2] && method === "patch") result = await mockApi.patch_admin_categories_id(requireToken(), segments[2], body);
    else if (segments[0] === "admin" && segments[1] === "categories" && segments[2] && method === "delete") result = await mockApi.delete_admin_categories_id(requireToken(), segments[2]);
    // ---- ADMIN: ORDERS ----
    else if (path === "admin/orders" && method === "get") result = await mockApi.get_admin_orders(requireToken(), params);
    else if (segments[0] === "admin" && segments[1] === "orders" && segments[2] && segments[3] === "status" && method === "patch") result = await mockApi.patch_admin_orders_id_status(requireToken(), segments[2], body);
    else if (segments[0] === "admin" && segments[1] === "orders" && segments[2] && method === "get") result = await mockApi.get_admin_orders_id(requireToken(), segments[2]);
    // ---- ADMIN: COUPONS ----
    else if (path === "admin/coupons" && method === "get") result = await mockApi.get_admin_coupons(requireToken());
    else if (path === "admin/coupons" && method === "post") result = await mockApi.post_admin_coupons(requireToken(), body);
    else if (segments[0] === "admin" && segments[1] === "coupons" && segments[2] && method === "patch") result = await mockApi.patch_admin_coupons_id(requireToken(), segments[2], body);
    else if (segments[0] === "admin" && segments[1] === "coupons" && segments[2] && method === "delete") result = await mockApi.delete_admin_coupons_id(requireToken(), segments[2]);
    // ---- ADMIN: REVIEWS ----
    else if (path === "admin/reviews" && method === "get") result = await mockApi.get_admin_reviews(requireToken(), params);
    else if (segments[0] === "admin" && segments[1] === "reviews" && segments[2] && segments[3] === "status" && method === "patch") result = await mockApi.patch_admin_reviews_id_status(requireToken(), segments[2], body);
    else if (segments[0] === "admin" && segments[1] === "reviews" && segments[2] && method === "delete") result = await mockApi.delete_admin_reviews_id(requireToken(), segments[2]);
    // ---- ADMIN: CUSTOMERS ----
    else if (path === "admin/customers" && method === "get") result = await mockApi.get_admin_customers(requireToken(), params);
    else if (segments[0] === "admin" && segments[1] === "customers" && segments[2] && segments[3] === "ban" && method === "patch") result = await mockApi.patch_admin_customers_id_ban(requireToken(), segments[2], body);
    else if (segments[0] === "admin" && segments[1] === "customers" && segments[2] && method === "get") result = await mockApi.get_admin_customers_id(requireToken(), segments[2]);
    // ---- ADMIN: STORE ----
    else if (path === "admin/store/messages" && method === "get") result = await mockApi.get_admin_store_messages(requireToken(), params);
    else if (segments[0] === "admin" && segments[1] === "store" && segments[2] === "messages" && segments[3] && method === "patch") result = await mockApi.patch_admin_store_messages_id(requireToken(), segments[3], body);
    else if (segments[0] === "admin" && segments[1] === "store" && segments[2] === "messages" && segments[3] && method === "delete") result = await mockApi.delete_admin_store_messages_id(requireToken(), segments[3]);
    else if (path === "admin/store/subscribers" && method === "get") result = await mockApi.get_admin_store_subscribers(requireToken(), params);
    else if (segments[0] === "admin" && segments[1] === "store" && segments[2] === "subscribers" && segments[3] && method === "delete") result = await mockApi.delete_admin_store_subscribers_id(requireToken(), segments[3]);
    else if (path === "admin/store/inventory" && method === "get") result = await mockApi.get_admin_store_inventory(requireToken(), params);
    else if (segments[0] === "admin" && segments[1] === "store" && segments[2] === "inventory" && segments[3] && method === "patch") result = await mockApi.patch_admin_store_inventory_id(requireToken(), segments[3], body);
    else if (path === "admin/store/settings" && method === "get") result = await mockApi.get_admin_store_settings(requireToken());
    else if (path === "admin/store/settings" && method === "patch") result = await mockApi.patch_admin_store_settings(requireToken(), body);
    else throw new Error(`Unhandled API route: ${method.toUpperCase()} /api/${path}`);

    return { data: result };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Network error.");
  }
}

// Mimic the axios instance interface used throughout the app.
// axios.get(url, config), axios.post(url, data, config), axios.patch(url, data, config), axios.delete(url, config)
export const api = {
  get: (url: string, config?: any) => request("get", url, config),
  post: (url: string, data?: any, config?: any) => request("post", url, data, config),
  patch: (url: string, data?: any, config?: any) => request("patch", url, data, config),
  delete: (url: string, config?: any) => request("delete", url, config),
};

export function isAuthError(err: unknown): boolean {
  return err instanceof Error && /authentication|sign in|session expired|account unavailable|admin access/i.test(err.message);
}
