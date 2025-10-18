import PropTypes from 'prop-types';
import { forwardRef, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const intrinsicMotionMap = {
  a: motion.a,
  article: motion.article,
  aside: motion.aside,
  button: motion.button,
  div: motion.div,
  footer: motion.footer,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  header: motion.header,
  li: motion.li,
  main: motion.main,
  nav: motion.nav,
  p: motion.p,
  section: motion.section,
  span: motion.span,
  ul: motion.ul
};

const Reveal = forwardRef(
  (
    {
      as = 'div',
      delay = 0,
      children,
      className = '',
      variants,
      initial,
      animate,
      ...props
    },
    ref
  ) => {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = useMemo(() => {
    if (typeof as === 'string') {
      return intrinsicMotionMap[as] ?? motion.div;
    }

    return motion(as);
  }, [as]);

  if (shouldReduceMotion) {
    const Component = as;
    return (
      <Component ref={ref} className={className} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={initial ?? 'hidden'}
      animate={animate ?? 'visible'}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      variants={
        variants ?? {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 }
        }
      }
      {...props}
    >
      {children}
    </MotionComponent>
  );
  }
);

Reveal.displayName = 'Reveal';

Reveal.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object
  ]),
  delay: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  variants: PropTypes.object,
  initial: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  animate: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default Reveal;
