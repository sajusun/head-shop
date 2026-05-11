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

    // Inject Header Scripts
    if (settings?.seo_header_scripts) {
      const headerContainerId = 'seo-header-scripts';
      let container = document.getElementById(headerContainerId);
      if (!container) {
        container = document.createElement('div');
        container.id = headerContainerId;
        container.style.display = 'none';
        document.head.appendChild(container);
      }
      container.innerHTML = settings.seo_header_scripts;
      
      // Execute scripts if any
      container.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    } else {
      const headerContainerId = 'seo-header-scripts';
      const container = document.getElementById(headerContainerId);
      if (container) container.innerHTML = '';
    }

    // Inject Footer Scripts
    if (settings?.seo_footer_scripts) {
      const footerContainerId = 'seo-footer-scripts';
      let container = document.getElementById(footerContainerId);
      if (!container) {
        container = document.createElement('div');
        container.id = footerContainerId;
        container.style.display = 'none';
        document.body.appendChild(container);
      }
      container.innerHTML = settings.seo_footer_scripts;

      // Execute scripts if any
      container.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    } else {
      const footerContainerId = 'seo-footer-scripts';
      const container = document.getElementById(footerContainerId);
      if (container) container.innerHTML = '';
    }
  }, [pageTitle, description, settings]);
};
