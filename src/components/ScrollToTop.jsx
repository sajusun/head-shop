// components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // যদি হ্যাশ থাকে (যেমন #section-id) তাহলে সেটাতে স্ক্রল করবে
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    // নাহলে টপে স্ক্রল করবে
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 'smooth' দিলে নরম স্ক্রল হবে
    });
  }, [pathname, search, hash]); // pathname, search অথবা hash পরিবর্তন হলে ট্রিগার হবে

  return null;
};

export default ScrollToTop;