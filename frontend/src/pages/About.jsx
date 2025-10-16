import pageStyles from '../styles/PageSections.module.css';

const About = () => {
  return (
    <div className={pageStyles.gridTwoColumn}>
      <div className={pageStyles.textBlock}>
        <span className={pageStyles.heroEyebrow}>Studio ethos</span>
        <h1>Tactile research for poetic climate futures</h1>
        <p>
          Coral Portfolio Studio is an interdisciplinary atelier of textile artists, marine biologists, filmmakers, and cultural strategists. We translate reef data into fabrics, light, and movement, threading research through haute silhouettes and immersive scenography.
        </p>
        <p>
          Every commission begins in tidepools and archives, then evolves into experiences that travel runways, museums, and coastlines. We work in concert with local stewards so each story funds restoration, trains youth, and invites visitors to steward reefs as living relatives.
        </p>
        <div className={pageStyles.callout}>
          <strong>Capabilities</strong>
          <span>
            Expedition couture direction, tactile data weaving, underwater cinematography, climate curriculum design, spatial audio scoring, and philanthropic activation.
          </span>
        </div>
      </div>
      <div className={pageStyles.gridTwoColumn}>
        <div className={pageStyles.statBlock}>
          <p className={pageStyles.statValue}>48</p>
          <p className={pageStyles.statLabel}>Field deployments completed</p>
        </div>
        <div className={pageStyles.statBlock}>
          <p className={pageStyles.statValue}>12</p>
          <p className={pageStyles.statLabel}>Partner nations engaged</p>
        </div>
        <div className={pageStyles.statBlock}>
          <p className={pageStyles.statValue}>36K</p>
          <p className={pageStyles.statLabel}>Visitors immersed in our experiences</p>
        </div>
        <div className={pageStyles.statBlock}>
          <p className={pageStyles.statValue}>92%</p>
          <p className={pageStyles.statLabel}>Participants reporting increased ocean empathy</p>
        </div>
      </div>
    </div>
  );
};

export default About;
