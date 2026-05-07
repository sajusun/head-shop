import api from './api';
import API_CONFIG from '../config/api';
import { mockProducts } from '../mock/products';

const getCategoryName = (product) => product.category?.name || product.category || 'Uncategorized';
const getCategorySlug = (product) => product.category?.slug || getCategoryName(product).toLowerCase().replace(/\s+/g, '-');
const getEffectivePrice = (product) => Number(product.offer_price ?? product.offerPrice ?? product.price ?? 0);

const productService = {
  getAll: async (params = {}) => {
    const {
      page = 1,
      per_page = 24,
      search = '',
      category = '',
      sort = 'latest',
    } = params;

    if (!API_CONFIG.USE_API) {
      return new Promise((resolve) => {
        let filteredProducts = [...mockProducts];
        const query = search.trim().toLowerCase();

        if (query) {
          filteredProducts = filteredProducts.filter((product) => {
            const categoryName = getCategoryName(product).toLowerCase();

            return (
              product.name.toLowerCase().includes(query) ||
              product.description?.toLowerCase().includes(query) ||
              categoryName.includes(query)
            );
          });
        }

        if (category) {
          filteredProducts = filteredProducts.filter((product) => getCategorySlug(product) === category);
        }

        if (sort === 'price_low') {
          filteredProducts.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        }

        if (sort === 'price_high') {
          filteredProducts.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        }

        const currentPage = Math.max(Number(page) || 1, 1);
        const perPage = Math.max(Number(per_page) || 24, 1);
        const total = filteredProducts.length;
        const lastPage = Math.max(Math.ceil(total / perPage), 1);
        const safePage = Math.min(currentPage, lastPage);
        const startIndex = (safePage - 1) * perPage;
        const data = filteredProducts.slice(startIndex, startIndex + perPage);

        setTimeout(() => resolve({
          data: {
            data,
            pagination: {
              current_page: safePage,
              last_page: lastPage,
              per_page: perPage,
              total,
              from: total ? startIndex + 1 : null,
              to: total ? startIndex + data.length : null,
            },
          },
        }), 500);
      });
    }

    return api.get(API_CONFIG.ENDPOINTS.PRODUCTS, {
      params: {
        page,
        current_page: page,
        per_page,
        search: search || undefined,
        category: category || undefined,
        sort,
      },
    });
  },

  getById: async (id) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve, reject) => {
        const product = mockProducts.find(p => p.id === id);
        setTimeout(() => {
          if (product) resolve({ data: product });
          else reject(new Error('Product not found'));
        }, 500);
      });
    }
    return api.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
  },

  getBySlug: async (slug) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve, reject) => {
        const product = mockProducts.find(p => p.slug === slug);
        setTimeout(() => {
          if (product) resolve({ data: product });
          else reject(new Error('Product not found'));
        }, 500);
      });
    }
    return api.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${slug}`);
  }
};

export default productService;
