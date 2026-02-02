class Analytics {
  constructor() {
    this.enabled = process.env.NODE_ENV === 'production';
    this.queue = [];
  }

  // Initialize analytics
  init() {
    if (!this.enabled) return;

    // Google Analytics
    if (window.gtag) {
      window.gtag('js', new Date());
      window.gtag('config', process.env.REACT_APP_GA_ID || 'G-XXXXXXXXXX');
    }
  }

  // Track page views
  pageView(path) {
    if (!this.enabled) return;
    
    if (window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_ID, {
        page_path: path
      });
    }
  }

  // Track events
  event(category, action, label, value) {
    if (!this.enabled) {
      console.log('Analytics Event:', { category, action, label, value });
      return;
    }

    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  }

  // Track user actions
  trackProjectView(projectId) {
    this.event('Project', 'view', projectId);
  }

  trackProjectCreate(projectId) {
    this.event('Project', 'create', projectId);
  }

  trackProjectJoin(projectId) {
    this.event('Project', 'join', projectId);
  }

  trackSearch(query) {
    this.event('Search', 'query', query);
  }

  trackSignup(method = 'email') {
    this.event('Auth', 'signup', method);
  }

  trackLogin(method = 'email') {
    this.event('Auth', 'login', method);
  }

  // Track errors
  trackError(error, context) {
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message || error,
        fatal: false,
        context: context
      });
    }
  }

  // Track timing
  trackTiming(category, variable, time, label) {
    if (!this.enabled) return;

    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: time,
        event_category: category,
        event_label: label
      });
    }
  }

  // Track user properties
  setUserProperties(properties) {
    if (!this.enabled) return;

    if (window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  // Track custom dimensions
  setCustomDimension(index, value) {
    if (!this.enabled) return;

    if (window.gtag) {
      window.gtag('set', { [`dimension${index}`]: value });
    }
  }
}

const analytics = new Analytics();

export default analytics;

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackPageView: (path) => analytics.pageView(path),
    trackEvent: (category, action, label, value) => 
      analytics.event(category, action, label, value),
    trackProjectView: (id) => analytics.trackProjectView(id),
    trackProjectCreate: (id) => analytics.trackProjectCreate(id),
    trackProjectJoin: (id) => analytics.trackProjectJoin(id),
    trackSearch: (query) => analytics.trackSearch(query),
    trackError: (error, context) => analytics.trackError(error, context)
  };
};
