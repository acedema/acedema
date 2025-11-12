import Image from 'next/image';
import styles from './Header.module.css';


interface Achievement {
  title: string;
  description: string;
}

interface HeaderProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  textBlock: string;
  achievements?: Achievement[];
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, imageUrl, imageAlt, textBlock, achievements }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={1200}
          height={600}
          className={styles.bandaimg}
          sizes="(max-width: 600px) 100vw, (max-width: 992px) 900px, 1200px"
        />
      </div>
      <div className={styles.contentSection}>
        <div className={styles.textBlock}>
          <p>{textBlock}</p>
        </div>
        {achievements && achievements.length > 0 && (
          <div className={styles.achievements}>
            {achievements.map((achievement, index) => (
              <div key={index} className={styles.achievement}>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
