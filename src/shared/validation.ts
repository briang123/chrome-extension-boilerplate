import {
  ExtensionConfig,
  ValidationResult,
  AuthMethod,
  PricingModel,
  SmartDefaults,
} from './types.js';

export function validateConfig(config: ExtensionConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!config.extensionName?.trim()) {
    errors.push('Extension name is required');
  }

  if (!config.extensionDescription?.trim()) {
    errors.push('Extension description is required');
  }

  if (!config.uiType) {
    errors.push('UI type is required');
  }

  // Authentication validation
  if (config.authMethods && config.authMethods.length > 0) {
    const hasAuth = config.authMethods.some((method) => method !== 'none');
    if (hasAuth && config.database === 'none') {
      errors.push('Authentication requires a database. Please select a database option.');
    }
  }

  // Pricing validation
  if (config.pricingModel && config.pricingModel !== 'none' && config.database === 'none') {
    errors.push('Pricing model requires a database. Please select a database option.');
  }

  // Website validation
  if (config.includeWebsite) {
    if (config.includePricing && config.pricingModel === 'none') {
      warnings.push(
        'Website includes pricing information but no pricing model is selected. Consider adding a pricing model.',
      );
    }

    if (config.includeAuth && (!config.authMethods || config.authMethods.includes('none'))) {
      warnings.push(
        'Website includes authentication features but no authentication methods are selected. Consider adding authentication methods.',
      );
    }
  }

  // Cookie banner validation
  if (config.includeCookieBanner && !config.includeWebsite) {
    warnings.push(
      'Cookie banner is selected but website is not included. Cookie banners are typically used on websites.',
    );
  }

  // AI validation
  if (config.aiProviders && config.aiProviders.some((provider) => provider !== 'none')) {
    if (config.database === 'none') {
      warnings.push(
        'AI features are selected but no database is configured. Consider adding a database for conversation history and user preferences.',
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function getSmartDefaults(config: Partial<ExtensionConfig>): SmartDefaults {
  const defaults: SmartDefaults = {
    database: 'none',
    includePricing: false,
    includeAuth: false,
    includeTestimonials: false,
    websiteFramework: 'nextjs',
  };

  // Smart defaults based on selected features
  if (config.authMethods && config.authMethods.some((method) => method !== 'none')) {
    defaults.database = 'firebase';
    defaults.includeAuth = true;
  }

  if (config.pricingModel && config.pricingModel !== 'none') {
    defaults.database = 'firebase';
    defaults.includePricing = true;
  }

  if (config.includeWebsite) {
    if (config.pricingModel && config.pricingModel !== 'none') {
      defaults.includePricing = true;
    }

    if (config.authMethods && config.authMethods.some((method) => method !== 'none')) {
      defaults.includeAuth = true;
    }

    // Choose Vite for simple sites, Next.js for complex ones
    if (
      config.includeBlog ||
      config.includeSearch ||
      config.includeAPIDocs ||
      config.includeUserDashboard
    ) {
      defaults.websiteFramework = 'nextjs';
    } else if (!config.includePricing && !config.includeAuth && !config.includeTestimonials) {
      // Simple landing page - could use Vite
      defaults.websiteFramework = 'vite';
    }
  }

  return defaults;
}

export function applySmartDefaults(config: ExtensionConfig): ExtensionConfig {
  const defaults = getSmartDefaults(config);

  return {
    ...config,
    database:
      config.database === 'none' && defaults.database !== 'none'
        ? defaults.database
        : config.database,
    includePricing: config.includePricing || defaults.includePricing,
    includeAuth: config.includeAuth || defaults.includeAuth,
    includeTestimonials: config.includeTestimonials || defaults.includeTestimonials,
    websiteFramework: config.websiteFramework || defaults.websiteFramework,
  };
}
