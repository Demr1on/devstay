// Framer Motion Animation Variants für Scroll-Animationen

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 60
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const fadeIn = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const slideInLeft = {
  initial: {
    opacity: 0,
    x: -60
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

export const slideInRight = {
  initial: {
    opacity: 0,
    x: 60
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const staggerItem = {
  initial: {
    opacity: 0,
    y: 40
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const numberCountUp = {
  initial: {
    opacity: 0,
    scale: 0.5
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}; 