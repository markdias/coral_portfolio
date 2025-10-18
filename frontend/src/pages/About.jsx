import pageStyles from '../styles/PageSections.module.css';
import { useData } from '../store/DataContext.jsx';
import Reveal from '../components/Reveal.jsx';
import { resolveFontFamily } from '../utils/typography.js';

const About = () => {
  const { data } = useData();
  const { about } = data;
  const typography = data.typography || {};
  const eyebrowFont = resolveFontFamily(typography, 'about.eyebrow');
  const titleFont = resolveFontFamily(typography, 'about.title');

  return (
    <div className={pageStyles.gridTwoColumn}>
      <Reveal as="div" className={pageStyles.textBlock}>
        {about.eyebrow ? (
          <Reveal
            as="span"
            className={pageStyles.heroEyebrow}
            delay={0.05}
            style={{ fontFamily: eyebrowFont }}
          >
            {about.eyebrow}
          </Reveal>
        ) : null}
        <Reveal as="h1" delay={0.1} style={{ fontFamily: titleFont }}>
          {about.title}
        </Reveal>
        {about.paragraphs?.map((paragraph, index) => (
          <Reveal
            as="p"
            key={`${paragraph.slice(0, 24)}-${index}`}
            delay={0.14 + index * 0.08}
            style={{ fontFamily: resolveFontFamily(typography, `about.paragraphs.${index}`, 'serif') }}
          >
            {paragraph}
          </Reveal>
        ))}
        {about.capabilities?.length ? (
          <Reveal as="div" className={pageStyles.callout} delay={0.26}>
            <strong>Capabilities</strong>
            <ul className={pageStyles.calloutList}>
              {about.capabilities.map((capability, index) => (
                <li
                  key={`${capability}-${index}`}
                  style={{ fontFamily: resolveFontFamily(typography, `about.capabilities.${index}`, 'sans') }}
                >
                  {capability}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </Reveal>
      <div className={pageStyles.gridTwoColumn}>
        {about.stats?.map((stat, index) => {
          const valueFont = resolveFontFamily(typography, `about.stats.${stat.id}.value`, 'display');
          const labelFont = resolveFontFamily(typography, `about.stats.${stat.id}.label`, 'sans');
          const descriptionFont = resolveFontFamily(
            typography,
            `about.stats.${stat.id}.description`,
            'sans'
          );

          return (
            <Reveal as="div" key={stat.id} className={pageStyles.statBlock} delay={0.18 + index * 0.08}>
              <p className={pageStyles.statValue} style={{ fontFamily: valueFont }}>
                {stat.value}
              </p>
              <p className={pageStyles.statLabel} style={{ fontFamily: labelFont }}>
                {stat.label}
              </p>
              {stat.description ? (
                <p className={pageStyles.statDescription} style={{ fontFamily: descriptionFont }}>
                  {stat.description}
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
