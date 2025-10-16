import pageStyles from '../styles/PageSections.module.css';
import { useData } from '../store/DataContext.jsx';

const About = () => {
  const { data } = useData();
  const { about } = data;

  return (
    <div className={pageStyles.gridTwoColumn}>
      <div className={pageStyles.textBlock}>
        {about.eyebrow ? <span className={pageStyles.heroEyebrow}>{about.eyebrow}</span> : null}
        <h1>{about.title}</h1>
        {about.paragraphs?.map((paragraph, index) => (
          <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
        ))}
        {about.capabilities?.length ? (
          <div className={pageStyles.callout}>
            <strong>Capabilities</strong>
            <span>
              {about.capabilities.join(' • ')}
            </span>
          </div>
        ) : null}
      </div>
      <div className={pageStyles.gridTwoColumn}>
        {about.stats?.map((stat) => (
          <div key={stat.id} className={pageStyles.statBlock}>
            <p className={pageStyles.statValue}>{stat.value}</p>
            <p className={pageStyles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
