import pageStyles from '../styles/PageSections.module.css';
import { useData } from '../store/DataContext.jsx';
import Reveal from '../components/Reveal.jsx';
import { getFontFamily } from '../utils/typography.js';

const About = () => {
  const { data } = useData();
  const { about } = data;
  const aboutFont = getFontFamily(data.typography?.about);

  return (
    <div className={pageStyles.gridTwoColumn}>
      <Reveal as="div" className={pageStyles.textBlock}>
        {about.eyebrow ? (
          <Reveal
            as="span"
            className={pageStyles.heroEyebrow}
            delay={0.05}
            style={{ fontFamily: aboutFont }}
          >
            {about.eyebrow}
          </Reveal>
        ) : null}
        <Reveal as="h1" delay={0.1} style={{ fontFamily: aboutFont }}>
          {about.title}
        </Reveal>
        {about.paragraphs?.map((paragraph, index) => (
          <Reveal
            as="p"
            key={`${paragraph.slice(0, 24)}-${index}`}
            delay={0.14 + index * 0.08}
            style={{ fontFamily: aboutFont }}
          >
            {paragraph}
          </Reveal>
        ))}
        {about.capabilities?.length ? (
          <Reveal as="div" className={pageStyles.callout} delay={0.26} style={{ fontFamily: aboutFont }}>
            <strong>Capabilities</strong>
            <span>
              {about.capabilities.join(' • ')}
            </span>
          </Reveal>
        ) : null}
      </Reveal>
      <div className={pageStyles.gridTwoColumn}>
        {about.stats?.map((stat, index) => {
          return (
            <Reveal as="div" key={stat.id} className={pageStyles.statBlock} delay={0.18 + index * 0.08}>
              <p className={pageStyles.statValue} style={{ fontFamily: aboutFont }}>
                {stat.value}
              </p>
              <p className={pageStyles.statLabel} style={{ fontFamily: aboutFont }}>
                {stat.label}
              </p>
              {stat.description ? (
                <p className={pageStyles.statDescription} style={{ fontFamily: aboutFont }}>
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
