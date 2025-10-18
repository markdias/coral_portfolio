import pageStyles from '../styles/PageSections.module.css';
import { useData } from '../store/DataContext.jsx';
import Reveal from '../components/Reveal.jsx';

const FONT_FAMILIES = {
  display: "'Playfair Display', 'Times New Roman', serif",
  sans: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  serif: "'Georgia', 'Times New Roman', serif"
};

const getFontFamily = (fontKey, fallbackKey) => FONT_FAMILIES[fontKey] ?? FONT_FAMILIES[fallbackKey] ?? FONT_FAMILIES.display;

const About = () => {
  const { data } = useData();
  const { about } = data;

  return (
    <div className={pageStyles.gridTwoColumn}>
      <Reveal as="div" className={pageStyles.textBlock}>
        {about.eyebrow ? (
          <Reveal as="span" className={pageStyles.heroEyebrow} delay={0.05}>
            {about.eyebrow}
          </Reveal>
        ) : null}
        <Reveal as="h1" delay={0.1}>
          {about.title}
        </Reveal>
        {about.paragraphs?.map((paragraph, index) => (
          <Reveal as="p" key={`${paragraph.slice(0, 24)}-${index}`} delay={0.14 + index * 0.08}>
            {paragraph}
          </Reveal>
        ))}
        {about.capabilities?.length ? (
          <Reveal as="div" className={pageStyles.callout} delay={0.26}>
            <strong>Capabilities</strong>
            <span>
              {about.capabilities.join(' • ')}
            </span>
          </Reveal>
        ) : null}
      </Reveal>
      <div className={pageStyles.gridTwoColumn}>
        {about.stats?.map((stat, index) => {
          const statWithDefaults = {
            valueFont: 'display',
            labelFont: 'sans',
            descriptionFont: 'sans',
            ...stat
          };

          return (
            <Reveal as="div" key={stat.id} className={pageStyles.statBlock} delay={0.18 + index * 0.08}>
              <p
                className={pageStyles.statValue}
                style={{ fontFamily: getFontFamily(statWithDefaults.valueFont, 'display') }}
              >
                {statWithDefaults.value}
              </p>
              <p
                className={pageStyles.statLabel}
                style={{ fontFamily: getFontFamily(statWithDefaults.labelFont, 'sans') }}
              >
                {statWithDefaults.label}
              </p>
              {statWithDefaults.description ? (
                <p
                  className={pageStyles.statDescription}
                  style={{ fontFamily: getFontFamily(statWithDefaults.descriptionFont, 'sans') }}
                >
                  {statWithDefaults.description}
                </p>
              ) : null}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};

export default About;
