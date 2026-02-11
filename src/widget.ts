import styles from './widget.css?inline'; // Vite handles inline CSS

interface Review {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface ReviewsData {
  name: string;
  rating: number;
  user_ratings_total: number;
  url: string;
  address: string;
  reviews: Review[];
}

export class GoogleReviewsWidget extends HTMLElement {
  private _src: string = 'reviews.json';
  private _data: ReviewsData | null = null;

  static get observedAttributes() {
    return ['src', 'theme', 'layout', 'lang', 'min-rating', 'sort'];
  }

  private _translations: Record<string, any> = {
    en: { rating_label: "Google Rating", reviews: "reviews", write_review: "Write a review", read_more: "Read more" },
    fr: { rating_label: "Avis Google", reviews: "avis", write_review: "Écrire un avis", read_more: "Lire la suite" },
    es: { rating_label: "Valoración Google", reviews: "reseñas", write_review: "Escribir reseña", read_more: "Leer más" },
    de: { rating_label: "Google Bewertung", reviews: "Rezensionen", write_review: "Bewertung schreiben", read_more: "Weiterlesen" },
    it: { rating_label: "Valutazione Google", reviews: "recensioni", write_review: "Scrivi una recensione", read_more: "Leggi tutto" },
    pt: { rating_label: "Avaliação Google", reviews: "avaliações", write_review: "Escrever avaliação", read_more: "Ler mais" },
    nl: { rating_label: "Google Beoordeling", reviews: "beoordelingen", write_review: "Schrijf een beoordeling", read_more: "Lees meer" },
    pl: { rating_label: "Ocena Google", reviews: "opinii", write_review: "Napisz opinię", read_more: "Czytaj więcej" },
    ru: { rating_label: "Рейтинг Google", reviews: "отзывов", write_review: "Написать отзыв", read_more: "Читать далее" },
    ja: { rating_label: "Google のクチコミ", reviews: "件のクチコミ", write_review: "クチコミを書く", read_more: "続きを読む" },
    ko: { rating_label: "Google 평점", reviews: "개의 리뷰", write_review: "리뷰 작성", read_more: "더 보기" },
    zh: { rating_label: "Google 评分", reviews: "条评论", write_review: "撰写评论", read_more: "阅读更多" }
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === 'src') {
        this._src = newValue;
        this.fetchReviews();
      } else {
        this.render();
      }
    }
  }

  connectedCallback() {
    if (this.hasAttribute('src')) {
      this._src = this.getAttribute('src')!;
    }
    this.initObserver();
  }

  initObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.fetchReviews();
            observer.disconnect();
          }
        });
      }, { rootMargin: '200px' }); // Load when within 200px of viewport
      observer.observe(this);
    } else {
      // Fallback for older browsers
      this.fetchReviews();
    }
  }

  async fetchReviews() {
    try {
      const response = await fetch(this._src);
      if (!response.ok) throw new Error('Failed to load reviews');
      this._data = await response.json();
      this.injectSchemaOrg();
      this.render();
    } catch (error) {
      console.error('Google Reviews Widget Error:', error);
      this.renderError();
    }
  }

  injectSchemaOrg() {
    if (!this._data) return;
    const scriptId = 'google-reviews-schema';
    if (document.getElementById(scriptId)) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": this._data.name,
      "address": this._data.address,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": this._data.rating,
        "reviewCount": this._data.user_ratings_total
      }
    };

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  renderError() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="widget-error">
        Failed to load reviews. Please check your connection or configuration.
      </div>
    `;
  }

  render() {
    if (!this.shadowRoot || !this._data) return;

    const theme = this.getAttribute('theme') || 'light';
    const layout = this.getAttribute('layout') || 'grid';
    const lang = this.getAttribute('lang') || 'en';
    const t = this._translations[lang] || this._translations['en'];

    // SVG Icons
    const starIcon = (filled: boolean) => `
      <svg class="star-icon ${filled ? 'filled' : ''}" viewBox="0 0 24 24" width="16" height="16">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    `;

    const googleLogo = `
      <svg viewBox="0 0 24 24" width="18" height="18" class="google-logo">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 4.6c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    `;

    // Header HTML
    const headerHtml = `
      <div class="widget-header">
        <div class="header-left">
          <div class="google-badge">
            ${googleLogo}
            <span>${t.rating_label}</span>
          </div>
          <div class="rating-badge">
            <span class="score">${this._data.rating}</span>
            <div class="stars">
              ${Array(5).fill(0).map((_, i) => starIcon(i < Math.round(this._data!.rating))).join('')}
            </div>
            <span class="count">${this._data.user_ratings_total} ${t.reviews}</span>
          </div>
        </div>
        <a href="${this._data.url}" target="_blank" class="write-btn">${t.write_review}</a>
      </div>
    `;

    // Filter & Sort Reviews
    const minRating = parseFloat(this.getAttribute('min-rating') || '0');
    const sort = this.getAttribute('sort') || 'newest';

    const filteredReviews = this._data.reviews
      .filter(review => review.rating >= minRating)
      .sort((a, b) => {
        if (sort === 'oldest') return a.time - b.time;
        if (sort === 'highest') return b.rating - a.rating;
        if (sort === 'lowest') return a.rating - b.rating;
        if (sort === 'random') return 0.5 - Math.random();
        return b.time - a.time; // Default: newest
      });

    // Reviews HTML
    const reviewsHtml = filteredReviews.map((review, index) => {
      const textExceedsLimit = review.text.length > 120;
      const truncatedText = textExceedsLimit ? review.text.substring(0, 120) + '...' : review.text;

      return `
      <div class="review-card" style="animation-delay: ${index * 100}ms">
        <div class="review-header">
          <img src="${review.profile_photo_url}" alt="${review.author_name}" loading="lazy">
          <div class="review-meta">
            <span class="author-name">${review.author_name}</span>
            <span class="review-time">${review.relative_time_description}</span>
          </div>
          <a href="${review.author_url}" target="_blank" class="google-icon-link">${googleLogo}</a>
        </div>
        <div class="review-stars">
          ${Array(5).fill(0).map((_, i) => starIcon(i < review.rating)).join('')}
        </div>
        <div class="review-text-container">
            <div class="review-text short">${truncatedText}</div>
            ${textExceedsLimit ? `<div class="review-text full" style="display:none">${review.text}</div>` : ''}
            ${textExceedsLimit ? `<button class="read-more-btn">${t.read_more}</button>` : ''}
        </div>
      </div>
    `}).join('');

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="widget-container ${theme} ${layout}">
        ${layout === 'badge' ? this.renderBadge() : `
          ${headerHtml}
          <div class="reviews-container">
            ${reviewsHtml}
          </div>
        `}
      </div>
    `;

    // Add event listeners for Read More
    this.shadowRoot.querySelectorAll('.read-more-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const container = target.parentElement;
        if (container) {
          const shortText = container.querySelector('.short') as HTMLElement;
          const fullText = container.querySelector('.full') as HTMLElement;

          if (shortText && fullText) {
            shortText.style.display = 'none';
            fullText.style.display = 'block';
            target.style.display = 'none';
          }
        }
      });
    });
  }

  renderBadge() {
    const t = this._translations[this.getAttribute('lang') || 'en'] || this._translations['en'];

    const starIcon = (filled: boolean) => `
      <svg class="star-icon ${filled ? 'filled' : ''}" viewBox="0 0 24 24" width="14" height="14">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    `;

    const googleLogo = `
      <svg viewBox="0 0 24 24" width="20" height="20" class="google-logo">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 4.6c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    `;

    return `
      <div class="badge-content">
        <div class="badge-left">
          ${googleLogo}
          <div class="badge-text">
            <div class="badge-rating">
              <strong>${this._data?.rating}</strong>
              <div class="stars">
                ${Array(5).fill(0).map((_, i) => starIcon(i < Math.round(this._data?.rating || 0))).join('')}
              </div>
            </div>
            <span class="badge-count">${this._data?.user_ratings_total} ${t.reviews}</span>
          </div>
        </div>
        <a href="${this._data?.url}" target="_blank" class="badge-btn">${t.write_review}</a>
      </div>
    `;
  }
}

customElements.define('google-reviews-widget', GoogleReviewsWidget);
