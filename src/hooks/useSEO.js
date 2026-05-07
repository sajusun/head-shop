import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useSEO = (pageTitle, description) => {
  const { data: settings } = useSelector(state => state.settings);
  
  useEffect(() => {
    // Update Title
    const siteTitle = settings?.site_title || 'HERD SHOP';
    document.title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;

    // Update Meta Description
    const metaDescription = description || settings?.seo_description;
    if (metaDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = metaDescription;
    }

    // Update Keywords
    const keywords = settings?.seo_keywords;
    if (keywords) {
      let meta = document.querySelector('meta[name="keywords"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'keywords';
        document.head.appendChild(meta);
      }
      meta.content = keywords;
    }

    // Update Favicon if provided in settings
    if (settings?.site_favicon) {
      let link = document.querySelector('link[rel~="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.site_favicon;
    }
  }, [pageTitle, description, settings]);
};
