
import { Variants } from "framer-motion";

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Container variants for staggered children
export const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Item variants for staggered animations
export const itemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Card variants
export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98
  }
};

// Button variants
export const buttonVariants: Variants = {
  initial: {
    scale: 1
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

// Sidebar variants
export const sidebarVariants: Variants = {
  expanded: {
    width: "16rem",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  collapsed: {
    width: "4rem",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.05
    }
  }
};

// Sidebar content variants
export const sidebarContentVariants: Variants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: 0.2
    }
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2
    }
  }
};

// Modal variants
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Fade variants
export const fadeVariants: Variants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

// Slide variants
export const slideVariants: Variants = {
  initial: (direction: string) => ({
    x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
    y: direction === "up" ? -100 : direction === "down" ? 100 : 0,
    opacity: 0
  }),
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: (direction: string) => ({
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  })
};

// Spring configurations
export const springConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25
};

export const gentleSpring = {
  type: "spring",
  stiffness: 100,
  damping: 20
};

export const bounceSpring = {
  type: "spring",
  stiffness: 300,
  damping: 15
};
