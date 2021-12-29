import favicon from '../../assets/favicon/favicon.ico';
import appleIcon57 from '../../assets/favicon/apple-icon-57x57.png';
import appleIcon60 from '../../assets/favicon/apple-icon-60x60.png';
import appleIcon72 from '../../assets/favicon/apple-icon-72x72.png';
import appleIcon76 from '../../assets/favicon/apple-icon-76x76.png';
import appleIcon114 from '../../assets/favicon/apple-icon-114x114.png';
import appleIcon120 from '../../assets/favicon/apple-icon-120x120.png';
import appleIcon144 from '../../assets/favicon/apple-icon-144x144.png';
import appleIcon152 from '../../assets/favicon/apple-icon-152x152.png';
import appleIcon180 from '../../assets/favicon/apple-icon-180x180.png';
import favicon16 from '../../assets/favicon/favicon-16x16.png';
import favicon32 from '../../assets/favicon/favicon-32x32.png';
import favicon96 from '../../assets/favicon/favicon-96x96.png';
import favicon192 from '../../assets/favicon/favicon-192x192.png';
import faviconMs144 from '../../assets/favicon/ms-icon-144x144.png';

const Favicon = () => {
  return (
    <>
      <link rel="shortcut icon" href={favicon.src} />
      <link rel="apple-touch-icon" sizes="57x57" href={appleIcon57.src} />
      <link rel="apple-touch-icon" sizes="60x60" href={appleIcon60.src} />
      <link rel="apple-touch-icon" sizes="72x72" href={appleIcon72.src} />
      <link rel="apple-touch-icon" sizes="76x76" href={appleIcon76.src} />
      <link rel="apple-touch-icon" sizes="114x114" href={appleIcon114.src} />
      <link rel="apple-touch-icon" sizes="120x120" href={appleIcon120.src} />
      <link rel="apple-touch-icon" sizes="144x144" href={appleIcon144.src} />
      <link rel="apple-touch-icon" sizes="152x152" href={appleIcon152.src} />
      <link rel="apple-touch-icon" sizes="180x180" href={appleIcon180.src} />
      <link rel="icon" type="image/png" sizes="16x16" href={favicon16.src} />
      <link rel="icon" type="image/png" sizes="32x32" href={favicon32.src} />
      <link rel="icon" type="image/png" sizes="96x96" href={favicon96.src} />
      <link rel="icon" type="image/png" sizes="192x192" href={favicon192.src} />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content={faviconMs144.src} />
      <meta name="theme-color" content="#ffffff" />
    </>
  );
};

export default Favicon;
